import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, clazz, message, rating } = body ?? {};

    if (!name || !clazz || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // In a real app you could save this in a database or sheet.
    // For now we just acknowledge the submission.

    return NextResponse.json(
      {
        ok: true,
        received: { name, clazz, message, rating: rating ?? null },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 },
    );
  }
}

