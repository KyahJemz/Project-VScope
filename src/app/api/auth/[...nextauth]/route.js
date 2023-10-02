import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Accounts from "@/models/Accounts"
import Staffs from "@/models/Staffs";
import Admins from "@/models/Admins";
import connect from "@/utils/db";

var data;

export const authOptions = {
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
        console.log("--CALLBACK--",user.account)
        const { email: GoogleEmail, id: GoogleId, image: GoogleImage, name: GoogleName } = user.user;
        const { given_name: GoogleFirstname, family_name: GoogleLastname } = user.profile;

        

        if (user.account.provider === 'google') {
          try {
            await connect();
            const results = await Accounts.find({ GoogleEmail });
            if (results) {
              data = results;
              return true
            }
          } catch (err) {
              console.log(err);
            return false;
          }
        }
    
        if (user.account.provider === 'google' && user.profile.hd === 'sscr.edu') {
          try {
            await connect();
            const results = await Accounts.find({ GoogleEmail });
            if (results) {
              data = results[0];
              return true;
            } else {
              try {
                const newPost = new Accounts({
                  GoogleId,
                  GoogleEmail,
                  GoogleImage,
                  GoogleName,
                  GoogleFirstname,
                  GoogleLastname,
                  Role: "Client"
                });
                data = newPost;
                await newPost.save();
          
                return true;
              } catch (err) {
                console.log(err);
                return false;
              }
            }
          } catch (err) {
            console.log(err);
            return false;
          }
        }
        return false;
      },
      async session({ session, token }) {
        try {
          if (token && token.email) {
            await connect();
            const user = await Accounts.findOne({ GoogleEmail: token.email });
    
            if (user) {
              session.user.role = user.Role;
              if(user?.Department) {
                session.user.department = user.Department;
              } 
            }
          }
        } catch (error) {
          console.error('Error fetching user role from MongoDB:', error);
        }
    
        return Promise.resolve(session);
      },
    }
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST };