import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing Player ID" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.isan.eu.org/nickname/cod?id=${id}`);
    const data = await response.json();

    if (data.success && data.name) {
      return NextResponse.json({ 
        ign: data.name, 
        verified: true 
      }, { status: 200 });
    }
    return NextResponse.json({ error: "Player not found." }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Server busy." }, { status: 500 });
  }
}
