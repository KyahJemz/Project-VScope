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

		const Department = body.get("Department");
		const RecordId = body.get("RecordId");
		const ItemName = body.get("Name");
		const ItemDate = body.get("Date");
		const UniqueId = body.get("UniqueId");
		const Type = body.get("Type");

		if(!Department || !RecordId || !Type) {
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

			if(Type === "Add") {
				const uniqueId = uuidv4(); 

				const ValueToPush = {
					Date: ItemDate,
					Name: ItemName,
					Timestamp: (Date.now().toString()),
					UniqueId: uniqueId, 
				};
	
				appointment = await AppointmentModel.findByIdAndUpdate(RecordId,
					{ $push: { Sickness: ValueToPush } },
					{ new: true }
				);

			} else {

				const ValueToDelete = {
					UniqueId: UniqueId,
				};

				appointment = await AppointmentModel.findByIdAndUpdate(RecordId,
                    { $pull: { Sickness: ValueToDelete } },
                    { new: true }
                );

			}

			if (!appointment) {
				return new NextResponse('Record not found', { status: 404 });
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
