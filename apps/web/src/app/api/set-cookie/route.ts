import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { value } = await request.json();
  const cookieName = request.nextUrl.searchParams.get("name");

  console.log("set-cookie", cookieName, value);

  if (!cookieName) {
    return NextResponse.json(
      { message: "Cookie name not specified." },
      { status: 400 },
    );
  }

  if (!value) {
    return NextResponse.json(
      { message: "Value not provided" },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ message: "Cookie set" });

  response.cookies.set({
    name: cookieName,
    value: value,
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "strict", 
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return response;
}