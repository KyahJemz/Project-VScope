import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      async authorize(credentials) {
        // Check if the user's email domain is @sscr.edu
        const userEmail = credentials.email;
        if (userEmail.endsWith("@sscr.edu")) {
          await connect();

          try {
            const user = await User.findOne({
              email: credentials.email,
            });

            if (user) {
              const isPasswordCorrect = await bcrypt.compare(
                credentials.password,
                user.password
              );

              if (isPasswordCorrect) {
                return Promise.resolve(user);
              } else {
                return Promise.resolve(null); // Wrong password
              }
            } else {
              return Promise.resolve(null); // User not found
            }
          } catch (err) {
            return Promise.resolve(null); // Error
          }
        } else {
          return Promise.resolve(null); // Reject sign-in for non-sscr.edu emails
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    error: "/appointment/login",
  },
});

export { handler as GET, handler as POST };
