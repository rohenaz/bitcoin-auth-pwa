import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserByToken } from "@/lib/auth"

const handler = NextAuth({
  providers: [
    Credentials({
      credentials: {
        token: { label: "Token", type: "text" },
      },
      authorize: async (credentials) => {
        const user = await getUserByToken(credentials?.token)
        if (user) {
          return user
        }
        return null
      },
    }),
  ],
})

export { handler as GET, handler as POST }