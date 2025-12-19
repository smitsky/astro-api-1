export const prerender = false;
import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase once outside the handler
const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY
);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: "Invalid or missing prompt" }), { status: 400 });
    }

    // 1. Initialize Gemini
    const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 2. Generate Content
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 3. Store in Supabase
    const { error: dbError } = await supabase
      .from('logs')
      .insert({ prompt, response: responseText });

    if (dbError) {
      console.error("Database Error:", dbError.message);
      // Decide if you want to fail the whole request if DB storage fails
    }

    return new Response(JSON.stringify({ response: responseText }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    console.error("API Route Error:", err);
    return new Response(JSON.stringify({ error: err.message || "An unexpected error occurred" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};