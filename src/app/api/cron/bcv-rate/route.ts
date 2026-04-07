import { createClient } from "@supabase/supabase-js";
import { fetchBCVRate } from "@/lib/bcv/scraper";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

async function handleCronRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rates = await fetchBCVRate();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Save to exchange_rates table
    const { error: error1 } = await supabase
      .from("exchange_rates")
      .upsert(
        { date: rates.date, usd: rates.usd, eur: rates.eur, source: "BCV" },
        { onConflict: "date" }
      );
    if (error1) throw error1;

    // Save to bcv_rates table (used by GastoFlow dashboard)
    const { error: error2 } = await supabase
      .from("bcv_rates")
      .upsert(
        { rate_usd: rates.usd, date: rates.date },
        { onConflict: "date" }
      );
    if (error2) throw error2;

    return NextResponse.json({ success: true, rate: rates.usd, eur: rates.eur, date: rates.date });
  } catch (err) {
    console.error("[BCV Cron] Failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export const GET = handleCronRequest;
export const POST = handleCronRequest;
