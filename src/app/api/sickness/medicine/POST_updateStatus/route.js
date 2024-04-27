import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicineRequests from "@/models/MedicineRequests";
import InventoryHistory from "@/models/InventoryHistory";
import Inventory from "@/models/Inventory";
import { encryptText, decryptText } from "@/utils/cryptojs";
import { v4 as uuidv4 } from 'uuid';

export const POST = async (request) => {
	if (request.method === 'POST') {
		const body = await request.formData();

		const Id = body.get("Id");
		const Medicine = await JSON.parse(body?.get("Medicine")??[]);
		const Status = body.get("Status");

		try {
			await connect();
		
			if (Status === "approve") {
				const record = await MedicineRequests.findById(Id);
				record.Status = "Approved";
				record.Counts = Medicine && Medicine.map(item => item.count);
				await record.save();
			  
				await Promise.all(
				  Medicine.map(async element => {
					if (element.itemId !== "") {
					  const countToSubtract = parseInt(element.count);
					  if (!isNaN(countToSubtract) && countToSubtract > 0) {
						let updatedInventory = await Inventory.findByIdAndUpdate(
						  element.itemId,
						  { $inc: { Count: -countToSubtract } },
						  { new: true, runValidators: true }
						);
						if (updatedInventory && updatedInventory.Count < 0) {
						  updatedInventory = await Inventory.findByIdAndUpdate(
							element.itemId,
							{ $set: { Count: 0 } },
							{ new: true }
						  );
						}
						const newInventoryHistory = new InventoryHistory({
						  Name: record.Name,
						  GoogleEmail: record.GoogleEmail,
						  Count: parseInt(element?.count??0),
						  ItemName: `${element.name}`,
						  Notes: record.Concern,
						  Department: record.Department,
						});
						await newInventoryHistory.save();
					  } else {
						console.error(`Invalid count value for element with itemId ${element.itemId}`);
					  }
					}
				  })
				);
			  } else {
				const record = await MedicineRequests.findById(Id);
				record.Status = "Rejected";
				await record.save();
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
