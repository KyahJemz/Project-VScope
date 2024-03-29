import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Inventory from "@/models/Inventory";
import InventoryHistory from "@/models/InventoryHistory";

export const POST = async (request) => {
  if (request.method === 'POST') {
    const formData = await request.formData(); 

    const Name = formData.get("Name");
    const Email = formData.get("Email");
    const Notes = formData.get("Notes");
    const Count = formData.get("Count");
    const ItemName = formData.get("ItemName");
    const Department = formData.get("Department");
    const Action = formData.get("Action");
    const Id = formData.get("Id");

    if (!Department || !Action || !Id) {
      return new NextResponse("Empty", { status: 500 });
    } 

    try {
      await connect();
      
      let updatedInventory = null;
      switch (Action) {
        case "Give":
          updatedInventory = await Inventory.findByIdAndUpdate(
            Id,
            { $inc: { Count: -Count } },
            { new: true, runValidators: true }
          );
          if (updatedInventory && updatedInventory.Count < 0) {
            updatedInventory = await Inventory.findByIdAndUpdate(
              Id,
              { $set: { Count: 0 } },
              { new: true }
            );
          }
          const newInventoryHistory = new InventoryHistory({
            Name,
            GoogleEmail: Email,
            Count,
            ItemName,
            Notes,
            Department,
          });
          await newInventoryHistory.save();
          break;

        case "Remove":
          updatedInventory = await Inventory.findByIdAndDelete(Id);

          const newInventoryHistorys = new InventoryHistory({
            Name: Department + " - Cleared",
            GoogleEmail: "",
            Count: "0",
            ItemName,
            Notes: "",
            Department,
          });
          await newInventoryHistorys.save();

          break;
      
        default:
          return new NextResponse("Invalid Action", { status: 500 });
          break;
      }

      if (!updatedInventory) {
        return new NextResponse("Inventory not found", { status: 404 });
      }

      return new NextResponse("Inventory has been updated", { status: 200 });
    } catch (err) {
      console.error(err.message);
      return new NextResponse('Database Error:'+ err.message, { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};
