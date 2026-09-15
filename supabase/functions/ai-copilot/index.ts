// Supabase Edge Function: ai-copilot
// Description: Secure serverless gateway for Gemini 2.5 Flash API calls with conversation memory.

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
    const { message, userMessage = message, userRole = "student", userContext = {}, conversationHistory = [] } = await req.json();

    const queryMessage = userMessage || message;

    if (!queryMessage || (typeof queryMessage === "string" && !queryMessage.trim())) {
      return new Response(
        JSON.stringify({ success: false, error: "Message is required." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "GEMINI_API_KEY is missing in Supabase Edge Secrets.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const { name = "Candidate", skills = [], college = "", degree = "", companyName = "" } = userContext;
    const skillsList = Array.isArray(skills) ? skills.join(", ") : skills;

    const systemPrompt = `You are InternConnect AI Copilot.

You help university students and recruiters.

Candidate Context:
- Name: ${name}
- Role: ${userRole}
- College: ${college}
- Degree: ${degree}
- Skills: ${skillsList || "React, JavaScript, Data Structures, Python"}
${companyName ? `- Company: ${companyName}` : ''}

Your expertise includes:
* Internships
* Placements
* Resume optimization
* ATS scoring
* Cover letters
* Interview preparation
* Java
* Python
* C
* React
* Data Structures
* Operating Systems
* Career planning
* GitHub
* LinkedIn
* Coding projects

Answer naturally like ChatGPT.
Be concise but practical.
If the user asks general programming or career questions, answer them instead of refusing.
If the user asks for mock interview practice, ask one relevant question at a time, wait for their answer, evaluate it with feedback, and then ask the next question.`;

    const geminiContents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: `Understood! I am InternConnect AI Copilot. I am ready to answer any programming, internship, resume, or career questions.` }] },
    ];

    // Append last 10 messages for conversation memory
    (conversationHistory || []).slice(-10).forEach((msg: any) => {
      geminiContents.push({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      });
    });

    geminiContents.push({
      role: "user",
      parts: [{ text: queryMessage }],
    });

    // Models ordered by priority: Gemini 2.5 Flash primary
    const candidateModels = ["gemini-2.5-flash", "gemini-3.6-flash", "gemini-1.5-flash"];
    let replyText = "";
    let selectedModel = "";
    let lastErrorMsg = "";

    for (const model of candidateModels) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: geminiContents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          }),
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            replyText = text.trim();
            selectedModel = model;
            break;
          }
        } else {
          const errData = await geminiRes.json().catch(() => ({}));
          lastErrorMsg = errData?.error?.message || `HTTP ${geminiRes.status}`;
        }
      } catch (err: any) {
        lastErrorMsg = err.message;
      }
    }

    if (!replyText) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Gemini service error: ${lastErrorMsg || "Failed to generate content"}`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 502 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        model: selectedModel,
        reply: replyText,
        text: replyText,
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
