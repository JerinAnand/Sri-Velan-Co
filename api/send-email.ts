/**
 * Vercel Serverless Function proxying EmailJS calls to keep key secret
 * and bypass browser ad-blockers / ad blocker blockages (e.g., api.emailjs.com).
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
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { serviceId, templateId, publicKey, templateParams } = body || {};

    const finalServiceId = serviceId || process.env.VITE_EMAILJS_SERVICE_ID;
    const finalTemplateId = templateId || process.env.VITE_EMAILJS_TEMPLATE_ID;
    const finalPublicKey = publicKey || process.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!finalServiceId || !finalTemplateId || !finalPublicKey) {
      return res.status(400).json({ error: "Missing EmailJS configuration properties (Service ID, Template ID, or Public Key)." });
    }

    console.log(`[Proxy Vercel SendEmail] Dispatching EmailJS construct for: ${finalServiceId}`);

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
    console.log(`[Proxy Vercel SendEmail] Status: ${response.status}, text: ${resText}`);

    if (!response.ok) {
      return res.status(response.status || 500).json({ error: resText || "EmailJS failed to deliver the message." });
    }

    return res.status(200).json({ success: true, text: resText });
  } catch (err: any) {
    console.error("[Proxy Vercel SendEmail] Severe dispatch failure:", err);
    return res.status(500).json({ error: err.message || "Internal server error during email dispatch." });
  }
}
