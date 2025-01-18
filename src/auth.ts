import NextAuth from "next-auth";
import { User, Account } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./data/user";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook"
import bcrypt from "bcryptjs";
import UserModel from "./models/User";
import dbConnect from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!
    }), 
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: Partial<Record<"email" | "password", unknown>>): Promise<User | null> => {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            const userWithValidId: User = {
              ...user.toObject(), // Convert the MongoDB document to a plain object
              _id: String(user._id), // Ensure _id is a string
            };
            return userWithValidId;
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      if (account?.provider !== "credentials") {
        try {
          await dbConnect();
          let existingUser = await UserModel.findOne({ email: user.email });
  
          if (!existingUser) {
            // Create a new user if it doesn't exist
            const newUser = new UserModel({
              name: user.name,
              email: user.email,
              isVerified: true, // OAuth users are typically considered verified
            });
            existingUser = await newUser.save();
          }
  
          // Attach the user's database _id to the user object
          // user._id = existingUser._id.toString();
          user._id = String(existingUser._id);
        } catch (error) {
          console.error("Error during signIn:", error);
          return false;
        }
      }
  
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: process.env.AUTH_SECRET,
});
