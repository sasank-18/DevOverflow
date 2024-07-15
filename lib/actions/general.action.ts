"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";

export async function GlobalSearch(params: SearchParams) {
  try {
    connectToDatabase();
    const { query, type } = params;

    let result = [];

    const modelsAndType = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: Tag, searchField: "name", type: "tags" },
    ];

    const availableType = ["question", "user", "answer", "tags"];
    const typeLower = type?.toLowerCase();

    if (typeLower && availableType?.includes(typeLower)) {
      // search with specific type
      
      const modelInfo = modelsAndType.find((item) => item.type === type);

      if (!modelInfo) {
        throw new Error("Invalid type");
      }

      const queryResults = await modelInfo.model
        .find({
          [modelInfo.searchField]: { $regex: query, $options: "i" },
        })
        .limit(8);

      result = queryResults.map((item) => ({
        type,
        title:
          type === "question"
            ? item.title
            : type === "answer"
              ? `Answers containing ${query}`
              : item.name,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
              ? item.question
              : item._id,
      }));

      console.log('resultlung',result)
    } else {
      // search across everything
      for (const { model, searchField, type } of modelsAndType) {
        const queryResults = await model
          .find({
            [searchField]: { $regex: query, $options: "i" },
          })
          .limit(2);
     
         result.push(...queryResults.map((item)=>(
            {
              type,
              title:
                type === "question"
                  ? item.title
                  : type === "answer"
                    ? `Answers containing ${query}`
                    : item.name,
              id:
                type === "user"
                  ? item.clerkId
                  : type === "answer"
                    ? item.question
                    : item._id,
            }
         ))) 
      } 
      console.log('resultlg',result)

    }

    console.log('foma;',result)

  return JSON.stringify(result)

  } catch (error) {
    console.error(error);
    throw error;
  }
}
