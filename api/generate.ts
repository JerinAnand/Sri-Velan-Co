/**
 * Vercel Serverless Function proxying Gemini API calls to keep key secret.
 * Sri Velan & Co Corporate PWD AI Estimator & Specification Planner.
 */

// High-fidelity fallback generator matching PWD specifications
function generateFallbackResponse(prompt: string): string {
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
* **Contractor Classification**: Sri Velan & Co maintains PWD Certification. All hydraulic lines and diesel engine decibel limits comply with local pollution standards (TNPCB norms) and district municipal corporation laws.

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

### **3. Administrative Clearances & PWD Liaison**
* **Regulatory Compliance**: All designs conform strictly to National Building Codes (NBC) and IS standards. Compile blueprint drawings for rapid local PWD Executive Engineering circle review.
* **Sri Velan Contractor Standing**: Sri Velan & Co operates with Registered Civil Contractor authority, enabling fast-tracked administrative approvals for municipal, agricultural, and industrial infrastructure works.

### **4. Multi-Layer Safety & Protective Engineering Protocols**
* **Zoning Controls**: Secure the full construction grid with high-strength galvanized iron barricading curtains. Implement reflective night-glow indicator tapes and automated LED solar warning flashers.
* **Worker Welfare Norms**: Strictly enforce 100% adherence to PWD safety guidelines—including mandatory hard helmets, steel-toed rubber boots, safety goggles, and double-lanyard climbing harnesses.`;
}

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

  // Vercel parses req.body for JSON requests, but fallback if it is a string
  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { prompt } = body || {};

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "Input prompt is required." });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured on Vercel. Falling back to local planner.");
    }

    // Call the Google Gemini API directly using Node's native fetch
    const model = "gemini-3.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const systemInstruction = 
      "You are an elite, highly professional PWD/WRD civil contracting consultant representing " +
      "Sri Velan & Co (Government Registered Contractors). " +
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
      throw new Error(`Gemini service returned non-200 status: ${response.status} - ${errText}`);
    }

    const data: any = await response.json();
    
    // Extract text representation safely compatible with candidates structure
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error("Invalid response model returned from Gemini. Empty text.");
    }

    return res.status(200).json({ text: generatedText });

  } catch (err: any) {
    console.warn("[Sri Velan Vercel API] Real Gemini API call failed. Deploying fallback local engineering planner: ", err.message || err);
    try {
      const fallbackText = generateFallbackResponse(prompt);
      return res.status(200).json({ text: fallbackText, isFallback: true });
    } catch (fallbackErr: any) {
      console.error("Severe: Fallback generator failed on Vercel handler:", fallbackErr);
      return res.status(500).json({ error: err.message || "An internal error occurred." });
    }
  }
}
