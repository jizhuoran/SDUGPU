import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions, DefaultSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";
import type { DefaultJWT } from "next-auth/jwt";

import { db } from "~/server/db";
import { env } from "~/env";

const SDU_EMAIL_DOMAINS = ["sdu.edu.cn", "mail.sdu.edu.cn"] as const;

function normalizeEmail(email: string | undefined) {
  return email?.trim().toLowerCase() ?? "";
}

export function isAllowedSduEmail(email: string | undefined) {
  const normalized = normalizeEmail(email);
  return SDU_EMAIL_DOMAINS.some((domain) =>
    normalized.endsWith(`@${domain}`)
  );
}

export function getEmailLocalPart(email: string) {
  return normalizeEmail(email).split("@")[0] ?? "";
}

export function isSduEmailPassword(email: string | undefined, password: string | undefined) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = password?.trim() ?? "";
  return (
    isAllowedSduEmail(normalizedEmail) &&
    normalizedPassword.length > 0 &&
    normalizedPassword === getEmailLocalPart(normalizedEmail)
  );
}

function createUsernameFromEmail(email: string) {
  const localPart = getEmailLocalPart(email);
  return localPart.replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-");
}

const sduEmailProvider = CredentialsProvider({
  id: "sdu-email",
  name: "SDU Email",
  credentials: {
    email: { label: "SDU Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    const email = normalizeEmail(credentials?.email);
    const password = credentials?.password;

    if (!isSduEmailPassword(email, password)) {
      return null;
    }

    const username = createUsernameFromEmail(email);
    const name = username;

    const existingUser = await db.user.findUnique({ where: { email } });
    const user = existingUser
      ? await db.user.update({
          where: { id: existingUser.id },
          data: {
            emailVerified: existingUser.emailVerified ?? new Date(),
            lastLogin: new Date(),
            ...(existingUser.name ? {} : { name }),
            ...(existingUser.username ? {} : { username }),
          },
        })
      : await db.user.create({
          data: {
            email,
            name,
            username,
            emailVerified: new Date(),
            lastLogin: new Date(),
          },
        });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      username: user.username ?? undefined,
    };
  },
});

const devLoginProvider = CredentialsProvider({
  id: "dev",
  name: "Dev Login",
  credentials: {
    username: { label: "Username", type: "text" },
  },
  async authorize(credentials) {
    const name = credentials?.username || "Local Dev";
    const email = `${name.toLowerCase().replace(/\s+/g, "-")}@dev.local`;
    let user = await db.user.findUnique({
      where: { email },
    });
    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name,
          username: name.toLowerCase().replace(/\s+/g, "-"),
        },
      });
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      username: user.username ?? undefined,
    };
  },
});

const githubProvider =
  env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET
    ? GithubProvider({
        clientId: env.AUTH_GITHUB_ID,
        clientSecret: env.AUTH_GITHUB_SECRET,
      })
    : null;

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username?: string;
    } & DefaultSession["user"];
  }

  interface User {
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    username?: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    sduEmailProvider,
    ...(process.env.NODE_ENV === "development"
      ? [devLoginProvider]
      : []),
    ...(githubProvider ? [githubProvider] : []),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" && profile) {
        const githubProfile = profile as { login: string };
        user.username = githubProfile.login;
      }
      return true;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    session: ({ session, user, token }) => {
      const userId = user?.id ?? token?.id ?? token?.sub;
      return {
        ...session,
        user: {
          ...session.user,
          id: userId ?? "",
          username: user?.username ?? token?.username,
        },
      };
    },
  },
  events: {
    async createUser({ user }) {
      if (user.username) {
        await db.user.update({
          where: { id: user.id },
          data: { username: user.username },
        });
      }
    },
  },
} satisfies NextAuthOptions;

interface DiscordProfile {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email: string | null;
}

export const discordAuth = (
  config: OAuthUserConfig<DiscordProfile>
): OAuthConfig<DiscordProfile> => ({
  id: "discord",
  name: "Discord",
  type: "oauth",
  authorization:
    "https://discord.com/api/oauth2/authorize?scope=identify+email",
  token: "https://discord.com/api/oauth2/token",
  userinfo: "https://discord.com/api/users/@me",
  profile(profile) {
    return {
      id: profile.id,
      name: profile.username,
      email: profile.email,
      image: profile.avatar
        ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
        : null,
    };
  },
  ...config,
});
