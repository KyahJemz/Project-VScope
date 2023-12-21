import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";
import { encryptText, decryptText } from "@/utils/cryptojs";
import { v4 as uuidv4 } from 'uuid';

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

			const uniqueId = uuidv4(); 

			const ValueToPush = {
                [Key]: encryptText(Value),
                Timestamp: encryptText(Date.now().toString()),
                UniqueId: uniqueId, 
            };

			if (Key === "Prescription") {
				appointment = await AppointmentModel.findByIdAndUpdate(RecordId,
					{ $push: { Prescriptions: ValueToPush } },
					{ new: true }
				);
			} else if (Key === "Diagnosis") {
				appointment = await AppointmentModel.findByIdAndUpdate(RecordId,
					{ $push: { Diagnosis: ValueToPush } },
					{ new: true }
				);
			} else if (Key === "Note") {
				appointment = await AppointmentModel.findByIdAndUpdate(RecordId,
					{ $push: { Notes: ValueToPush } },
					{ new: true }
				);
			} else {
				return new NextResponse("Invalid Key", { status: 400 });
			}

			if (!appointment) {
				return new NextResponse('Record not found', { status: 404 });
			}

			return new NextResponse('Success', { status: 200 });
		} catch (err) {
			return new NextResponse('Database Error: '+err, { status: 500 });
		}
	} else {
		return new NextResponse('Method Not Allowed', { status: 405 });
	}
};
