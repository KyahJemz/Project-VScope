import { NextResponse } from "next/server";
import connect from "@/utils/db";
import DirectMessages from "@/models/DirectMessages";
import { encryptText, decryptText } from "@/utils/cryptojs";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";
import MedicalAppointment from "@/models/MedicalAppointment";

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
	const Type = url.searchParams.get("Type");

	try {
		await connect();

		let results = null;
    	let appointmentModel = null;

		if(!Department && GoogleEmail && !Type) {
			const results = [].concat(
				await MedicalAppointment.find({ GoogleEmail }),
				await DentalAppointment.find({ GoogleEmail }),
				await SDPCAppointment.find({ GoogleEmail })
			  );
			return new NextResponse(JSON.stringify(results), { status: 200 });
		}

		if(Department && !GoogleEmail && !Type) {
			if(Department === "Medical") {
				results = await MedicalAppointment.find();
			} else if(Department === "Dental") {
				results = await DentalAppointment.find();
			} else if(Department === "SDPC") {
				results = await SDPCAppointment.find();
			} else {
				return new NextResponse("Invalid Department", { status: 404 });
			}
			return new NextResponse(JSON.stringify(results), { status: 200 });
		}

		if (Type === "Message"){
			if(Department === "Medical") {
				appointmentModel = MedicalAppointment;
			} else if(Department === "Dental") {
				appointmentModel = DentalAppointment;
			} else if(Department === "SDPC") {
				appointmentModel = SDPCAppointment;
			} else {
				return new NextResponse("Invalid Department", { status: 404 });
			}
		} else {
			
		}

	if (!GoogleEmail) {
		if (Type === "Direct Message") {
			results = await DirectMessages.find({ Department });
		} else if (Type === "Message") {
			results = await appointmentModel.find({
				$or: [
					{ Responses: { $exists: true, $ne: [] } },
					{ Status: { $in: ["Approved", "In Progress", "Completed"] } }
				]
			});
		} else {
			return new NextResponse("Invalid Type", { status: 404 });
		}
    } else {
		if (Type === "Direct Message") {
			results = await DirectMessages.find({ GoogleEmail, Department });
		} else if (Type === "Message") {
			results = await appointmentModel.find({
				GoogleEmail,
				$or: [
					{ Responses: { $exists: true, $ne: [] } },
					{ Status: { $in: ["Approved", "In Progress"] } }
				]
			});
		} else {
				return new NextResponse("Invalid Type", { status: 404 });
		}
    }

	if (results && Type === "Message") {
	
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
							Attachment: response.Attachment,
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
		console.error(err.message);
		return new NextResponse('Database Error:'+ err.message, { status: 500 });
	}
};
