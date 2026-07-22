// Madvera waitlist endpoint. POST /api/waitlist {email} ->
// 1) notification email to NOTIFY_TO, 2) confirmation email to the subscriber,
// both via Resend. No deps; Node 20+.
import { createServer } from "node:http";

const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.ALLOWED_ORIGIN || "https://jordanhayesmedia.github.io";
const KEY = process.env.RESEND_API_KEY;
const FROM = process.env.MAIL_FROM;
const NOTIFY_TO = process.env.NOTIFY_TO;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// sliding-window rate limit: 6 requests/min per IP
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (now - v[v.length - 1] > 60_000) hits.delete(k);
  return list.length > 6;
}

async function resend(payload) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error(`[resend] ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`);
    return false;
  }
  return true;
}

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");
}

function send(res, code, body) {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

createServer(async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.writeHead(204).end();
  if (req.method === "GET" && req.url === "/health") return send(res, 200, { ok: true });
  if (req.method !== "POST" || req.url !== "/api/waitlist") return send(res, 404, { ok: false, error: "not found" });

  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "?").split(",")[0].trim();
  if (limited(ip)) return send(res, 429, { ok: false, error: "too many requests" });

  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 4096) return send(res, 413, { ok: false, error: "too large" });
  }
  let data;
  try { data = JSON.parse(body); } catch { return send(res, 400, { ok: false, error: "bad json" }); }

  if (data._honey) return send(res, 200, { ok: true }); // bot: pretend success
  const email = String(data.email || "").trim().slice(0, 254);
  if (!EMAIL_RE.test(email)) return send(res, 400, { ok: false, error: "invalid email" });
  if (!KEY || !FROM || !NOTIFY_TO) return send(res, 503, { ok: false, error: "not configured" });

  const confirmed = await resend({
    from: FROM,
    to: [email],
    reply_to: NOTIFY_TO,
    subject: "You're on the Madvera waitlist",
    text: `You're in.\n\nWe'll email you the moment Madvera Ad Generation goes live so you can create winning Facebook ads with one prompt.\n\nUntil then, the Podcast Ads Skill is free to grab:\nhttps://jordanhayesmedia.github.io/madvera/\n\nThe Madvera team`,
  });
  if (!confirmed) return send(res, 502, { ok: false, error: "could not send confirmation" });

  resend({
    from: FROM,
    to: [NOTIFY_TO],
    subject: "New Madvera waitlist signup",
    text: `New waitlist signup: ${email}\nTime: ${new Date().toISOString()}\nSource: madvera landing page`,
  }); // fire and forget; failure only logs

  return send(res, 200, { ok: true });
}).listen(PORT, () => console.log(`waitlist listening on :${PORT}`));
