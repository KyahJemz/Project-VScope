import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";

export const POST = async (request) => {
    if (request.method === 'POST') {
        const body = await request.formData();

        const Name = body.get("aName");
        const Id = body.get("aId");
        const Category = body.get("aCategory");
        const Consern = body.get("aConsern");
        const Department = body.get("aDepartment");
        const GoogleEmail = body.get("GoogleEmail");
        const Status = 'Pending';

        try {
            await connect();

            let newPost = null;

            if (Department === 'Medical'){
                    MedicalAppointment.findByIdAndUpdate(
                        docId,
                            { $set: { 'Details.newProperty': 'Some value' } },
                            { new: true },
                            (error, updatedDocument) => {
                            if (error) {
                            console.error('Error updating document:', error);
                          } else {
                            console.log('Document updated:', updatedDocument);
                          }
                        }
                    );
            } else if (aDepartment === 'Dental') {
              
            } else if (aDepartment === 'SDPC') {
                
            }

            await newPost.save();

            return new NextResponse("Post has been created", { status: 201 });
        } catch (err) {
            return new NextResponse("Database Error", { status: 500 });
        }
    } else {
        return new NextResponse("Method Not Allowed", { status: 405 });
    }
};
