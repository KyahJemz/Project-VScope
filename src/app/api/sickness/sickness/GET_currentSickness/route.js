import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Accounts from "@/models/Accounts";
import { encryptText, decryptText } from "@/utils/cryptojs";


export const GET = async (request) => {
	const url = new URL(request.url);

	const Department = url.searchParams.get("Department");

	try {
		await connect();
		const accounts = await Accounts.find();

		let accountsSicknessReport = [];
		
		if (accounts) {
			accounts.forEach((account) => {
				if (account?.SicknessReport?.[Department]) {
					accountsSicknessReport.push(...account.SicknessReport[Department]);
				}
			});

			accountsSicknessReport.sort((a, b) => {
				return new Date(b.updatedAt) - new Date(a.updatedAt);
			});
		}

		return new NextResponse(JSON.stringify(accountsSicknessReport), { status: 200 });
	} catch (err) {
		console.error(err.message);
		return new NextResponse('Database Error:'+ err.message, { status: 500 });
	}
};
