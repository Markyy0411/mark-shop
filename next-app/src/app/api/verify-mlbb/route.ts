import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const zone = searchParams.get("zone");

  if (!id || !zone) {
    return NextResponse.json({ error: "Missing ID/Zone" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.isan.eu.org/nickname/ml?id=${id}&server=${zone}`);
    const data = await response.json();

    if (data.success && data.name) {
      const z = parseInt(zone);
      const isPH = (z >= 3000 && z <= 4500) || (z >= 9000 && z <= 11000) || (z >= 13000);
      
      return NextResponse.json({ 
        ign: data.name, 
        verified: true,
        region: isPH ? "PH Server 🇵🇭" : "Global/Other 🌎"
      }, { status: 200 });
    }
    return NextResponse.json({ error: "Player not found." }, { status: 404 });
  } catch (error: unknown) {
    console.error("MLBB verification error:", error);
    return NextResponse.json({ error: "Failed to verify" }, { status: 500 });
  }
}
