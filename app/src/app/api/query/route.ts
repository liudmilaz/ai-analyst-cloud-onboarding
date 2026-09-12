import { NextRequest, NextResponse } from "next/server";
import { VERIFIED_METRICS } from "../../../data/verifiedMetrics";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    return NextResponse.json({
      status: "success",
      query,
      metrics: VERIFIED_METRICS
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
