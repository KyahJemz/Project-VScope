import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";
import Calendar from "@/models/Calendar";
import sendMail from '@/app/api/sendMail/route.js';

const formatShortDate = (timestamp) => {
	const options = { month: 'short', day: 'numeric', year: 'numeric' };
	const formattedDate = new Date(timestamp).toLocaleDateString(undefined, options);
  
	return `${formattedDate}`;
};

export const POST = async (request) => {
	if (request.method === 'POST') {
		const body = await request.formData();

		const AppointmentId = body.get("AppointmentId");
		const Department = body.get("Department");
		const Date = body.get("Date");
		const Time = body.get("Time");

		if(!AppointmentId || !Department || !Date || !Time) {
			return new NextResponse("Missing required fields", { status: 400 });
		}
	
		try {
			await connect();

			let appointment = null;

			let AppointmentModel;
			if (Department === 'Medical') {
				AppointmentModel = MedicalAppointment;
			} else if (Department === 'Dental') {
				AppointmentModel = DentalAppointment;
			} else if (Department === 'SDPC') {
				AppointmentModel = SDPCAppointment;
			}

			const filter = { _id: AppointmentId };
			const update = { AppointmentDate: Date, AppointmentTime: Time, ReScheduled: true };

			appointment = await AppointmentModel.findOneAndUpdate(filter, update);

			const cleanedTime = `${body.get("Time")}`.replace("-", "");

			const newSchedule = {
				GoogleEmail: "Rescheduled",
				AppointmentId: AppointmentId,
			};
            
			await Calendar.findOneAndUpdate(
				{ Date: `${body.get("Date")}` },
				{ $push: { [cleanedTime]: newSchedule }, $set: { Department: Department } },
				{ new: true, upsert: true }
			);

			if (!appointment) {
				return new NextResponse('Record not found', { status: 404 });
			}

			if (appointment?.GoogleEmail) {
				const to = appointment.GoogleEmail;
				const subject = "Appointment Re-scheduled";
				const text = `We are pleased to inform you that your appointment status has been re-scheduled to ${formatShortDate(Date)} at ${Time} in the VScope system.\n\nIf you have any questions or need further assistance, please do not hesitate to contact us.\n\n`;
				await sendEmail({to,subject,text});
			}

      return new NextResponse('Success', { status: 200 });
		} catch (err) {
			console.error(err.message);
			return new NextResponse('Database Error:'+ err.message, { status: 500 });
		}
	} else {
		return new NextResponse('Method Not Allowed', { status: 405 });
	}
};
