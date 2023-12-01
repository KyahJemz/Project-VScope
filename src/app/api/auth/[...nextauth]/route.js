import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Accounts from "@/models/Accounts"
import connect from "@/utils/db";
import { encryptText, decryptText } from "@/utils/cryptojs";

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
        const { email: GoogleEmail, id: GoogleId, image: GoogleImage, name: GoogleName } = user.user;
        const { given_name: GoogleFirstname, family_name: GoogleLastname } = user.profile;
    
        if (user.account.provider === 'google') {

          try {

            await connect();

            const results = await Accounts.findOne({ GoogleEmail });

            if (results != null) {
              console.log("--NEXTAUTH--", "Old Client");

              try {
                await Accounts.updateOne(
                  { GoogleEmail },
                  {
                    $set: {
                      GoogleId: encryptText(GoogleId),
                      GoogleImage: encryptText(GoogleImage),
                      GoogleName: encryptText(GoogleName),
                      GoogleFirstname: encryptText(GoogleFirstname),
                      GoogleLastname: encryptText(GoogleLastname),
                    },
                  }
                );

                return true;
              } catch (err) {
                console.log(err);
                return false;
              }

            } else {
              console.log("--NEXTAUTH--", "New Client");
              return false;
            }

          } catch (err) {
            console.log(err);
            return false;
          }
        } else {
          return false;
        }
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