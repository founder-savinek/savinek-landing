import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // if using service role on server
    );

    const { error } = await supabase.from("waitlist").insert({ email });

    if (error) {
      // log details and return a safe error
      console.error("Supabase insert error:", error);
      return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    // Narrow unknown safely
    if (err instanceof Error) {
      console.error("Route error:", err.message);
    } else {
      console.error("Route error:", err);
    }
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}


