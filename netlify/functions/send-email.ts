/**
 * Netlify Serverless Function proxying EmailJS calls to keep key secret
 * and bypass browser ad-blockers / ad blocker blockages (e.g. api.emailjs.com).
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
    const { serviceId, templateId, publicKey, templateParams } = JSON.parse(event.body || "{}");

    const finalServiceId = serviceId || process.env.VITE_EMAILJS_SERVICE_ID;
    const finalTemplateId = templateId || process.env.VITE_EMAILJS_TEMPLATE_ID;
    const finalPublicKey = publicKey || process.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!finalServiceId || !finalTemplateId || !finalPublicKey) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing EmailJS configuration properties (Service ID, Template ID, or Public Key)." })
      };
    }

    console.log(`[Proxy Netlify SendEmail] Dispatching EmailJS construct for: ${finalServiceId}`);

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
    console.log(`[Proxy Netlify SendEmail] Status: ${response.status}, text: ${resText}`);

    if (!response.ok) {
      return {
        statusCode: response.status || 500,
        headers,
        body: JSON.stringify({ error: resText || "EmailJS failed to deliver the message." })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, text: resText })
    };
  } catch (err: any) {
    console.error("[Proxy Netlify SendEmail] Severe dispatch failure:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || "Internal server error during email dispatch." })
    };
  }
};
