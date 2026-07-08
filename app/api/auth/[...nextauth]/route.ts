import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
export const dynamic = 'force-dynamic'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Here you would typically check against a database
        // For now, we'll use a simple demo user
        const demoUser = {
          id: "1",
          email: "demo@example.com",
          password: await bcrypt.hash("password123", 12),
          name: "Demo User"
        }

        if (credentials.email === demoUser.email) {
          const isPasswordValid = await bcrypt.compare(credentials.password, demoUser.password)
          
          if (isPasswordValid) {
            return {
              id: demoUser.id,
              email: demoUser.email,
              name: demoUser.name,
            }
          }
        }

        // If credentials are invalid, return null
        return null
      }
    })
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
}


const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
