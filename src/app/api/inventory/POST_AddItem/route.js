import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Inventory from "@/models/Inventory";
import InventoryHistory from "@/models/InventoryHistory";

export const POST = async (request) => {
    if (request.method === 'POST') {
        const body = await request.formData();

        const Name = body.get("Name");
        const Department = body.get("Department");
        let ItemCount = parseInt(body.get("Count"));
        if (isNaN(ItemCount)) {
            return new NextResponse("Invalid Count", { status: 400 });
        }

        if (!Name || !ItemCount || !Department) { 
            return new NextResponse("Empty", { status: 500 });
        } 

        try {
            await connect();
            console.log("---TEST---", Name)
            let existingInventory = await Inventory.findOne({ Name: Name });
            console.log("---TEST---", existingInventory)
            if (existingInventory) {
                existingInventory.Count += ItemCount;
                await existingInventory.save();

                const newInventoryHistory = new InventoryHistory({
                    Name: Department + " - ReStock",
                    GoogleEmail: "",
                    Count: ItemCount,
                    ItemName: Name,
                    Notes: "",
                    Department,
                  });
                await newInventoryHistory.save();

                return new NextResponse("Inventory count has been updated", { status: 200 });
            } else {
                const newInventory = new Inventory({
                    Name,
                    Count: ItemCount < 0 ? 0 : ItemCount, 
                    Department,
                });

                const newInventoryHistory = new InventoryHistory({
                    Name: Department + " - Added new item",
                    GoogleEmail: "",
                    Count: ItemCount,
                    ItemName: Name,
                    Notes: "",
                    Department,
                  });
                  await newInventoryHistory.save();

                await newInventory.save();
                return new NextResponse("New inventory item has been created", { status: 201 });
            }
            
        } catch (err) {
            console.error(err.message);
            return new NextResponse('Database Error:'+ err.message, { status: 500 });
        }
    } else {
        return new NextResponse("Method Not Allowed", { status: 405 });
    }
};
