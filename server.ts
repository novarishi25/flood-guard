import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // Initialize Gemini if key is provided
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI with key:', err);
    }
  }

  // API: AI Flood Prediction
  app.post('/api/ai/predict', async (req, res) => {
    try {
      const {
        rainfall = 65,
        riverLevel = 4.2,
        soilMoisture = 60,
        drainageCapacity = 50,
        weather = 'Heavy Rain',
        historicalIncidents = 'Medium',
      } = req.body;

      // Base hydrological risk index calculation
      let score = Math.round(
        (rainfall / 200) * 35 +
        (riverLevel / 10) * 30 +
        (soilMoisture / 100) * 20 +
        ((100 - drainageCapacity) / 100) * 15
      );
      if (weather === 'Tropical Cyclone') score += 10;
      if (historicalIncidents === 'Severe') score += 8;
      score = Math.max(5, Math.min(99, score));

      let level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
      if (score >= 80) level = 'CRITICAL';
      else if (score >= 60) level = 'HIGH';
      else if (score >= 35) level = 'MODERATE';

      // Fallback deterministic assessment
      const fallbackAnalysis = {
        score,
        level,
        status: 'calculated_hydrological_model',
        summary: `Hydro-meteorological analysis indicates a ${level} flood alert level (${score}/100) based on rainfall intensity of ${rainfall}mm/hr and current river gauge elevation of ${riverLevel}m. Drainage systems are operating at ${drainageCapacity}% capacity.`,
        vulnerableAreas: [
          'Riverfront Promenade & Marina District',
          'Sector 7 Low-lying Residential Enclave',
          'Industrial Valley Metro Underpass',
          'North Riverside Slums & Creek Basin',
        ].slice(0, level === 'CRITICAL' ? 4 : level === 'HIGH' ? 3 : 2),
        recommendations: [
          level === 'CRITICAL'
            ? 'Issue immediate evacuation orders for Zone A & Low-lying Riverfront sectors.'
            : 'Pre-position emergency inflatable rescue boats at Sector 4 staging grounds.',
          'Deploy mobile diesel dewatering high-volume pump trucks to arterial underpasses.',
          'Activate Sector 3 & Sector 8 designated emergency community shelters.',
          'Alert trauma centers and pre-stage emergency potable water purification pods.',
        ],
        confidence: '94.2%',
        hydrologicalFactors: {
          runOffCoeff: (rainfall * 0.008 + (soilMoisture / 100) * 0.4).toFixed(2),
          peakDischargeEstimateM3s: Math.round(rainfall * 18.5 + riverLevel * 140),
          retentionTimeHours: Math.max(1.5, (12 - riverLevel * 1.1)).toFixed(1),
        },
      };

      if (!ai || !process.env.GEMINI_API_KEY) {
        return res.json({
          ...fallbackAnalysis,
          source: 'Simulated Hydrological AI Engine (Gemini API Key can be set in Secrets)',
        });
      }

      // If Gemini AI is active, invoke gemini-3.8-flash for synthesized situational intelligence
      const prompt = `You are the lead hydrologist and disaster commander for FLOODGUARD Smart City Disaster Management System.
Analyze the following live sensor telemetries:
- Rainfall Intensity: ${rainfall} mm/hr
- River Water Level: ${riverLevel} meters (Danger mark is 6.0m, Extreme flood is 8.0m)
- Soil Moisture Saturation: ${soilMoisture}%
- Stormwater Drainage Capacity Remaining: ${drainageCapacity}%
- Weather Condition: ${weather}
- Historical Flood Frequency: ${historicalIncidents}

Return a valid JSON object matching this exact structure:
{
  "score": ${score},
  "level": "${level}",
  "summary": "2-3 concise, authoritative sentences detailing the physical flood dynamics, crest prediction timeline, and urban danger.",
  "vulnerableAreas": ["string", "string", "string"],
  "recommendations": ["string", "string", "string", "string"],
  "confidence": "96.4%",
  "hydrologicalFactors": {
    "runOffCoeff": "0.78",
    "peakDischargeEstimateM3s": 1420,
    "retentionTimeHours": "3.5"
  }
}
Output only pure JSON with no markdown wrapping or extra commentary.`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text?.trim() || '';
        const parsed = JSON.parse(text);
        return res.json({
          ...fallbackAnalysis,
          ...parsed,
          score, // ensure synchronized calculated score
          level,
          source: 'Google Gemini 3.8 Flash Real-Time Hydrological Inference',
        });
      } catch (geminiError) {
        console.warn('Gemini inference error, using hydrological model fallback:', geminiError);
        return res.json({
          ...fallbackAnalysis,
          source: 'Hydrological Engine (Fallback)',
        });
      }
    } catch (err) {
      console.error('Prediction API Error:', err);
      res.status(500).json({ error: 'Failed to compute flood risk' });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'operational',
      app: 'FLOODGUARD Smart City',
      timestamp: new Date().toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Setup Vite or static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FLOODGUARD Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
