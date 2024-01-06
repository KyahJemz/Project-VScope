import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Notification from "@/models/Notification";
import sendMail from '@/app/api/sendMail/route.js';

async function sendEmail({ to, subject, text }) {
  try {
    await sendMail(to, subject, text);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

export const POST = async (request) => {
  if (request.method === 'POST') {
    const body = await request.formData();

    const Department = body.get("Department");
    const Id = body.get("Id");
    const GoogleEmail = body.get("GoogleEmail");
    const Action = body.get("Action");

    if (!Action || !GoogleEmail || !Id || !Department) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    try {
      await connect();

      const notification = await Notification.findById(Id);

      if (!notification) {
        return new NextResponse("Notification not found", { status: 404 });
      }

      if (Action === "Add") {
        if (!notification.Cleared.includes(GoogleEmail)) {
          notification.Cleared.push(GoogleEmail);
        }

      } else if (Action === "Remove") {
        notification.Cleared = notification.Cleared.filter(
          (email) => email !== GoogleEmail
        );
      }

      await notification.save();

      if (Action === "Add") {
        const to = GoogleEmail;
        const subject = "Clearance Cleared";
        const text = `Good Day,\n\nYour clearance to ${Department} department, titled "${notification?.Title??"-"}" his now cleared in the VScope system .\n\nIf you have any further questions or need to reschedule, please contact us through our system.\n\n`;
        sendEmail({to,subject,text});
      }

      return new NextResponse("Notification has been updated", { status: 200 });
    } catch (err) {
      console.error(err.message);
      return new NextResponse('Database Error:'+ err.message, { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};
