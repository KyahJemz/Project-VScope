import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";
import Accounts from "@/models/Accounts";
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
	const GoogleEmail = url.searchParams.get("GoogleEmail");
	const Department = url.searchParams.get("Department") ?? null;
	const Status = url.searchParams.get("Status");
	const Type = url.searchParams.get("Type");


	try {
		await connect();

		let results = null;

		let AppointmentModel = null;
		if (Department !== null && Department !== "") {
			let AppointmentModel = null;
		  
			if (Department === 'Medical') {
			  AppointmentModel = MedicalAppointment;
			} else if (Department === 'Dental') {
			  AppointmentModel = DentalAppointment;
			} else if (Department === 'SDPC') {
			  AppointmentModel = SDPCAppointment;
			}
		  
			if (!GoogleEmail) {
			  let query = {};
		  
				if (Type === "WalkIn" || Type === "Appointment" || Type === "All") {
					if (Type !== "All") {
						query.Type = Type;
					}
				}

			  	if (Status) {
					query.Status = Status;
				}
				console.log(query);
				results = await AppointmentModel.find(query);
			} else {
				let query = {};
		  
				if (Type === "WalkIn" || Type === "Appointment" || Type === "All") {
					if (Type !== "All") {
						query.Type = Type;
					}
				}

			  	if (Status !== '' && Status !== null && Status !== "" && !Status) {
					query.Status = Status;
				}
				query.GoogleEmail = GoogleEmail;
				console.log(query);
				results = await AppointmentModel.find(query);
			}
		  } else {
			results = [];
			const AppointmentModels = [MedicalAppointment, DentalAppointment, SDPCAppointment];
		  
			for (const model of AppointmentModels) {
				let query = {};
				if (GoogleEmail !== '' || GoogleEmail !== null || Status !== "") {
					query.GoogleEmail = GoogleEmail;
				}
				if (Status !== '' || Status !== null || Status !== "") {
					query.GoogleEmail = GoogleEmail;
				}
				if (Type === "WalkIn" || Type === "Appointment") {
					query.Type = Type;
				}
				console.log(query);
			  results = results.concat(await model.find(query));
			}
		  }
		  

	if (results) {
	
		const topLevelFieldsToDecrypt = ["GoogleImage"];

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
