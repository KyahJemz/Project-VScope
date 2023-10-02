
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import About from "./client/page";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";

const Page = async () => {
    const session = await getServerSession(authOptions);
    console.log("session",session);
    if (session === null) {
        redirect('/login');
    } else {
        return (<About data={session.user} />);
    }
}
    

export default Page