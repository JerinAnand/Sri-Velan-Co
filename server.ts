import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  
  // Parse JSON payloads
  app.use(express.json());

  // Log simple requests in dev context
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  // Server-side AI Estimator route
  const handleAiGeneration = async (req: express.Request, res: express.Response) => {
    try {
      const { prompt } = req.body;
      if (!prompt || !prompt.trim()) {
        res.status(400).json({ error: "Input prompt is required." });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(503).json({
          error: "GEMINI_API_KEY environment variable is not configured. Please add it to Settings > Secrets in AI Studio development panel."
        });
        return;
      }

      // Initialize Google GenAI Client with standard user-agent header
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });

      const systemInstruction = 
        "You are an elite, highly professional PWD/WRD civil contracting consultant representing " +
        "Sri Velan & Co (Class I Contractors). " +
        "Analyze the client's engineering request. Generate a structured plan with 3 to 4 clear, elegant, markdown-bullet-pointed steps, " +
        "covering tactical solutions, recommended fleet machineries (e.g., Tractor-Mounted Hydraulic Broomer, Vacuum Suction Pumps, " +
        "Hydraulic Earthmovers, dewatering setups), and administrative/regulatory compliance (PWD registration, safety codes, WRD approvals). " +
        "Maintain an authoritative, precise, and supportive engineering tone. Do not expose private credentials.";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7
        }
      });

      const generatedText = response.text;
      if (!generatedText) {
        res.status(500).json({ error: "Recieved empty text representation from Gemini model." });
        return;
      }

      res.status(200).json({ text: generatedText });

    } catch (err: any) {
      console.error("Gemini API call or server-side execution failed:", err);
      res.status(500).json({ error: err.message || "An internal server error occurred while invoking Gemini." });
    }
  };

  // Support both endpoint paths to ensure complete backwards compatibility
  app.post("/.netlify/functions/generate", handleAiGeneration);
  app.post("/api/generate", handleAiGeneration);

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date() });
  });

  // Serve Vite in dev context or serve compiled files in production
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in DEVELOPMENT mode with Vite dev middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in PRODUCTION mode. Serving statics from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve build assets
    app.use(express.static(distPath));
    
    // SPA fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sri Velan & Co App running model on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Critical server crash on initialization:", error);
  process.exit(1);
});
