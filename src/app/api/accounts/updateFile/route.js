import { NextRequest, NextResponse } from "next/server";
import connect from "@/utils/db";
import Accounts from "@/models/Accounts";

import { writeFile } from 'fs/promises'

const uploadDir = "public/images/uploads/files/";


export const POST = async (request) => {
  const data = await request.formData();
  const file = data.get('Attachment');
  const GoogleEmail = data.get('GoogleEmail');
  const Department = data.get('Department');

  try {
    await connect();

    let AttachmentName = ''; 

    if (file && typeof file.arrayBuffer === 'function') {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const randomString = Math.random().toString(36).substring(2, 8);

      AttachmentName = `${randomString}-${file.name}`;
    
      const path = `public/uploads/files/${AttachmentName}`;
      await writeFile(path, buffer);
    } else {
      return new NextResponse('No file provided', { status: 400 });
    }

    const newFile = await Accounts.findOneAndUpdate(
      { GoogleEmail: GoogleEmail },
      { $push: { [`${Department}Details.Files`]: { FileName: AttachmentName, Timestamp: new Date() } } },
      { new: true, upsert: true }
    );

    return new NextResponse('File has been created', { status: 201 });
  } catch (err) {
    console.error(err.message);
    return new NextResponse('Database Error:'+ err.message, { status: 500 });
  }
};