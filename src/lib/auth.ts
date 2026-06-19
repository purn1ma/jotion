import { NextAuthOptions, getServerSession } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { nanoid } from "nanoid";
import GoogleProvider from "next-auth/providers/google"
import { db } from "./db";
import { cache } from "react";

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if(!clientId || clientId.length == 0) {
    throw new Error('Missing GOOGLE_CLIENT_ID')
  }

  if(!clientSecret || clientSecret.length == 0) {
    throw new Error('Missing GOOGLE_CLIENT_SECRET')
  }

  return { clientId, clientSecret }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/sign-in"
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret
    })
  ],
  callbacks: {
    async session({session, token}) {
      if(token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.username = token.username
      }
      return session
    },
    async jwt({token, user}) {
      // Token already fully populated — skip the DB lookup on every API call.
      // This runs on every getServerSession() call, so avoiding the DB query
      // here eliminates one round-trip per API request.
      if (token.id) {
        return token
      }

      const dbUser = await db.user.findFirst({
        where: {
          email: token.email
        }
      })

      if(!dbUser) {
        token.id = user!.id
        return token
      }

      if(!dbUser.username) {
        await db.user.update({
          where: {
            id: dbUser.id
          },
          data: {
            username: nanoid(10)
          }
        })
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
      }
    },
    redirect({ url, baseUrl }) {
      // Honour relative callbackUrls (e.g. /documents/abc) and same-origin absolutes.
      // Fall back to /documents so login always lands on the app, not the marketing page.
      if (url.startsWith('/')) return url
      if (url.startsWith(baseUrl)) return url
      return baseUrl + '/documents'
    }
  }
}
 
// cache() deduplicates calls within a single server request — if the layout,
// page, and API route all call getAuthSession(), the JWT is decoded only once.
export const getAuthSession = cache(() => getServerSession(authOptions))