/**
 * Vercel Serverless Function proxying Gemini API calls to keep key secret.
 * Sri Velan & Co Corporate PWD AI Estimator & Specification Planner.
 */

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Content-Type", "application/json");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Enforce POST method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Vercel parses req.body for JSON requests, but fallback if it is a string
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { prompt } = body || {};

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Input prompt is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ 
        error: "GEMINI_API_KEY is not configured on Vercel. Please set it in your Vercel Project Settings > Environment Variables." 
      });
    }

    // Call the Google Gemini API directly using Node's native fetch
    const model = "gemini-3.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const systemInstruction = 
      "You are an elite, highly professional PWD/WRD civil contracting consultant representing " +
      "Sri Velan & Co (Class I Contractors). " +
      "Analyze the client's engineering request. Generate a structured plan with 3 to 4 clear, elegant, markdown-bullet-pointed steps, " +
      "covering tactical solutions, recommended fleet machineries (e.g., Tractor-Mounted Hydraulic Broomer, Vacuum Suction Pumps, " +
      "Hydraulic Earthmovers, dewatering setups), and administrative/regulatory compliance (PWD registration, safety codes, WRD approvals). " +
      "Maintain an authoritative, precise, and supportive engineering tone. Do not expose private credentials.";

    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "aistudio-build"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `Gemini API responded with error: ${errText}` });
    }

    const data: any = await response.json();
    
    // Extract text representation safely compatible with candidates structure
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      return res.status(500).json({ error: "Invalid response model returned from Gemini. Empty text." });
    }

    return res.status(200).json({ text: generatedText });

  } catch (err: any) {
    console.error("Vercel serverless generator function crash:", err);
    return res.status(500).json({ error: err.message || "An internal error occurred." });
  }
}
