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
	
		if (!HealthReportValue || !HealthReportDate){
			return new NextResponse('Missing parameters', { status: 404 });
		}

		try {
			await connect();

			const result = await Accounts.findOneAndUpdate(
				{ 
					GoogleEmail: GoogleEmail, 
					[`SicknessReport.${Department}`]: { $elemMatch: { Status: "In Progress" } } 
				},
				{
					$push: {
						[`SicknessReport.${Department}.$[elem].Updates`]: {
							Symptoms: HealthReportValue,
							Date: HealthReportDate
						}
					}
				},
				{
					new: true,
					arrayFilters: [{ "elem.Status": "In Progress" }]
				}
			);
			
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
