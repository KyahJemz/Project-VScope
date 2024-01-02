import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation'; // Assuming this is the correct import for server-side navigation

const Layout = async ({ children }) => {
  const session = await getServerSession(authOptions);
  console.log(children.props.childProp.segment[1])

  if (session === null) {
    redirect('/login');
    return null;
  } else {
    if (session.user?.department) {
      const userDepartment = (session.user?.department || '').toLowerCase();
      const inputDepartment = (children.props.childProp.segment[1] || '').toLowerCase();
      if (userDepartment !== inputDepartment) {
        redirect('/login/authorized/' + session.user?.department);
        return null;
      } else {
        return children;
      }
    } else {
      console.log('--INVALID ACCESS--', session);
      redirect('/login/services');
      return null;
    }
  }
};

export default Layout;
