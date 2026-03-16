import { NextResponse } from "next/server";

/**
 * Simple email relay endpoint.
 *
 * Configure the teacher's email and your email provider using environment
 * variables in a `.env.local` file:
 *
 * EMAIL_TO="teacher@example.com"
 * EMAIL_FROM="no-reply@yourdomain.com"
 * RESEND_API_KEY="your_resend_api_key"
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body ?? {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.EMAIL_TO;
    const from = process.env.EMAIL_FROM ?? "no-reply@example.com";

    if (!apiKey || !to) {
      // In development, we still succeed but do not send a real email.
      console.warn(
        "[send-query] RESEND_API_KEY or EMAIL_TO not set. Email not sent.",
      );
      return NextResponse.json(
        {
          ok: true,
          simulated: true,
          message:
            "Email service is not configured yet, but the query was received.",
        },
        { status: 200 },
      );
    }

    const payload = {
      from,
      to,
      subject: `New tuition query from ${name}`,
      text: `You have received a new query from your tuition website.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("[send-query] Resend API error:", await res.text());
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[send-query] Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to send query" },
      { status: 500 },
    );
  }
}

