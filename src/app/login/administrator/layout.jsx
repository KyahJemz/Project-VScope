import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

const Layout = async ({ children }) => {

    const session = await getServerSession(authOptions);

    if (session === null) {
        redirect('/login');
        return null;
    } else {
        if (session.user?.department && session.user.department != null) {
            if (session.user.department === "Administrator") {
                return children;
            } else {
              redirect('/login/authorized/' + session.user.department);
            }
        } else {
            redirect('/login/services');
        }
    }   
    redirect('/login');
    return null;
};

export default Layout;

