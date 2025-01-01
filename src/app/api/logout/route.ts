"use server";
import { signOut } from "@/auth";
export const POST = async (req: Request) => {
  try {
    // Call the signOut function
    await signOut();

    // Return a success response
    return new Response(JSON.stringify({ success: true, message: "Logged out successfully." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return new Response(JSON.stringify({ success: false, error: "Logout failed. Please try again." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
