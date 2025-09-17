import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create the client here (no "@/lib" import needed)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    // Debug booleans (safe)
    console.log("WL_INSERT", {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });

    const { error } = await supabase.from("waitlist").insert({ email, name });

    if (error) {
      if (error.message.toLowerCase().includes("duplicate")) {
        return NextResponse.json({ ok: true, deduped: true });
      }
      console.error("Supabase insert error:", error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Route error:", err?.message);
    return NextResponse.json({ ok: false, error: err?.message || "Bad request" }, { status: 500 });
  }
}


