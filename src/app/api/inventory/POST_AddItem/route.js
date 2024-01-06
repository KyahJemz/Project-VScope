import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Inventory from "@/models/Inventory";

export const POST = async (request) => {
    if (request.method === 'POST') {
        const body = await request.formData();

        const Name = body.get("Name");
        const Count = body.get("Count");
        const Department = body.get("Department");

        if (!Name || !Count || !Department) {
            return new NextResponse("Empty", { status: 500 });
        } 

        try {
            await connect();

            const newInventory = new Inventory({
                Name,
                Count,
                Department,
            });

            await newInventory.save();

            return new NextResponse("Inventory has been created", { status: 201 });
        } catch (err) {
            console.error(err.message);
            return new NextResponse('Database Error:'+ err.message, { status: 500 });
        }
    } else {
        return new NextResponse("Method Not Allowed", { status: 405 });
    }
};
