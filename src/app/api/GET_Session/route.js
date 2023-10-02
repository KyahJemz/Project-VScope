import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { handler } from "/api/auth[...nextauth]/route"

export async function GET() {
    const session = await getServerSession(handler);

    if (!session) {
        return NextResponse(JSON.stringify({message: "Not Logged In"}));
    }
    return NextResponse(JSON.stringify({ name: session.user.name}));
};
