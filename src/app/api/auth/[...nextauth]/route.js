import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Accounts from "@/models/Accounts";

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
        const { email, id: GoogleId, image, name } = user.user;
        const { given_name: GoogleFirstname, family_name: GoogleLastname } = user.profile;
    
        if (user.account.provider === 'google' && user.profile.hd === 'sscr.edu') {
          const encodedEmail = encodeURIComponent(email);

          console.log("Google Provider user:", user.user);
    
          // const response = await fetch(`/api/accounts?GoogleEmail=${encodedEmail}`);
          // if (!response.ok) {
          //   throw new Error('Network response was not ok');
          // }
    
          // const accountsData = await response.json();
          const accountsData= [];
    
          if (accountsData.length === 0) {
            const formData = new FormData();
            formData.append('GoogleId', GoogleId);
            formData.append('GoogleEmail', email);
            formData.append('GoogleImage', image);
            formData.append('GoogleName', name);
            formData.append('GoogleFirstname', GoogleFirstname);
            formData.append('GoogleLastname', GoogleLastname);
    
            const postResponse = await fetch('/api/accounts', {
              method: 'POST',
              body: formData,
            });
    
            if (!postResponse.ok) {
              throw new Error('Failed to create account');
            }
          }
    
          return true;
        }
    
        return false;
      },
    }
});

export { handler as GET, handler as POST };