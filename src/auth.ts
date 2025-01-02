import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./data/user";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        credentials: {
          email: {},
          password: {},
        },
        authorize: async (credentials) => {
          const validatedFields = LoginSchema.safeParse(credentials)
          if(validatedFields.success){
            const {email, password} = validatedFields.data

            const user = await getUserByEmail(email);
            if(!user || !user.password) return null;

            const passwordsMatch = await bcrypt.compare(
                password,
                user.password
            );

            if(passwordsMatch){
                console.log("Password matches");
                return user;
            }
          }
          return null;
        },
      }),
  ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token._id = user._id?.toString();
//         token.isVerified = user.;
//         token.username = user.username;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user._id = token._id;
//         session.user.isVerified = token.isVerified;
//         session.user.username = token.username;
//       }
//       return session;
//     },
//   },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  secret: process.env.NEXTAUTH_SECRET,
});
