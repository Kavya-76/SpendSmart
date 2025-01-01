import NextAuth, { type DefaultSession } from "next-auth"
import authConfig from "./auth.config"
import { getUserById } from "./data/user"
import { db } from "./lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { UserRole } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"
 
export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole
  isTwoFactorEnabled: Boolean
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,

  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },

  events: {
    async linkAccount({user}) {
      await db.user.update({
        where: {id: user.id},
        data: {emailVerified: new Date()}
      })
    }
  },

  callbacks: {
    async signIn({user, account}) {
      if(account?.provider !== "credentials") return true;
      
      const existingUser = await getUserById(user.id!)

      // To provide email signin without email verification
      if(!existingUser?.emailVerified) return false

      if(existingUser.isTwoFactorEnabled){
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

        if(!twoFactorConfirmation) return false;

        await db.twoFactorConfirmation.delete({
          where: {id: twoFactorConfirmation.id}
        })
      }
      return true;
    },

    async session({token, session}) {
      if(token.sub && session.user){
        session.user.id = token.sub
      }

      if(token.role && session.user){
        session.user.role = token.role as UserRole
      }

      if(token.isTwoFactorEnabled && session.user){
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      return session;  
    },

    async jwt({token, user}) {
      if(!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if(!existingUser) return token;

      token.role = existingUser.role
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
      return token;
    }

  }
})