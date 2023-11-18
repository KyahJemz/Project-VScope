import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

const Layout = async ({ children }) => {

    const session = await getServerSession(authOptions);
    // console.log("session",session);

    if (session === null) {
        redirect('/login');
        return null;
    } else {
        if (session.user?.department) {
            redirect('/login/authorized/'+session.user.department);
            return null;
        } else {
            return children;
        }
    }     

    redirect('/login');
    return null;
};

export default Layout;


