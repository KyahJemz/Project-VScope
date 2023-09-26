import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Accounts from "@/models/Accounts"
import Staffs from "@/models/Staffs";
import Admins from "@/models/Admins";
import { Session } from "next-auth";


export const GET = async (request) => {
    const url = new URL(request.url);
    const GoogleEmail = url.searchParams.get("GoogleEmail");
    console.log("access GET", GoogleEmail);
  
    try {
      await connect();
  
      const account = await Accounts.find({ GoogleEmail });
      if (account.length > 0) {
        return new NextResponse(JSON.stringify({ path: "/services", data: account}), { status: 200 });
      }
  
      const staffs = await Staffs.find({ GoogleEmail });
      if (staffs.length > 0) {
        return new NextResponse(JSON.stringify({ path: "/authorized", data: staffs }), { status: 200 });
      }
  
      const admin = await Admins.find({ GoogleEmail });
      if (admin.length > 0) {
        return new NextResponse(JSON.stringify({ path: "/authorized", data: admin }), { status: 200 });
      }

      return new NextResponse(JSON.stringify({ path: "/login" }), { status: 200 });

    } catch (err) {
      console.error("Database Error:", err);
      return new NextResponse("Database Error", { status: 500 });
    }
  };

export const POST = async (request) => {
    if (request.method === 'POST') {
        return true;
    } else {
       return true;
    }
};

