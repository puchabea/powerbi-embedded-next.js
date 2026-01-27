import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/app/lib/prisma";

type Role = "ADMIN" | "USER";
type AppUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
};

type TokenWithAppData = JWT & {
  uid?: string;
  role?: Role;
  isActive?: boolean;
};

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/" },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        if (user.isActive === false) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        const appUser: AppUser = {
          id: user.id,
          name: user.name ?? user.email,
          email: user.email,
          role: user.role, 
          isActive: user.isActive,
        };

        return appUser;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      const t = token as TokenWithAppData;

      if (user) {
        const u = user as AppUser;
        t.uid = u.id;
        t.role = u.role;
        t.isActive = u.isActive;
      }

      return token;
    },

    async session({ session, token }) {
      const t = token as TokenWithAppData;

      if (session.user) {
        session.user.id = t.uid ?? "";
        session.user.role = t.role ?? "USER";
        session.user.isActive = Boolean(t.isActive);
      }

      return session;
    },
  },
};
