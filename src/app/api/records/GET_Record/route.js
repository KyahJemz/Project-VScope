import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";
import { encryptText, decryptText } from "@/utils/cryptojs";

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

	const Id = url.searchParams.get("Id");
	const Department = url.searchParams.get("Department");

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

		let query = {};
		if (Id) {
			query._id = Id;
		} else {
			return new NextResponse("Missing Id", { status: 400 });
		}
		if (Department) {
			query.Department = Department;
		} else {
			return new NextResponse("Missing Department", { status: 400 });
		}

		results = await AppointmentModel.findOne(query);

		if (results) {
		
			const topLevelFieldsToDecrypt = ["GoogleImage"];

			const decryptedResult = { ...results._doc };

			topLevelFieldsToDecrypt.forEach((field) => {
				decryptedResult[field] = decryptText(results._doc[field]);
			});

			if (results._doc.Details && Object.keys(results._doc.Details).length > 0) {
				decryptedResult.Details = decryptFields(results._doc.Details);
			}

			if (results._doc.Responses && results._doc.Responses.length > 0) {
				const decryptedResponses = results._doc.Responses.map(response => {
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

			// if (results._doc.Prescriptions && results._doc.Prescriptions.length > 0) {
			// 	const decryptedResponses = results._doc.Prescriptions.map(prescriptions => {
			// 		const decryptedResponse = {
			// 			Prescription: decryptText(prescriptions.Prescription),
			// 			Timestamp: decryptText(prescriptions.Timestamp),
			// 			UniqueId: prescriptions.UniqueId,
			// 		};
			// 		return decryptedResponse;
			// 	});
			// 	decryptedResult.Prescriptions = decryptedResponses;
			// }

			// if (results._doc.Diagnosis && results._doc.Diagnosis.length > 0) {
			// 	const decryptedResponses = results._doc.Diagnosis.map(diagnosis => {
			// 		const decryptedResponse = {
			// 			Diagnosis: decryptText(diagnosis.Diagnosis),
			// 			Timestamp: decryptText(diagnosis.Timestamp),
			// 			UniqueId: diagnosis.UniqueId,
			// 		};
			// 		return decryptedResponse;
			// 	});
			// 	decryptedResult.Diagnosis = decryptedResponses;
			// }

			// if (results._doc.Notes && results._doc.Notes.length > 0) {
			// 	const decryptedResponses = results._doc.Notes.map(note => {
			// 		const decryptedResponse = {
			// 			Note: decryptText(note.Note),
			// 			Timestamp: decryptText(note.Timestamp),
			// 			UniqueId: note.UniqueId,
			// 		};
			// 		return decryptedResponse;
			// 	});
			// 	decryptedResult.Notes = decryptedResponses;
			// }

			results = decryptedResult;
		}

		return new NextResponse(JSON.stringify(results), { status: 200 });
	} catch (err) {
		console.error(err.message);
		return new NextResponse('Database Error:'+ err.message, { status: 500 });
	}
};
