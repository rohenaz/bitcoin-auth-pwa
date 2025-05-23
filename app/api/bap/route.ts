import { resolveAddress } from "@/lib/bap";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const addr = new URL(req.url).searchParams.get("address");
  if (!addr) return NextResponse.json({ error: "address required" }, { status: 400 });
  const bap = await resolveAddress(addr);
  return bap
    ? NextResponse.json({ status: "success", result: bap })
    : NextResponse.json({ status: "error", message: "not found" }, { status: 404 });
}; 