import { signOut } from "@/auth";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    // Clear authentication/session data
    await signOut({redirect: false});

    // Return success response
    return NextResponse.json(
      {
        success: "Logged out successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during logout:", error);

    return NextResponse.json(
      {
        error: "Logout failed",
      },
      { status: 500 }
    );
  }
};
