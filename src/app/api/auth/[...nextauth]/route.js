import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Accounts from "@/models/Accounts"
import connect from "@/utils/db";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    error: "/login",
  },
  callbacks: {
    async signIn(user, account, profile) {
        const { email: GoogleEmail, id: GoogleId, image: GoogleImage, name: GoogleName } = user.user;
        const { given_name: GoogleFirstname, family_name: GoogleLastname } = user.profile;
    
        if (user.account.provider === 'google' && user.profile.hd === 'sscr.edu') {
          console.log("Google Provider user:", user.user);

          try {
            await connect();
            const results = await Accounts.find({ GoogleEmail });
            console.log(results);
            if (results.length === 0) {
              try {
                const newPost = new Accounts({
                  GoogleId,
                  GoogleEmail,
                  GoogleImage,
                  GoogleName,
                  GoogleFirstname,
                  GoogleLastname,
                });
          
                await newPost.save();
          
                return true;
              } catch (err) {
                console.log(err);
                return false;
              }
            } else {
              return true;
            }
          } catch (err) {
            console.log(err);
            return false;
          }
        }
        return false;
      }
    }
});

export { handler as GET, handler as POST };