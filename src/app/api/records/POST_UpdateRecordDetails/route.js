import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";
import { encryptText, decryptText } from "@/utils/cryptojs";

export const POST = async (request) => {
  if (request.method === 'POST') {
    try {
      const body = await request.formData();

      const RecordId = body.get("RecordId");
      const Department = body.get("Department");
      const Key = body.get("Key");
      let Value = body.get("Value");

      let AppointmentModel;

      if (Department === 'Medical') {
        AppointmentModel = MedicalAppointment;
      } else if (Department === 'Dental') {
        AppointmentModel = DentalAppointment;
      } else if (Department === 'SDPC') {
        AppointmentModel = SDPCAppointment;
      }

      await connect();

      let updatedPost = null;

      if (Key === "Category" || Key === "GoogleEmail" || Key === "ServiceOffered") {
        updatedPost = await AppointmentModel.findByIdAndUpdate(
          RecordId,
          { [Key]: Value },
          { new: true } 
        );
      } else {
        const encryptedValue = encryptText(Value);
        updatedPost = await AppointmentModel.findOneAndUpdate(
          { _id: RecordId },
          { $set: { [`Details.${Key}`]: encryptedValue } },
          { new: true }
        );
      }
      
      if (!updatedPost) {
        return new NextResponse("Record not found", { status: 404 });
      }

      return new NextResponse("Success", { status: 200 });
    } catch (err) {
      console.error(err.message);
      return new NextResponse('Database Error:'+ err.message, { status: 500 });
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
};
