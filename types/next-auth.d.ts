import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      address?: string
      idKey?: string
      provider?: string
      providerAccountId?: string
      isOAuthOnly?: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    address?: string
    idKey?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    address?: string
    idKey?: string
    provider?: string
    providerAccountId?: string
    isOAuthOnly?: boolean
  }
}