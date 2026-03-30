import { NextResponse } from "next/server";

export const runtime = "nodejs";

type WifiLoginBody = {
  mac?: string;
  ip?: string;
  apname?: string;
  name?: string;
  phone?: string;
  address?: string;
};


const DEFAULT_SAVE_ENDPOINT = "http://10.150.1.47/Wifi/SaveAndConnect";

export async function POST(request: Request) {
  let body: WifiLoginBody;
  try {
    body = (await request.json()) as WifiLoginBody;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 },
    );
  }

  const { mac, ip, apname, name, phone, address } = body;

  if (!name?.trim() || !phone?.trim()) {
    return NextResponse.json(
      { success: false, message: "Name and phone are required" },
      { status: 400 },
    );
  }

  // Dev-only mock: return success without calling the internal backend.
  // This is useful for UI testing before wiring the real captive portal endpoint.
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.json({
      success: true,
      message: "Saved successfully (dev mock)",
    });
  }

  const endpoint = process.env.WIFI_SAVE_ENDPOINT ?? DEFAULT_SAVE_ENDPOINT;

  const formBody = new URLSearchParams({
    mac: mac ?? "",
    ip: ip ?? "",
    apname: apname ?? "",
    name: name.trim(),
    phone: phone.trim(),
    address: address?.trim() ?? "",
  });

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody.toString(),
      cache: "no-store",
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to save login info" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Saved successfully",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to save login info" },
      { status: 502 },
    );
  }
}
