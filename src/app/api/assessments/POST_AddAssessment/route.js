import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Assessments from "@/models/Assessments";
import { AssessmentQuestions } from "@/models/AssessmentQuestions";

export const POST = async (request) => {
    if (request.method === 'POST') {
      const body = await request.formData();
  
      const GoogleEmail = body.get("GoogleEmail");
      const Department = body.get("Department");
      const GoogleImage = body.get("GoogleImage");
      const Type = body.get("Type");
      const Set = body.get("Set");
      let Questions = body.get("Questions");
      let Answers = body.get("Answers");
  
      Questions = JSON.parse(Questions).map(value => Number(value));
      Answers = JSON.parse(Answers).map(value => Number(value));
  
      if (!GoogleEmail || !Department || !GoogleImage || !Type || !Set || !Questions || !Answers) {
        return new NextResponse("Empty", { status: 500 });
      }
  
      const MainResult = {};
      const SubResult = {};
  
      for (let index = 0; index < Questions.length; index++) {
        let MainResultLabel = AssessmentQuestions[Department][Type][Set][Questions[index]]["MainCategory"];
        let SubResultLabel = AssessmentQuestions[Department][Type][Set][Questions[index]]["SubCategory"];
  
        MainResult[MainResultLabel] = (MainResult[MainResultLabel] ?? 0) + (1 * Answers[index]);
        SubResult[SubResultLabel] = (SubResult[SubResultLabel] ?? 0) + (1 * Answers[index]);
      }

      const Ranking = [];
  
      const SubResultArray = Object.entries(SubResult).map(([category, score]) => ({ category, score }));
  
      SubResultArray.sort((a, b) => b.score - a.score);

      for (const { category, score } of SubResultArray) {
        const foundQuestion = AssessmentQuestions[Department]?.[Type]?.[Set]?.find(question => question["SubCategory"] === category);
    
        if (foundQuestion) {
            const MainResultLabel = foundQuestion["MainCategory"];
            const SubResultLabel = foundQuestion["SubCategory"];
    
            Ranking.push({
                SubCategory: SubResultLabel,
                MainCategory: MainResultLabel,
                Result: score.toString(),
            });
        } else {
            console.error(`Question data not found for category ${category}`);
        }
    }
  
      try {
        await connect();
  
        const newAssessments = new Assessments({
            Department,
            GoogleEmail,
            GoogleImage,
            Type,
            Set,
            Ranking,
            Questions,
            Answers,
        });
  
        await newAssessments.save();
  
        return new NextResponse(JSON.stringify(newAssessments), { status: 201, headers: { 'Content-Type': 'application/json' } });
      } catch (err) {
        console.error(err.message);
        return new NextResponse('Database Error:' + err.message, { status: 500 });
      }
    } else {
      return new NextResponse("Method Not Allowed", { status: 405 });
    }
  };