import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isThemePreset, DEFAULT_THEME_PRESET } from "@/theme";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ preset: null }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { theme_preference: true },
    });

    return NextResponse.json({
      preset: user?.theme_preference ?? DEFAULT_THEME_PRESET,
    });
  } catch {
    // If DB is not migrated yet, keep the app usable.
    return NextResponse.json({ preset: DEFAULT_THEME_PRESET });
  }
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { preset?: unknown } | null;
  const preset = body?.preset;

  if (!isThemePreset(preset)) {
    return NextResponse.json({ ok: false, error: "Invalid preset" }, { status: 400 });
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { theme_preference: preset },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to persist theme" },
      { status: 500 },
    );
  }
}
