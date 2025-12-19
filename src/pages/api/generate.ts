import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: "No prompt provided" }), { status: 400 });
    }

    // 1. Initialize Gemini
    const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 2. Generate Content
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 3. Store in Supabase
    const supabase = createClient(
      import.meta.env.SUPABASE_URL, 
      import.meta.env.SUPABASE_ANON_KEY
    );
    
    const { error } = await supabase
      .from('logs')
      .insert({ prompt: prompt, response: responseText });

    if (error) console.error("Supabase Error:", error);

    return new Response(JSON.stringify({ message: responseText }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};