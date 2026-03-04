import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { env } from "@/config/env";
import prisma from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: false,
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },

  accountLinking: {
    enabled: true,
    trustedProviders: ["google", "github"],
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // update session every 24 hours
  },

  trustedOrigins: [env.BETTER_AUTH_URL],

  plugins: [nextCookies(), admin()],
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
      banned: {
        type: "boolean",
      },
      banReason: {
        type: "string",
      },
      banExpires: {
        type: "number",
      },
    },
  },
});

export type Auth = typeof auth;
export type UserRole = "user" | "admin";

export interface Session {
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    emailVerified: boolean;
    role: UserRole;
    banned: boolean | null;
    banReason: string | null;
    banExpires: number | null;
    createdAt: Date;
    updatedAt: Date;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}
