import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicineRequests from "@/models/MedicineRequests";
import { encryptText, decryptText } from "@/utils/cryptojs";
import { v4 as uuidv4 } from 'uuid';

export const POST = async (request) => {
	if (request.method === 'POST') {
		const body = await request.formData();

		const Department = body.get("Department");
		const GoogleImage = body.get("GoogleImage")??"";
		const Status = body.get("Status");
		let Medicines = body.get("Medicine");
		const GoogleEmail = body.get("GoogleEmail");
		const Name = body.get("Name");
		const Concern = body.get("Concern");
		let Counts = [];

		if(!Department || !GoogleEmail) {
			return new NextResponse("Missing required fields", { status: 400 });
		}

		Medicines = JSON.parse(Medicines);

		Medicines.forEach(element => {
			Counts.push(0)
		});
	
		try {
			await connect();
			const result = new MedicineRequests({
				Name,
				GoogleEmail,
				Medicines,
				Counts,
				Status,
				Concern,
				Department,
				GoogleImage,
			})
			await result.save();

			if (!result) {
				return new NextResponse('Failed to save', { status: 404 });
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
