import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import styles from "./page.module.css";

const Layout = async ({ children }) => {

    const session = await getServerSession(authOptions);

    if (session === null) {
        redirect('/login');
        return null;
    } else {
        if (session.user?.department && session.user.department != null) {
            if (session.user.department === "Administrator") {
                return (
                    <div className={styles.mainContainer}>
                        <div className={styles.MiniNavTop}>
                            <a href={'/login/administrator/dashboard'} className={`${styles.MiniNavButton}`}>Dashboard</a>
                            <a href={'/login/administrator/management'} className={`${styles.MiniNavButton}`}>Account Management</a>
                        </div>

                        {children}

                    </div>
                );
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

