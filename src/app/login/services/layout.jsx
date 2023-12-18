import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import SidebarClient from "@/components/SidebarClient/SidebarClient";

const Layout = async ({ children }) => {

    const session = await getServerSession(authOptions);
    // console.log("session",session);

    if (session === null) {
        redirect('/login');
        return null;
    } else {
        if (session.user?.department) {
            if (session.user.department === "Administrator") {
                redirect('/login/administrator/');
            } else {
                redirect('/login/authorized/' + session.user.department);
            }
            return null;
        } else {
            return (
                <>
                    <SidebarClient/>
                    {children}
                </>
              );
        }
    }     
    

    redirect('/login');
    return null;
};

export default Layout;


