import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Accounts from "@/models/Accounts";
import { encryptText, decryptText } from "@/utils/cryptojs";
import { v4 as uuidv4 } from 'uuid';

export const POST = async (request) => {
	if (request.method === 'POST') {
		const body = await request.formData();

		const HealthReportValue = body.get("HealthReportValue");
		const HealthReportDate = body.get("HealthReportDate");
		const Department = body.get("Department");
		const GoogleEmail = body.get("GoogleEmail");
		const Id = body.get("Id");

		if (!HealthReportValue || !HealthReportDate || !Id){
			return new NextResponse('Missing parameters', { status: 404 });
		}

		try {
			await connect();
			const result = await Accounts.findOneAndUpdate(
				{ 
					GoogleEmail: GoogleEmail, 
					[`SicknessReport.${Department}`]: {
						$elemMatch: {
							"Updates._id": Id,
							$or: [
								{ "Status": "In Progress" },
								{ "Status": "Approved" }
							]
						}
					}
				},
				{ 
					$set: { 
						[`SicknessReport.${Department}.$[elem].Updates.$[updateElem].Symptoms`]: HealthReportValue,
						[`SicknessReport.${Department}.$[elem].Updates.$[updateDateElem].Date`]: HealthReportDate
					}
				},
				{
					arrayFilters: [
						{ "elem.Status": "In Progress" },
						{ "updateElem.Status": "Approved" }, // Changed to updateElem.Status
						{ "updateDateElem._id": Id } // Unique field name for the second array filter
					]
				}
			);
			
			
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
