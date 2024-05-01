import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Accounts from "@/models/Accounts";
import { encryptText, decryptText } from "@/utils/cryptojs";
import { v4 as uuidv4 } from 'uuid';

export const POST = async (request) => {
	if (request.method === 'POST') {
		const body = await request.formData();

		const Department = body.get("Department");
		const GoogleEmail = body.get("GoogleEmail");
		const Id = body.get("Id")??null;
		const Status = body.get("Status");

		if (!Department || !GoogleEmail || !Status){
			return new NextResponse('Missing parameters', { status: 404 });
		}

		try {
			await connect();
			if(Id) {
				const result = await Accounts.findOne({ GoogleEmail: GoogleEmail });
				result.SicknessReport[Department] = result.SicknessReport[Department].map((item) => {
					if (item._id.toString() === Id.toString()) {
						item.Status = Status;
						return item;
					} else {
						return item;
					}
				});
				console.log(result.SicknessReport.Dental)
				await result.save();
				if (!result) {
					return new NextResponse('Failed to save', { status: 404 });
				}
				return new NextResponse('Success', { status: 200 });
			} else {
				const result = await Accounts.findOne({ GoogleEmail: GoogleEmail });
				result.SicknessReport[Department] = result.SicknessReport[Department].map((item) => {
					if (item.Status === "In Progress") {
						item.Status = Status;
						return item;
					} else {
						return item;
					}
				});
				await result.save();
				if (!result) {
					return new NextResponse('Failed to save', { status: 404 });
				}
				return new NextResponse('Success', { status: 200 });
			}
		} catch (err) {
			console.error(err.message);
			return new NextResponse('Database Error:'+ err.message, { status: 500 });
		}
	} else {
		return new NextResponse('Method Not Allowed', { status: 405 });
	}
};
