import NextAuth, { type DefaultSession } from "next-auth";
import authConfig from "./auth.config"
import { getUserById } from "@/data/user";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User"; // Import your Mongoose user model
import TwoFactorConfirmationModel from "@/models/TwoFactorConfirmation"; // Import the 2FA model
import { UserRole } from "@/types"; // Define or import `UserRole` type based on your application

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Mongoose does not require an adapter for database connection
  session: { strategy: "jwt" },
  ...authConfig,

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  events: {
    async linkAccount({ user }) {
      await dbConnect();
      await UserModel.updateOne(
        { _id: user.id },
        { emailVerified: new Date() }
      );
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();

      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);

      // Ensure email is verified for credentials-based sign-in
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await TwoFactorConfirmationModel.findOne({
          userId: existingUser._id,
        });

        if (!twoFactorConfirmation) return false;

        // Delete the two-factor confirmation after successful login
        await TwoFactorConfirmationModel.deleteOne({
          _id: twoFactorConfirmation._id,
        });
      }

      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (token.isTwoFactorEnabled && session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (!token.sub) return token;

      await dbConnect();
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      return token;
    },
  },
});
