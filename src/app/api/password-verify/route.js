import { NextResponse } from "next/server";
import { Passwords } from '@/models/Passwords'

export const POST = async (request) => {
    if (request.method === 'POST') {
      const body = await request.formData();

      const Department = body.get("Department"); 
      const PasswordText = body.get("Password"); 

      if (Passwords[Department] && PasswordText === Passwords[Department].Password) {
        return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
      } else {
        return new NextResponse(JSON.stringify({ success: false }), { status: 401 });
      }
    } else {
      return new NextResponse("Method Not Allowed", { status: 405 });
    }
  };