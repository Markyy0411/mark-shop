import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Missing Username" }, { status: 400 });
  }

  try {
    const response = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: true }),
    });
    
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      return NextResponse.json({ 
        userId: data.data[0].id, 
        displayName: data.data[0].displayName,
        verified: true 
      }, { status: 200 });
    }
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Server busy." }, { status: 500 });
  }
}
