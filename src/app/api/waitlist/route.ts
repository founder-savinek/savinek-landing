import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// One server-side client (service role bypasses RLS). NEVER expose this key to the browser.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const ct = req.headers.get("content-type") || "";
    let email = "";
    let name = "";

    if (ct.includes("application/json")) {
      const body = await req.json();
      email = typeof body?.email === "string" ? body.email.trim() : "";
      name  = typeof body?.name  === "string" ? body.name.trim()  : "";
    } else if (
      ct.includes("application/x-www-form-urlencoded") ||
      ct.includes("multipart/form-data")
    ) {
      const form = await req.formData();
      email = String(form.get("email") ?? "").trim();
      name  = String(form.get("name")  ?? "").trim();
    } else {
      return NextResponse.json(
        { ok: false, error: "Unsupported content-type" },
        { status: 415 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    // store lowercase email; include name only if present
    const payload = { email: email.toLowerCase(), ...(name && { name }) };

    // idempotent upsert (creates or updates name if email exists)
    const { error } = await supabase
      .from("waitlist")
      .upsert(payload, { onConflict: "email", ignoreDuplicates: false });

    if (error) {
      // Duplicate errors should be rare with upsert, but keep a friendly response:
      if (/duplicate key/i.test(error.message)) {
        return NextResponse.json({ ok: false, error: "Already joined" }, { status: 409 });
      }
      console.error("Supabase upsert error:", error);
      return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Route error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
