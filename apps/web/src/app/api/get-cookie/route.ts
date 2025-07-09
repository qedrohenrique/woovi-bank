import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookieName = request.nextUrl.searchParams.get("name");

  if (!cookieName) {
    return NextResponse.json(
      { message: "Cookie name not specified." },
      { status: 400 },
    );
  }


  const cookieStore = await cookies();
  const value = cookieStore.get(cookieName)?.value;

  return NextResponse.json({ value });
}
