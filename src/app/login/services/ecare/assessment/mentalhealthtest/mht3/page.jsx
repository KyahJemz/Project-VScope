"use client"

import React, { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css"
import { useRouter } from "next/navigation";
import { AssessmentQuestions } from "@/models/AssessmentQuestions";
import { useSession } from "next-auth/react";

const shuffleArray = (array) => {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
};

const Page = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
	const [Role, setRole] = useState("");
  const [GoogleImage, setGoogleImage] = useState("");
  const [GoogleEmail, setGoogleEmail] = useState("");
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [answers, setAnswers] = useState([]);
  
  const [IsUploading, setIsUploading] = useState(false);

  const defaultDepartment = "SDPC"
  const defaultType = "Mental Health Test"
  const defaultSet = "Trauma-Related Disorders"

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      setRole(session.user.role);
      setGoogleImage(session.user.image);
      setGoogleEmail(session.user.email);
    }
  }, [status, session]);

  useEffect(() => {
    const originalQuestions = AssessmentQuestions[defaultDepartment][defaultType][defaultSet];
  
    const shuffled = shuffleArray(originalQuestions);
    setShuffledQuestions(shuffled);
    setShuffledAnswers(shuffleArray(Array.from({ length: shuffled.length }, (_, index) => String(index + 1))));
  }, [defaultDepartment, defaultType, defaultSet]);

  const handleAnswerChange = useCallback((index, value) => {
    const updatedAnswers = [...shuffledAnswers];
    updatedAnswers[index] = value;
    setShuffledAnswers(updatedAnswers);
  }, [shuffledAnswers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData();
    formData.append('GoogleEmail', GoogleEmail);
    formData.append('Department', defaultDepartment);
    formData.append('GoogleImage', GoogleImage);
    formData.append('Type', defaultType);
    formData.append('Set', defaultSet);
    formData.append('Questions', JSON.stringify(shuffledQuestions.map((question, index) => AssessmentQuestions[defaultDepartment][defaultType][defaultSet].indexOf(question)))); 
    formData.append('Answers', JSON.stringify(shuffledAnswers));
    try {
      const response = await fetch("/api/assessments/POST_AddAssessment", {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        router.push('/login/services/ecare/assessment/history/'+data._id)
        console.log('Ranking:', data);
      } else {
        console.error('Error:', response.statusText);
      }
      setIsUploading(false);
    } catch (error) {
      console.error('Fetch error:', error.message);
    }
    
  };

  return (
    <div className={styles.MainContainer}>
      <div className={styles.Header}>Mental Health Test - {defaultSet}</div>
      <div className={styles.Introduction}></div>
      <form className={styles.Questions} onSubmit={handleSubmit}>
        {shuffledQuestions.map((row, index) => (
          <div key={index} className={styles.QuestionContainer}>
            <p className={styles.Question}>{row.Question}</p>
            <div className={styles.Choices}>
              <label className={styles.RadioBtnContainer} htmlFor={`${index}_strongly_disagree`}>
                <input
                  type="radio"
                  name={index}
                  id={`${index}_strongly_disagree`}
                  value="1"  // "Strongly Disagree"
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className={styles.RadioBtn}
                  required
                  disabled={IsUploading}
                />
                Strongly Disagree
              </label>

              <label className={styles.RadioBtnContainer} htmlFor={`${index}_disagree`}>
                <input
                  type="radio"
                  id={`${index}_disagree`}
                  name={index}
                  value="2"  // "Disagree"
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className={styles.RadioBtn}
                  required
                  disabled={IsUploading}
                />
                Disagree
              </label>

              <label className={styles.RadioBtnContainer} htmlFor={`${index}_agree`}>
                <input
                  type="radio"
                  name={index}
                  id={`${index}_agree`}
                  value="4"  // "Agree"
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className={styles.RadioBtn}
                  required
                  disabled={IsUploading}
                />
                Agree
              </label>

              <label className={styles.RadioBtnContainer} htmlFor={`${index}_strongly_agree`}>
                <input
                  type="radio"
                  id={`${index}_strongly_agree`}
                  name={index}
                  value="5"  // "Strongly Agree"
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className={styles.RadioBtn}
                  required
                  disabled={IsUploading}
                />
                Strongly Agree
              </label>
            </div>
          </div>
        ))}
        <button className={styles.Submit} type="submit" disabled={IsUploading}>
          {IsUploading ? "Calculating Result..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Page;
