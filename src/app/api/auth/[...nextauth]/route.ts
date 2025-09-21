import { apiServices } from "@/Services/api";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
          name: "Credentials",

          credentials: {
            email: { label: "Email", type: "email" , placeholder: "example@gmail.com" },
            password: { label: "Password", type: "password" , placeholder: "********" }
          },

          async authorize(credentials, req) {
            try {
              if (!credentials?.email || !credentials?.password) {
                return null
              }

              const response = await apiServices.loginApi(credentials.email, credentials.password)
      
              if (response && response.message === "success") {
                const user = {
                  id: response.user.email, 
                  name: response.user.name, 
                  email: response.user.email, 
                  phone: response.user.phone,
                  role: response.user.role,
                  token: response.token
                }   
                return user
              } else {
                return null
              }
            } catch (error) {
              return null
            }
          }
        })
      ],
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = {
                    id: user.id || '',
                    name: user.name || '',
                    email: user.email || '',
                    phone: (user as any).phone || '',
                    role: (user as any).role || '',
                    token: (user as any).token || ''
                }
            }
            return token
        },
        async session({ session, token }) {
            if (token.user) {
                session.user.id = token.user.id
                session.user.name = token.user.name
                session.user.email = token.user.email
                session.user.phone = token.user.phone
                session.user.role = token.user.role
                session.user.token = token.user.token
            }
            return session
        }
    }
})

export { handler as GET, handler as POST }