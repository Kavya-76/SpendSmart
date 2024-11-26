import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Clear authentication cookie
    const response = NextResponse.redirect(new URL("/signin", request.url));
    response.cookies.set("auth-token", "", { maxAge: 0 }); // Clear auth token
    
    // Optionally, perform server-side cleanup (e.g., invalidate a session on the server)

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
