import React from "react";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route"
import About from "./client/page"
import { notFound } from "next/navigation";

const Page = async () => {
    const session = await getServerSession(authOptions);
    console.log("SSSSSSS", session);
    if (session === null) {
        return <div>You need to login first.</div>;
    } else {
        return (<About data={session} />);
    }
}
    

export default Page