import { NextResponse } from "next/server";
import connect from "@/utils/db";
import MedicalAppointment from "@/models/MedicalAppointment";
import DentalAppointment from "@/models/DentalAppointment";
import SDPCAppointment from "@/models/SDPCAppointment";
import Accounts from "@/models/Accounts";
import { encryptText, decryptText } from "@/utils/cryptojs";

const decryptFields = (obj) => {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }
  
    if (Array.isArray(obj)) {
      return obj.map((item) => decryptFields(item));
    }
  
    const decryptedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          decryptedObj[key] = decryptFields(obj[key]);
        } else {
          decryptedObj[key] = decryptText(obj[key]);
        }
      }
    }
    return decryptedObj;
  };

  async function UpdateStatus(Model) {
    try {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const appointmentsToUpdate = await Model.updateMany(
        { Status: 'Approved', updatedAt: { $lt: twoDaysAgo } },
        { $set: { Status: 'Canceled' } }
      );
  
      return true;
    } catch (error) {
      return false;
    }
  }
  
  export const GET = async (request) => {
    const url = new URL(request.url);
    const GoogleEmail = url.searchParams.get("GoogleEmail");
    const Department = url.searchParams.get("Department");
  
    try {
      await connect();
  
      let results = null;
  
      if (GoogleEmail === "" || GoogleEmail === null) {
        if (Department === 'Medical') {
          await UpdateStatus(MedicalAppointment);
          results = await MedicalAppointment.find();
        } else if (Department === 'Dental') {
          await UpdateStatus(DentalAppointment);
          results = await DentalAppointment.find();
        } else if (Department === 'SDPC') {
          await UpdateStatus(SDPCAppointment);
          results = await SDPCAppointment.find();
        }
      } else {
        if (Department === 'Medical') {
          await UpdateStatus(MedicalAppointment);
          results = await MedicalAppointment.find(GoogleEmail && { GoogleEmail });
        } else if (Department === 'Dental') {
          await UpdateStatus(DentalAppointment);
          results = await DentalAppointment.find(GoogleEmail && { GoogleEmail });
        } else if (Department === 'SDPC') {
          await UpdateStatus(SDPCAppointment);
          results = await SDPCAppointment.find(GoogleEmail && { GoogleEmail });
        }
      }
  
      if (results) {
      
        const topLevelFieldsToDecrypt = ["Name", "Id", "Consern", "GoogleImage"];
  
        results = results.map((result) => {
          const decryptedResult = { ...result._doc };

          topLevelFieldsToDecrypt.forEach((field) => {
            decryptedResult[field] = decryptText(result._doc[field]);
          });
  
          if (result._doc.Details && Object.keys(result._doc.Details).length > 0) {
            decryptedResult.Details = decryptFields(result._doc.Details);
          }
  
          if (result._doc.Responses && result._doc.Responses.length > 0) {
                const decryptedResponses = result._doc.Responses.map(response => {
                    const decryptedResponse = {
                        Name: decryptText(response.Name),
                        GoogleEmail: decryptText(response.GoogleEmail),
                        Response: decryptText(response.Response),
                        Timestamp: decryptText(response.Timestamp),
                        ViewedByDepartment: response.ViewedByDepartment,
                        ViewedByClient: response.ViewedByClient
                    };
                return decryptedResponse;
            });
            decryptedResult.Responses = decryptedResponses;
          }

          return decryptedResult;
        });
      }
  
      return new NextResponse(JSON.stringify(results), { status: 200 });
    } catch (err) {
      return new NextResponse("Database Error" + err, { status: 500 });
    }
  };

export const POST = async (request) => {
    if (request.method === 'POST') {
        const body = await request.formData();

        const Name = encryptText(body.get("Name"));
        const Id = encryptText(body.get("Id"));
        const Category = body.get("Category");
        const Consern = encryptText(body.get("Consern"));
        const Department = body.get("Department");
        const Status = 'Pending';
        const GoogleEmail = body.get("GoogleEmail");
        const AccountId = await Accounts.findOne({GoogleEmail: GoogleEmail });
        console.log(AccountId);
        const Account_Id = AccountId._id;
        const GoogleImage = AccountId.GoogleImage;

        

        if (GoogleEmail === "" || GoogleEmail === null) {
            return [];
        }

        try {
            await connect();

            let newPost = null;

            if (Department === 'Medical'){
                newPost = new MedicalAppointment({
                    Name,
                    Id,
                    Category,
                    Consern,
                    Department,
                    Status,
                    Account_Id,
                    GoogleEmail,
                    GoogleImage,
                });
            } else if (Department === 'Dental') {
                newPost = new DentalAppointment({
                    Name,
                    Id,
                    Category,
                    Consern,
                    Department,
                    Status,
                    Account_Id,
                    GoogleEmail,
                    GoogleImage,
                });
            } else if (Department === 'SDPC') {
                newPost = new SDPCAppointment({
                    Name,
                    Id,
                    Category,
                    Consern,
                    Department,
                    Status,
                    Account_Id,
                    GoogleEmail,
                    GoogleImage,
                });
            }
            
            await newPost.save();
            console.log(newPost);

            return new NextResponse("Success", { status: 201 });
        } catch (err) {
            return new NextResponse("Database Error", { status: 500 });
        }
    } else {
        return new NextResponse("Method Not Allowed", { status: 405 });
    }
};
