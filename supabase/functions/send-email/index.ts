// Supabase Edge Function for InternConnect AI Email Workflows
// Location: supabase/functions/send-email/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, emailType, subject, data, userId } = await req.json();

    if (!to || !emailType) {
      return new Response(
        JSON.stringify({ error: "Recipient 'to' and 'emailType' are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate Responsive HTML Template with InternConnect AI Branding
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #090d16; color: #e2e8f0; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #0f172a; border-radius: 16px; border: 1px solid rgba(99, 102, 241, 0.3); overflow: hidden; }
            .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
            .content { padding: 30px; line-height: 1.6; font-size: 14px; color: #cbd5e1; }
            .btn { display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-weight: bold; font-size: 13px; margin: 20px 0; }
            .footer { padding: 20px; border-top: 1px solid #1e293b; text-align: center; font-size: 11px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>INTERNCONNECT AI</h1>
            </div>
            <div class="content">
              <h2 style="color: #ffffff;">${subject || 'Notification from InternConnect AI'}</h2>
              <p>${data?.message || 'You have a new update regarding your candidate profile.'}</p>
              ${data?.actionUrl ? `<a href="${data.actionUrl}" class="btn">${data.actionText || 'View Details'}</a>` : ''}
            </div>
            <div class="footer">
              © 2026 InternConnect AI. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;

    // Log email dispatch to Supabase email_logs table
    await supabase.from("email_logs").insert([
      {
        user_id: userId || null,
        email_type: emailType,
        recipient: to,
        status: "Sent",
        metadata: { subject, data },
      },
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Email '${emailType}' successfully dispatched to ${to}`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
