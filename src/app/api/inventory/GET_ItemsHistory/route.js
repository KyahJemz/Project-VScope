import { NextResponse } from "next/server";
import InventoryHistory from "@/models/InventoryHistory";
import { Data } from "@/models/Data";
import connect from "@/utils/db";

export const GET = async (request) => {
  if (request.method === 'GET') {
    const url = new URL(request.url);
    const Department = url.searchParams.get("Department");

    if (!Department) {
      return new NextResponse("Missing Department", { status: 400 });
    }

    try {
      await connect();
      
      const results = await InventoryHistory.find({ Department: Department })
      .sort({ createdAt: -1 })
      .exec();

      if (!results) {
        return new NextResponse("InventoryHistory not found", { status: 404 });
      }

      const ListOfPrescriptions = [];

      results.forEach((item) => {
        ListOfPrescriptions.push(item.Name);
      });

      Data.Prescriptions[Department] = ListOfPrescriptions;

      return new NextResponse(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      console.error(err.message);
      return new NextResponse('Database Error:'+ err.message, { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};
