import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Accounts from "@/models/Accounts";
import { encryptText, decryptText } from "@/utils/cryptojs";
import { v4 as uuidv4 } from 'uuid';

export const POST = async (request) => {
	if (request.method === 'POST') {
		const body = await request.formData();

		let Diagnosis = body.get("Diagnosis");
		const Department = body.get("Department");
		const GoogleEmail = body.get("GoogleEmail");
		const GoogleImage = body.get("GoogleImage");
		const Name = body.get("GoogleEmail");
	
		if (!Diagnosis || !Name){
			return new NextResponse('Missing parameters', { status: 404 });
		}

		try {
			await connect();

			Diagnosis = JSON.parse(Diagnosis);

			const result = await Accounts.findOneAndUpdate(
				{ GoogleEmail: GoogleEmail },
				{
				  $push: {
					[`SicknessReport.${Department}`]: {
					  Diagnosis,
					  Department,
					  GoogleEmail,
					  GoogleImage,
					  Name,
					  Status: "In Progress",
					  IsRequestCleared: false,
					  IsNew: true,
					  Updates: []
					}
				  }
				},
				{ new: true } 
			  );

			let Counts = [];

			
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
