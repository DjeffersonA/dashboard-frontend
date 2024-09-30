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
          if (profile?.email && profile.email.endsWith("@faculdadefgi.online")) {
            return true; // Allow
          } else {
            return false; // Deny
          }
        },
      },
});

export { handler as GET, handler as POST };