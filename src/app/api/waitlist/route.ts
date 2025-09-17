import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use one client at module scope (server-only env)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const value = typeof email === "string" ? email.trim() : "";

    if (!value) {
      return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 });
    }

    const { error } = await supabase.from("waitlist").insert({ email: value });

    if (error) {
      if (/duplicate key/i.test(error.message)) {
        return NextResponse.json({ ok: false, error: "Already joined" }, { status: 409 });
      }
      console.error("Supabase insert error:", error);
      return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("Route error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
