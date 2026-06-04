/**
 * Netlify Serverless Function proxying Gemini API calls to keep key secret.
 * Sri Velan & Co Corporate PWD AI Estimator & Specification Planner.
 */

export const handler = async (event: any, context: any) => {
  // Set headers for CORS and JSON response
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  // Enforce POST method
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt || !prompt.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Input prompt is required." })
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 504,
        headers,
        body: JSON.stringify({ 
          error: "GEMINI_API_KEY is not configured on Netlify. Please set the environment variable." 
        })
      };
    }

    // Call the Google Gemini API directly using robust Node.js 18+ fetch API
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
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: `Gemini API responded with error: ${errText}` })
      };
    }

    const data: any = await response.json();
    
    // Extract text representation safely compatible with candidates structure
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Invalid response model returned from Gemini. Empty text." })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text: generatedText })
    };

  } catch (err: any) {
    console.error("Netlify serverless generator function crash:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || "An internal error occurred." })
    };
  }
};
