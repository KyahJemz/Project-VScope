import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Accounts from "@/models/Accounts"
import Staffs from "@/models/Staffs";
import Admins from "@/models/Admins";
import connect from "@/utils/db";

async function addToSession(){

}

var data = null;

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

        if (user.account.provider === 'google') {
          try {
            await connect();

            const staffs = await Staffs.find({ GoogleEmail });
            if (staffs.length > 0) {
              data = staffs[0];
              return true
            }

            const admin = await Admins.find({ GoogleEmail });
            if (admin.length > 0) {
              data = admin[0];
              return true
            }

          } catch (err) {
              console.log(err);
            return false;
          }
        }
    
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
                data = newPost;
                await newPost.save();
          
                return true;
              } catch (err) {
                console.log(err);
                return false;
              }
            } else {
              data = results[0];
              return true;
            }
          } catch (err) {
            console.log(err);
            return false;
          }
        }
        return false;
      },
      async session ({ session } ) {
        session.UserData = data;
        console.log('data',data);
        return session;
      }
    }
});

export { handler as GET, handler as POST };