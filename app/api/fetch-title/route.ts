import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ title: null }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        // Pretend to be a browser so sites don't block us
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(5000),
    });

    const html = await res.text();

    // Extract <title>…</title> content
    const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = match?.[1]?.trim().replace(/\s+/g, " ") ?? null;

    return NextResponse.json({ title });
  } catch {
    return NextResponse.json({ title: null });
  }
}
