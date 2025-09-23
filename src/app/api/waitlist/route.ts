import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Meta = {
  referred_by: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  signup_path: string | null;
};

type UpdateFields = Meta & {
  name: string | null;
  user_agent: string | null;
};

const pickString = (v: unknown): string | null =>
  typeof v === "string" ? v : null;

function extractMeta(input: unknown): Meta {
  const src =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};
  return {
    referred_by: pickString((src as any)?.ref ?? src.referred_by),
    utm_source: pickString(src.utm_source),
    utm_medium: pickString(src.utm_medium),
    utm_campaign: pickString(src.utm_campaign),
    utm_term: pickString(src.utm_term),
    utm_content: pickString(src.utm_content),
    signup_path: pickString(src.signup_path),
  };
}

export async function POST(req: Request) {
  try {
    const ct = req.headers.get("content-type") || "";
    let email = "";
    let name = "";
    let meta: Meta = {
      referred_by: null,
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_term: null,
      utm_content: null,
      signup_path: null,
    };
    const userAgent = req.headers.get("user-agent") || null;

    if (ct.includes("application/json")) {
      const body: unknown = await req.json();
      if (typeof body === "object" && body !== null) {
        const o = body as Record<string, unknown>;
        email = typeof o.email === "string" ? o.email.trim() : "";
        name = typeof o.name === "string" ? o.name.trim() : "";
      }
      meta = extractMeta(body);
    } else if (
      ct.includes("application/x-www-form-urlencoded") ||
      ct.includes("multipart/form-data")
    ) {
      const form = await req.formData();
      email = String(form.get("email") ?? "").trim();
      name = String(form.get("name") ?? "").trim();
      meta = extractMeta({
        ref: form.get("ref"),
        utm_source: form.get("utm_source"),
        utm_medium: form.get("utm_medium"),
        utm_campaign: form.get("utm_campaign"),
        utm_term: form.get("utm_term"),
        utm_content: form.get("utm_content"),
        signup_path: form.get("signup_path"),
      });
    } else {
      return NextResponse.json(
        { ok: false, error: "Unsupported content-type" },
        { status: 415 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase();

    // Does a row already exist?
    const { data: existing, error: selErr } = await supabase
      .from("waitlist")
      .select("id, referral_code, referred_by")
      .eq("email", emailLower)
      .maybeSingle();

    if (selErr) {
      console.error("Supabase select error:", selErr);
      return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 });
    }

    if (existing) {
      // Update optional fields if provided
      const updates: Partial<UpdateFields> = {};
      if (name) updates.name = name;
      if (!existing.referred_by && meta.referred_by)
        updates.referred_by = meta.referred_by;
      if (meta.utm_source) updates.utm_source = meta.utm_source;
      if (meta.utm_medium) updates.utm_medium = meta.utm_medium;
      if (meta.utm_campaign) updates.utm_campaign = meta.utm_campaign;
      if (meta.utm_term) updates.utm_term = meta.utm_term;
      if (meta.utm_content) updates.utm_content = meta.utm_content;
      if (meta.signup_path) updates.signup_path = meta.signup_path;
      if (userAgent) updates.user_agent = userAgent;

      if (Object.keys(updates).length > 0) {
        const { error: updErr } = await supabase
          .from("waitlist")
          .update(updates)
          .eq("email", emailLower);
        if (updErr) {
          console.error("Supabase update error:", updErr);
          // continue; we'll still return existing referral_code
        }
      }

      return NextResponse.json({
        ok: true,
        referralCode: existing.referral_code,
      });
    }

    // Insert new row (DB generates referral_code)
    const insertPayload: Record<string, string | null> & { email: string } = {
      email: emailLower,
      name: name || null,
      referred_by: meta.referred_by,
      utm_source: meta.utm_source,
      utm_medium: meta.utm_medium,
      utm_campaign: meta.utm_campaign,
      utm_term: meta.utm_term,
      utm_content: meta.utm_content,
      signup_path: meta.signup_path,
      user_agent: userAgent,
    };

    const { data: inserted, error: insErr } = await supabase
      .from("waitlist")
      .insert(insertPayload)
      .select("referral_code")
      .single();

    if (insErr) {
      if (/duplicate key/i.test(insErr.message)) {
        const { data: again } = await supabase
          .from("waitlist")
          .select("referral_code")
          .eq("email", emailLower)
          .single();
        return NextResponse.json({ ok: true, referralCode: again?.referral_code ?? null });
      }
      console.error("Supabase insert error:", insErr);
      return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, referralCode: inserted.referral_code });
  } catch (err) {
    console.error("Route error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
