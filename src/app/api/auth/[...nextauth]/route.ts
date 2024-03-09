import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";

// This NextAuth function is used to initialize Next Authentication
const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}
