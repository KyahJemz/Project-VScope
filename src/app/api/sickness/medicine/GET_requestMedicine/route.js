import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicineRequests from "@/models/MedicineRequests";

export const GET = async (request) => {
	const url = new URL(request.url);

	const GoogleEmail = url.searchParams?.get("GoogleEmail")??null;
	const Department = url.searchParams?.get("Department")??null;

	try {
		await connect();

		let results = null;

		if(GoogleEmail && Department){
			results = await MedicineRequests.find({Department, GoogleEmail}).sort({ createdAt: -1 }).exec();
		} 

		if(Department){
			results = await MedicineRequests.aggregate([
                { $match: { Department } },
                { $sort: { updatedAt: -1 } }
            ]).exec();
		} 

		if (results){
			return new NextResponse(JSON.stringify(results), { status: 200 });
		} else {
			return new NextResponse(JSON.stringify([]), { status: 200 });
		}
	} catch (err) {
		console.error(err.message);
		return new NextResponse('Database Error:'+ err.message, { status: 500 });
	}
};
