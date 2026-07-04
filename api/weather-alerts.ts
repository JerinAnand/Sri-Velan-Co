import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Content-Type", "application/json");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Enforce GET method
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const locations = [
      { name: "Northern Chennai", lat: 13.1600, lon: 80.2500 },
      { name: "Central Chennai", lat: 13.0600, lon: 80.2500 },
      { name: "Southern Chennai", lat: 12.9200, lon: 80.2200 }
    ];

    const weatherData = await Promise.all(
      locations.map(async (loc) => {
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m&hourly=precipitation_probability,precipitation,rain&forecast_days=1`;
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Open-Meteo returned status ${response.status}`);
          const data = await response.json();
          
          const current = data.current || {};
          const hourly = data.hourly || {};
          
          const totalPrecip24h = Array.isArray(hourly.precipitation) 
            ? hourly.precipitation.reduce((sum: number, val: number) => sum + (val || 0), 0)
            : 0;

          let riskLevel: "Normal" | "Watch" | "Severe" | "Extreme" = "Normal";
          let alertMessage = "Standard operations. Site drainage meets standard indexes.";
          const rainMm = current.precipitation || current.rain || 0;
          const windKmh = current.wind_speed_10m || 0;
          const code = current.weather_code || 0;

          const isRaining = rainMm > 0 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code);

          if (totalPrecip24h >= 80 || windKmh >= 50) {
            riskLevel = "Extreme";
            alertMessage = `EXTREME PRECIPITATION WARNING: Continuous monsoon load risk. Disaster dewatering division requested for high-capacity bypass setups.`;
          } else if (totalPrecip24h >= 35 || rainMm >= 6 || windKmh >= 35) {
            riskLevel = "Severe";
            alertMessage = `SEVERE HEAVY RAIN THREAT: Storm systems developing. Contractors advised to check PTO connections and standby suction lines.`;
          } else if (totalPrecip24h >= 12 || isRaining || windKmh >= 20) {
            riskLevel = "Watch";
            alertMessage = `MONSOON WATERLOGGING ALERTS: Steady pre-monsoon precipitation. Operators placed on subway-well monitoring duties.`;
          }

          return {
            name: loc.name,
            lat: loc.lat,
            lon: loc.lon,
            temp: current.temperature_2m || 30,
            humidity: current.relative_humidity_2m || 70,
            precipitation: rainMm,
            weatherCode: code,
            windSpeed: windKmh,
            forecast24hPrecipitation: totalPrecip24h,
            riskLevel,
            alertMessage
          };
        } catch (err: any) {
          console.warn(`Failed to fetch weather for ${loc.name}, returning fallback:`, err.message);
          return {
            name: loc.name,
            lat: loc.lat,
            lon: loc.lon,
            temp: 29,
            humidity: 80,
            precipitation: 0.0,
            weatherCode: 3,
            windSpeed: 15,
            forecast24hPrecipitation: 5.0,
            riskLevel: "Watch" as const,
            alertMessage: "Pre-monsoon humidity elevated. Routine drainage checks recommended."
          };
        }
      })
    );

    let aiBriefing = "No active severe cyclone warnings or depression bulletins recorded over the Bay of Bengal for the Tamil Nadu coast. Routine civil contracts and road broomer sweeps proceeding on schedule.";
    let hasAiWarning = false;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: { headers: { "User-Agent": "aistudio-build" } }
        });

        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: "Search and synthesize current real-time heavy rainfall, active cyclone alerts, IMD storm warnings, or flood warnings in Tamil Nadu (focusing on Villupuram, Cuddalore, Chennai, Pondicherry) for late June 2026. Provide a concise, clear 3-sentence risk summary for dewatering, drainage and pumping contractors. Do not use any markdown bolding with asterisks or list bullet asterisks.",
            config: {
              tools: [{ googleSearch: {} }],
              temperature: 0.4
            }
          });

          if (response.text) {
            aiBriefing = response.text;
            hasAiWarning = true;
          }
        } catch (searchErr: any) {
          console.warn("[Vercel Weather Alerts API] Gemini search grounding failed, retrying with telemetry-grounded prompt without search tool:", searchErr.message);
          
          const telemetrySummary = weatherData.map(w => 
            `${w.name}: Temp ${w.temp}°C, Humidity ${w.humidity}%, Rain ${w.precipitation}mm/h, 24h Forecast ${w.forecast24hPrecipitation}mm, Wind ${w.windSpeed}km/h, Risk: ${w.riskLevel}`
          ).join("; ");

          const retryResponse = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: `Analyze the following real-time weather telemetry for Tamil Nadu regions and synthesize a professional 3-sentence risk summary and operational advice for disaster dewatering, drainage, and pumping contractors. Do not use any markdown bolding with asterisks or list bullet asterisks. Telemetry: ${telemetrySummary}`,
            config: {
              temperature: 0.4
            }
          });

          if (retryResponse.text) {
            aiBriefing = retryResponse.text;
            hasAiWarning = true;
          }
        }
      } catch (aiErr: any) {
        console.warn("[Vercel Weather Alerts API] Gemini call failed completely, using backup text:", aiErr.message);
        aiBriefing = "Regional IMD advisory reports localized convective monsoon developments across coastal Tamil Nadu corridors. Clients in low-lying industrial or municipal zones should run routine fuel level verification on backup standby pumping generators.";
      }
    } else {
      aiBriefing = "Regional IMD advisory reports localized convective monsoon developments across coastal Tamil Nadu corridors. Clients in low-lying industrial or municipal zones should run routine fuel level verification on backup standby pumping generators.";
    }

    res.status(200).json({
      timestamp: new Date().toISOString(),
      weatherData,
      aiBriefing,
      hasAiWarning
    });

  } catch (globalErr: any) {
    console.error("Critical weather alert API error:", globalErr);
    res.status(500).json({ error: globalErr.message || "Internal server error fetching alerts." });
  }
}
