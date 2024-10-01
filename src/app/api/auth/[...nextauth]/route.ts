import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth ({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (profile?.email && profile.email.endsWith(`@${process.env.DOMAIN}`)) {
        return true; // Allow
      } else {
        return false; // Deny
      }
    },
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
});

export { handler as GET, handler as POST };