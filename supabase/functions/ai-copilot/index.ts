// Supabase Edge Function: ai-copilot
// Description: Secure serverless gateway for Gemini 1.5 Flash API calls with personalized context memory.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userMessage, userRole = "student", userContext = {}, conversationHistory = [] } = await req.json();

    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "GEMINI_API_KEY is missing in Supabase Edge Secrets.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const { name = "Candidate", skills = [], college = "", degree = "", companyName = "" } = userContext;
    const skillsList = Array.isArray(skills) ? skills.join(", ") : skills;

    const systemPrompt = userRole === "company"
      ? `You are InternConnect AI Copilot — an Executive Talent Recruiter & Hiring Advisor for ${companyName || 'Recruiters'}.
Your capabilities include:
1. Ranking candidates based on job specifications
2. Writing high-converting internship descriptions
3. Formulating technical & HR interview questions
4. Drafting polite candidate rejection emails & offer letters

Respond professionally, practically, and concisely.`
      : `You are InternConnect AI Copilot — an expert Career Mentor & Tech Recruiter for student ${name}.
Student Context:
- Name: ${name}
- College: ${college}
- Degree: ${degree}
- Skills: ${skillsList || "React, JavaScript, Software Engineering"}

Your core capabilities include:
1. Recommending tailored internships based on skills
2. Analyzing resumes and explaining missing skills
3. Generating ATS-optimized cover letters
4. Preparing technical/HR/behavioral interview questions
5. Creating step-by-step career roadmaps

IMPORTANT: Address the student directly by name (${name}) and reference their specific background and skills in recommendations!`;

    const geminiContents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: `Understood! I am ready to act as ${name}'s InternConnect AI Copilot.` }] },
    ];

    // Append past context messages
    (conversationHistory || []).slice(-6).forEach((msg: any) => {
      geminiContents.push({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      });
    });

    geminiContents.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: geminiContents }),
    });

    if (!geminiRes.ok) {
      throw new Error(`Gemini API HTTP Error: ${geminiRes.status}`);
    }

    const geminiData = await geminiRes.json();
    const replyText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "I am here to assist with your career and internship search!";

    return new Response(
      JSON.stringify({
        success: true,
        source: "gemini-1.5-flash-edge",
        reply: replyText.trim(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
