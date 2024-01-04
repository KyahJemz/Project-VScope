import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Inventory from "@/models/Inventory";
import { Data } from "@/models/Data";

export const GET = async (request) => {
  if (request.method === 'GET') {
    const url = new URL(request.url);
    const Department = url.searchParams.get("Department");

    if (!Department) {
      return new NextResponse("Missing Department", { status: 400 });
    }

    try {
      await connect();
      
      const results = await Inventory.find({Department: Department});

      if (!results) {
        return new NextResponse("Inventory not found", { status: 404 });
      }

      const ListOfPrescriptions = [];

      results.forEach((item) => {
        ListOfPrescriptions.push(item.Name);
      });

      Data.Prescriptions[Department] = ListOfPrescriptions;

      return new NextResponse(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      console.error(err);
      return new NextResponse("Database Error", { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};
