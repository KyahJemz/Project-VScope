import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Accounts from "@/models/Accounts";

export const POST = async (request) => {
  if (request.method === 'POST') {
    try {
      const body = await request.formData();
      const GoogleEmail = body.get("Gmail");
      const Role = body.get("Role");
      const Department = body.get("Department");

      await connect();

      console.log(Department === "");
       if (Department === "") {
        const newAccount = await Accounts.create({
          GoogleId: "-",
          GoogleImage: "-",
          GoogleName: "-",
          GoogleFirstname: "-",
          GoogleLastname: "-",
          GoogleEmail,
          Role,
        });
       } else {
        const newAccount = await Accounts.create({
          GoogleId: "-",
          GoogleImage: "-",
          GoogleName: "-",
          GoogleFirstname: "-",
          GoogleLastname: "-",
          GoogleEmail,
          Role,
          Department,
        });
       }
      

      return new NextResponse('Success', { status: 200 });
    } catch (err) {
      console.error(err);
      return new NextResponse('Database Error', { status: 500 });
    }
  } else {
    return new NextResponse('Method Not Allowed', { status: 405 });
  }
};