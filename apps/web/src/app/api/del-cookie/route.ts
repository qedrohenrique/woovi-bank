import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const cookieName = request.nextUrl.searchParams.get("name");

  if (!cookieName) {
    return NextResponse.json(
      { message: "Cookie name not specified." },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.delete(cookieName);

  return NextResponse.json({ message: `Cookie '${cookieName}' deletado.` });
}