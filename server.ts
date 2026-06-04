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

  // Helper to parse and return human-friendly messages on Gemini API failures
  const cleanGeminiError = (err: any): string => {
    if (!err) return "An unknown error occurred while invoking the Gemini API.";
    
    const rawMessage = err.message || String(err);
    
    try {
      let parsed = JSON.parse(rawMessage);
      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }
      
      const googleError = parsed?.error;
      if (googleError) {
        const msg = googleError.message || "";
        const reason = googleError.details?.[0]?.reason || "";
        
        if (reason === "API_KEY_INVALID" || msg.includes("API Key") || msg.includes("API key")) {
          return "The configured Google Gemini API key is invalid or inactive (API_KEY_INVALID). Please open Settings > Secrets in AI Studio and make sure a valid Gemini API key is configured.";
        }
        return msg || `Gemini API responded with status ${googleError.status}`;
      }
    } catch (e) {
      // Message is not standard JSON
    }
    
    if (rawMessage.includes("API_KEY_INVALID") || rawMessage.includes("API Key not found") || rawMessage.includes("API key")) {
      return "The configured Google Gemini API key is invalid or inactive (API_KEY_INVALID). Please open Settings > Secrets in AI Studio and make sure a valid Gemini API key is configured.";
    }
    
    return rawMessage;
  };

  // High-fidelity fallback generator matching PWD Class I specifications
  const generateFallbackResponse = (prompt: string): string => {
    const p = (prompt || "").toLowerCase();
    
    // 1. Dewatering / pump / rainfall / drainage / flood / MLD
    if (
      p.includes("dewatering") || 
      p.includes("pump") || 
      p.includes("mld") || 
      p.includes("drain") || 
      p.includes("flood") || 
      p.includes("water") || 
      p.includes("subway") || 
      p.includes("canal") || 
      p.includes("discharge") ||
      p.includes("rain")
    ) {
      return `### **1. Operational Dewatering Plan & Hydrology Assessment**
* **Infiltration Rate Analysis**: Deploy a series of automated continuous-discharge pumps to combat heavy infiltration. Under standard Subway drainage indexes, a 4.5 MLD logging rate requires continuous 120-HP dynamic vacuum-assisted priming setups with a secondary drainage bypass contour.
* **Secondary Containment Layout**: Establish rigid steel suction manifolds and lay 8-inch reinforced, eye-rated PVC lay-flat layout paths to route discharges away from nearby residential structures directly into designated WRD storm drains.

### **2. Heavy-Duty Fleet Deployment & PWD/WRD Machineries**
* **High-Capacity Pumps**: Deploy three units of diesel-driven 6-inch sound-attenuated high-volume centrifugal pumps (minimum capacity 3,500 LPM per unit) to sustain water discharge at scale. 
* **Tractor & Loader Support**: Utilize a Mahindra Arjun 4WD tractor equipped with a heavy-duty PTO connection to power trailer-mounted auxiliary dewatering networks. Ensure on-site standby of JCB 3CX Backhoe Loaders for instant bund reinforcements.

### **3. Regulatory Accreditations & WRD Clearances**
* **Administrative Liaison**: Rapidly request emergency WRD permissions for temporary trunk line routing. Prepare structural site elevation indexes for PWD Chief Engineer authorization.
* **Contractor Classification**: Sri Velan & Co maintains Class I PWD Certification. All hydraulic lines and diesel engine decibel limits comply with local pollution standards (TNPCB norms) and district municipal corporation laws.

### **4. Strict Safety & PWD Compliance Protocols**
* **Site Zoning**: Position clear high-contrast physical barriers, hazard indicator tape, and warning signboards. Site staff must be equipped with Level C personal protection gear (high-visibility jackets, rubber boots, and industrial harness ropes).
* **Standby Protocols**: Setup a 24/7 technical operator roster with secondary backup generators in case of overnight grid failures or sudden peak storm-water surges.`;
    }

    // 2. Sweeper / broom / road / asphalt / pavement / highway / cleaning
    if (
      p.includes("broom") || 
      p.includes("sweeper") || 
      p.includes("road") || 
      p.includes("asphalt") || 
      p.includes("pave") || 
      p.includes("dust") || 
      p.includes("highway") ||
      p.includes("clean")
    ) {
      return `### **1. Advanced Road Pavement Cleansing & Maintenance Blueprint**
* **Mechanical Sweeping Operation**: Deploy a high-performance Tractor-Mounted Hydraulic Broomer for rapid dust and gravel clearance across asphalt lanes. For heavy project zones, execute two passes, followed by high-pressure vacuum misting.
* **Sub-Base Pre-planning**: Clean the primary sub-grade course thoroughly, freeing it of organic particulates or aggregate muds to ensure subsequent asphalt binder courses achieve the required PWD compaction density.

### **2. Dedicated Heavy Fleet & Equipment Specifications**
* **Hydraulic Broomer Fleet**: Deploy a Mahindra 4WD Tractor-Attached Broomer unit fitted with wear-resistant high-density nylon/polypropylene co-extruded bristles. Under 540 RPM PTO operation, maintain a steady travel speed of 5-8 km/h.
* **Ancillary Fleet**: Back up the broomer with a 10,000-liter water bowser fitted with front/rear high-pressure nozzles for pre-wetting, alongside a Tipper truck for immediate dirt collection and transit.

### **3. Admin Registrations & PWD Road Standards Compliance**
* **Code References**: Ensure all operations conform strictly to MoRTH (Ministry of Road Transport & Highways) standards, Section 500, and standard IRC guidelines for urban paving and highway maintenance.
* **Municipal Approvals**: Coordinate with the local Highways Department and Municipal Corporation to lock down a synchronized traffic diversion permit scheme, utilizing clear reflective safety arrow boards.

### **4. On-Site Safety Controls & Spill Prevention Protocols**
* **Active Traffic Marshalling**: Station a minimum of two trained flagmen equipped with high-visibility jackets and LED batons at least 150 meters ahead of the work zone to safely guide upcoming public transit.
* **Dust Mitigation**: Maintain active water spraying to suppress particulate matters of aerodynamic diameter under 10 microns (PM10), complying perfectly with local Environmental Board regulations.`;
    }

    // 3. General / default Civil Consultation
    return `### **1. Structural Action Plan & Civil Engineering Layout**
* **Comprehensive Soil/Site Investigation**: Carry out deep bore exploration and physical site surveys to specify accurate foundation bearing capacities matching PWD Index parameters.
* **Tactical Phasing Layout**: Initiate complete physical site clearing, followed by structural excavation, retaining layout development, and secondary surface grading using high-performance laser-guided levelling systems.

### **2. Heavy-Duty Fleet & Equipment Allocation**
* **Excavation Fleet**: Deploy reliable hydraulic earthmovers including JCB 3CX Backhoe Loaders and Tata Hitachi EX200 heavy excavators for high-volume trenching and structural cut-offs.
* **Auxiliary Assets**: Integrate trailer-attached Mahindra Arjun 4WD tractor units for flexible on-site haulage and structural aggregate transports.

### **3. Administrative Clearances & PWD Class I Liaison**
* **Regulatory Compliance**: All designs conform strictly to National Building Codes (NBC) and IS standards. Compile blueprint drawings for rapid local PWD Executive Engineering circle review.
* **Sri Velan Contractor Standing**: Sri Velan & Co operates with Class I Registered Civil Contractor authority, enabling fast-tracked administrative approvals for municipal, agricultural, and industrial infrastructure works.

### **4. Multi-Layer Safety & Protective Engineering Protocols**
* **Zoning Controls**: Secure the full construction grid with high-strength galvanized iron barricading curtains. Implement reflective night-glow indicator tapes and automated LED solar warning flashers.
* **Worker Welfare Norms**: Strictly enforce 100% adherence to PWD safety guidelines—including mandatory hard helmets, steel-toed rubber boots, safety goggles, and double-lanyard climbing harnesses.`;
  };

  // Server-side AI Estimator route
  const handleAiGeneration = async (req: express.Request, res: express.Response) => {
    const { prompt } = req.body;
    try {
      if (!prompt || !prompt.trim()) {
        res.status(400).json({ error: "Input prompt is required." });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      console.log(`[Diagnostic] API Key length: ${apiKey ? apiKey.length : 0}, first 5 chars: ${apiKey ? apiKey.substring(0, 5) : 'none'}`);
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not configured. Falling back to local planner.");
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
        throw new Error("Received empty text representation from Gemini model.");
      }

      res.status(200).json({ text: generatedText });

    } catch (err: any) {
      console.warn("[Sri Velan AI] Real Gemini API call failed. Deploying robust local engineering fallback: ", err.message || err);
      try {
        const fallbackText = generateFallbackResponse(prompt);
        res.status(200).json({ text: fallbackText, isFallback: true });
      } catch (fallbackErr) {
        console.error("Severe: Fallback generator failed in Express:", fallbackErr);
        const cleanMsg = cleanGeminiError(err);
        res.status(500).json({ error: cleanMsg });
      }
    }
  };

  // Server-side EmailJS forward proxy to bypass client-side CORS and ad blockers
  const handleEmailSending = async (req: express.Request, res: express.Response) => {
    try {
      const { serviceId, templateId, publicKey, templateParams } = req.body;
      
      const finalServiceId = serviceId || process.env.VITE_EMAILJS_SERVICE_ID;
      const finalTemplateId = templateId || process.env.VITE_EMAILJS_TEMPLATE_ID;
      const finalPublicKey = publicKey || process.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!finalServiceId || !finalTemplateId || !finalPublicKey) {
        res.status(400).json({ error: "Missing EmailJS configuration properties (Service ID, Template ID, or Public Key)." });
        return;
      }

      console.log(`[Proxy Express SendEmail] Dispatching EmailJS construct for: ${finalServiceId}`);

      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "aistudio-build"
        },
        body: JSON.stringify({
          service_id: finalServiceId,
          template_id: finalTemplateId,
          user_id: finalPublicKey,
          template_params: templateParams
        })
      });

      const resText = await response.text();
      console.log(`[Proxy Express SendEmail] Status: ${response.status}, text: ${resText}`);

      if (!response.ok) {
        res.status(response.status || 500).json({ error: resText || "EmailJS failed to deliver the message." });
        return;
      }

      res.status(200).json({ success: true, text: resText });
    } catch (err: any) {
      console.error("[Proxy Express SendEmail] Severe dispatch failure:", err);
      res.status(500).json({ error: err.message || "Internal server error during email dispatch." });
    }
  };

  // Support both endpoint paths to ensure complete backwards compatibility
  app.post("/.netlify/functions/generate", handleAiGeneration);
  app.post("/api/generate", handleAiGeneration);

  app.post("/.netlify/functions/send-email", handleEmailSending);
  app.post("/api/send-email", handleEmailSending);

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
