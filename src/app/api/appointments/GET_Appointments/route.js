import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";
import Accounts from "@/models/Accounts";
import { encryptText, decryptText } from "@/utils/cryptojs";
import Defaults from '@/models/Defaults';
import sendMail from '@/app/api/sendMail/route.js';

async function sendEmail({ to, subject, text }) {
	try {
		await sendMail(to, subject, text);
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, error: 'Internal Server Error' });
	}
}

const decryptFields = (obj) => {
	if (typeof obj !== "object" || obj === null) {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => decryptFields(item));
	}
  
	const decryptedObj = {};
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			if (typeof obj[key] === "object" && obj[key] !== null) {
				decryptedObj[key] = decryptFields(obj[key]);
			} else {
				decryptedObj[key] = decryptText(obj[key]);
			}
		}
	}
	return decryptedObj;
};

export const GET = async (request) => {
	const url = new URL(request.url);
	const GoogleEmail = url.searchParams.get("GoogleEmail");
	const Department = url.searchParams.get("Department");
	const Status = url.searchParams.get("Status");

	try {
		await connect();

		let results = null;

		let AppointmentModel = null;

		if (Department === 'Medical') {
			AppointmentModel = MedicalAppointment;
		} else if (Department === 'Dental') {
			AppointmentModel = DentalAppointment;
		} else if (Department === 'SDPC') {
			AppointmentModel = SDPCAppointment;
		}

		if (GoogleEmail === "" || GoogleEmail === null) {
			if (Status === "" || Status === null) {
				results = await AppointmentModel.find();
			} else {
				results = await AppointmentModel.find(Status && {Status});
			}
		} else {
			results = await AppointmentModel.find(GoogleEmail && { GoogleEmail });
		}

	if (results) {
	
		const topLevelFieldsToDecrypt = ["Name", "Id", "Consern", "GoogleImage"];

		results = results.map((result) => {
			const decryptedResult = { ...result._doc };

			topLevelFieldsToDecrypt.forEach((field) => {
				decryptedResult[field] = decryptText(result._doc[field]);
			});

			if (result._doc.Details && Object.keys(result._doc.Details).length > 0) {
				decryptedResult.Details = decryptFields(result._doc.Details);
			}

			if (result._doc.Responses && result._doc.Responses.length > 0) {
					const decryptedResponses = result._doc.Responses.map(response => {
						const decryptedResponse = {
							Name: decryptText(response.Name),
							GoogleEmail: decryptText(response.GoogleEmail),
							Response: decryptText(response.Response),
							Timestamp: decryptText(response.Timestamp),
							ViewedByDepartment: response.ViewedByDepartment,
							ViewedByClient: response.ViewedByClient
						};
					return decryptedResponse;
				});
				decryptedResult.Responses = decryptedResponses;
			}

			return decryptedResult;
		});
	}

		return new NextResponse(JSON.stringify(results), { status: 200 });
	} catch (err) {
		return new NextResponse("Database Error" + err, { status: 500 });
	}
};
