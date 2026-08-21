// app/api/faq-chat/route.ts
import { NextResponse } from "next/server";

const FALLBACK_REPLY =
  "I'm having trouble answering right now. Please reach out to our team directly at info@linorai.ai or (619) 622-3468, and we'll help you out.";

const SYSTEM_PROMPT = `You are the support assistant on the LinorAI website (linorai.ai). LinorAI's tagline: "Innovating the future with AI-powered solutions, web technology, and intelligent automation."

Only answer using the information below. If a question isn't covered by it, say so honestly and point the visitor to a real contact method instead of guessing:
- Contact form: /get-support/contact
- Email: info@linorai.ai
- Phone: (619) 622-3468

LinorAI's services:

IT Services (/it-services):
- IT Help Desk Support: 24/7 remote troubleshooting, user assistance, and proactive monitoring
- IT Security Services
- Cloud Services
- Backup & Disaster Recovery
- Strategic IT Consulting

AI-Powered Solutions (/ai-powered-solutions):
- AI Chatbots & Virtual Assistants
- Intelligent Automation
- Predictive Analytics
- AI Strategy Consulting

Web Solutions (/web-solutions):
- Website Design & Development
- Custom Web Applications
- E-Commerce Solutions
- API & System Integration

Get Support (/get-support):
- Contact form, Client Portal, Remote Access support, Onsite Troubleshooting, Troubleshooting Guides, and Request a Quote

About (/about-us): Company Overview, Leadership Team, Careers

Keep replies short, friendly, and specific. Do not make up pricing, SLAs, or policies that aren't listed above — direct those questions to the contact form or email instead. Do not answer questions unrelated to LinorAI or its services.`;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_PER_WINDOW = 8;
const DAILY_REQUEST_CAP = 300;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_TURNS = 12;

const requestTimestamps = new Map<string, number[]>();
let dailyCount = 0;
let dailyResetAt = startOfNextUtcDay();

function startOfNextUtcDay() {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
}

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (requestTimestamps.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  recent.push(now);
  requestTimestamps.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX_PER_WINDOW;
}

function isDailyCapReached() {
  const now = Date.now();
  if (now >= dailyResetAt) {
    dailyCount = 0;
    dailyResetAt = startOfNextUtcDay();
  }
  dailyCount += 1;
  return dailyCount > DAILY_REQUEST_CAP;
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    if (isRateLimited(ip)) {
      return NextResponse.json({
        reply: "You're sending messages a little too fast — please wait a moment and try again.",
      });
    }

    if (isDailyCapReached()) {
      return NextResponse.json({ reply: FALLBACK_REPLY });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("faq-chat: missing OPENAI_API_KEY");
      return NextResponse.json({ reply: FALLBACK_REPLY });
    }

    const body = await req.json().catch(() => null);
    const incoming = Array.isArray(body?.messages) ? body.messages : [];

    // Only trust user-authored turns — a client-forged assistant transcript
    // could otherwise be used to redirect or jailbreak the system prompt.
    const userTurns = incoming
      .filter(
        (m: unknown): m is { role: string; content: string } =>
          typeof m === "object" &&
          m !== null &&
          (m as any).role === "user" &&
          typeof (m as any).content === "string"
      )
      .slice(-MAX_HISTORY_TURNS)
      .map((m) => ({
        role: "user" as const,
        content: m.content.slice(0, MAX_MESSAGE_LENGTH),
      }));

    if (userTurns.length === 0) {
      return NextResponse.json({ reply: FALLBACK_REPLY });
    }

    const completionRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...userTurns],
        temperature: 0.4,
        max_tokens: 400,
      }),
    });

    if (!completionRes.ok) {
      console.error("faq-chat: OpenAI error", completionRes.status, await completionRes.text());
      return NextResponse.json({ reply: FALLBACK_REPLY });
    }

    const completion = await completionRes.json();
    const reply = completion?.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({ reply: reply || FALLBACK_REPLY });
  } catch (error) {
    console.error("faq-chat: unexpected error", error);
    return NextResponse.json({ reply: FALLBACK_REPLY });
  }
}
