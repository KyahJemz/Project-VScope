import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Accounts from "@/models/Accounts";
import { encryptText, decryptText } from "@/utils/cryptojs";
import { promises as fsPromises } from 'fs';
import path from 'path';

const { unlink } = fsPromises;

export const POST = async (request) => {
  if (request.method === 'POST') {
    try {
      const body = await request.formData();

      const Department = body.get("Department");
      const GoogleEmail = body.get("GoogleEmail");
      const Key = body.get("Key");
      let Value = body.get("Value");

      await connect();

      let updatedPost = null;
      if (Department) {
        if (Key==="File") {
          const fileNameToDelete = Value;
          const user = await Accounts.findOne({ GoogleEmail: GoogleEmail });
          if (!user) {
            return new NextResponse('User not found', { status: 404 });
          }
          const fileIndex = user[Department+"Details"].Files.findIndex((file) => file.FileName === fileNameToDelete);
          if (fileIndex === -1) {
            return new NextResponse('File not found', { status: 404 });
          }
          const filePath = path.join(process.cwd(), 'public/uploads/files/', fileNameToDelete);
          user[Department+"Details"].Files.splice(fileIndex, 1);
          await unlink(filePath);
          await user.save();

          return new NextResponse('File deleted successfully', { status: 200 });
        } else {
          const encryptedValue = encryptText(Value);
          updatedPost = await Accounts.findOneAndUpdate(
            { GoogleEmail: GoogleEmail },
            { $set: { [`${Department}Details.${Key}`]: encryptedValue } },
            { new: true }
          );
        }
      } else {
        const encryptedValue = encryptText(Value);
        updatedPost = await Accounts.findOneAndUpdate(
          { GoogleEmail: GoogleEmail },
          { $set: { [`Details.${Key}`]: encryptedValue } },
          { new: true }
        );
      }
      
      if (!updatedPost) {
        return new NextResponse("Record not found", { status: 404 });
      }

      return new NextResponse("Success", { status: 200 });
    } catch (err) {
      console.error(err.message);
      return new NextResponse('Database Error:'+ err.message, { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};
