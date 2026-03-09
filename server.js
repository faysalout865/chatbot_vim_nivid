/**
 * AI Chatbot — Réalisé par Fayssal Outlahyante
 * Express backend — streams NVIDIA NIM responses via SSE
 * Supports text conversations + image analysis (multimodal)
 * Frontend is served from public/index.html
 */

const express  = require("express");
const https    = require("https");
const path     = require("path");

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Configuration ───────────────────────────────────────────
const CONFIG = {
  apiKey:       process.env.NVIDIA_API_KEY || "YOUR_API_KEY_HERE",
  apiUrl:       "https://integrate.api.nvidia.com/v1/chat/completions",
  textModel:    "meta/llama-3.2-11b-vision-instruct",  // works for both text & vision
  visionModel:  "meta/llama-3.2-11b-vision-instruct",  // multimodal – handles images
  maxTokens:    512,
  temperature:  1.0,
  topP:         1.0,
};

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ── Helper: pull text out of NVIDIA SSE chunks ──────────────
function extractText(raw) {
  let out = "";
  for (const line of raw.split("\n")) {
    if (!line.startsWith("data: ")) continue;
    const j = line.slice(6).trim();
    if (j === "[DONE]") continue;
    try {
      const d = JSON.parse(j)?.choices?.[0]?.delta?.content;
      if (d) out += d;
    } catch (_) {}
  }
  return out;
}

// ── Helper: stream a payload to NVIDIA and pipe SSE back ─────
function streamNvidia(payload, res) {
  const body = JSON.stringify(payload);
  const url  = new URL(CONFIG.apiUrl);

  const apiReq = https.request(
    {
      hostname: url.hostname,
      path:     url.pathname,
      method:   "POST",
      headers: {
        "Authorization":  "Bearer " + CONFIG.apiKey,
        "Content-Type":   "application/json",
        "Accept":         "text/event-stream",
        "Content-Length": Buffer.byteLength(body),
      },
    },
    (apiRes) => {
      // If not a streaming success, log + forward the error body
      if (apiRes.statusCode !== 200) {
        let errBody = "";
        apiRes.on("data", c => errBody += c);
        apiRes.on("end", () => {
          console.error(`\n[NVIDIA ERROR] HTTP ${apiRes.statusCode}`);
          console.error(errBody.slice(0, 800));
          const msg = (() => {
            try { return JSON.parse(errBody).detail || JSON.parse(errBody).error?.message || errBody; }
            catch (_) { return errBody || `HTTP ${apiRes.statusCode}`; }
          })();
          res.write("data: " + JSON.stringify({ error: `API Error ${apiRes.statusCode}: ${msg}` }) + "\n\n");
          res.end();
        });
        return;
      }

      let buf = "";

      apiRes.on("data", (chunk) => {
        buf += chunk.toString();
        const parts = buf.split("\n\n");
        buf = parts.pop();
        for (const part of parts) {
          const text = extractText(part + "\n\n");
          if (text) res.write("data: " + JSON.stringify({ text }) + "\n\n");
        }
      });

      apiRes.on("end", () => {
        if (buf) {
          const text = extractText(buf);
          if (text) res.write("data: " + JSON.stringify({ text }) + "\n\n");
        }
        res.write("data: [DONE]\n\n");
        res.end();
      });
    }
  );

  apiReq.on("error", (err) => {
    console.error("NVIDIA API error:", err.message);
    res.write("data: " + JSON.stringify({ error: err.message }) + "\n\n");
    res.end();
  });

  apiReq.write(body);
  apiReq.end();
}

// ── POST /api/chat  (text only) ─────────────────────────────
app.post("/api/chat", (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages[] is required" });
  }

  res.setHeader("Content-Type",  "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection",    "keep-alive");
  res.flushHeaders();

  streamNvidia({
    model:       CONFIG.textModel,
    messages,
    max_tokens:  CONFIG.maxTokens,
    temperature: CONFIG.temperature,
    top_p:       CONFIG.topP,
    stream:      true,
  }, res);
});

// ── Start ─────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log("\n  🤖  AI Chatbot — Réalisé par Fayssal Outlahyante");
    console.log("  🚀  http://localhost:" + PORT + "\n");
  });
}

// Pour Vercel : on exporte l'app sans faire app.listen()
module.exports = app;
