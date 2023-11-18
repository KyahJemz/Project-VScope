import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

const Layout = async ({ children }) => {

    const session = await getServerSession(authOptions);

    if (session === null) {
        redirect('/login');
        return null;
    } else {
        if (session.user?.department) {
            return children;
        } else {
            console.log("--INVALID ACCESS--",session);
            redirect('/login/services');
            return null;
        }
    }     

    redirect('/login');
    return null;
};

export default Layout;

