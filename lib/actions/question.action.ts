// post question 
'use server'
import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose"
import Tag from "@/database/tag.model";
import { CreateQuestionParams, GetQuestionByIdParams, GetQuestionsParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";


export async function getQuestionById(params: GetQuestionByIdParams){
    try{

   connectToDatabase();
   
   const {questionId} = params
   const question = await Question.findById(questionId)
   .populate({path : 'tags', model:Tag , select : '_id name'})
   .populate({path: 'author', model:User, select : '_id clerkId name picture'})

   return question;
    }catch(error){
        console.log(error)
        throw error;
    }
}

export async function getQuestions(params: GetQuestionsParams){
    try{
        connectToDatabase();
        
       const questions=  await Question.find({})
        .populate({path: 'tags', model : Tag})
        .populate({path:'author', model: User})
        .sort({createdAt:-1})

        return {questions}
    }catch(error){
           console.log(error)
           throw error
    }
}
 export async function createQuestion(params:CreateQuestionParams){
    // eslint-disable-next-line no-empty
    try{
        connectToDatabase();

        const {title, content,tags, author,path } = params

        const question =await Question.create({
            title,
            content,
            author
        })
        console.log('question',question)
        const tagDocuments = []

        for(const tag of tags){
            const existingTags = await Tag.findOneAndUpdate(
                {name : {$regex : new RegExp(`^${tag}$`, "i")}},
                {$setOnInsert : {name : tag}, $push : {question : question._id}},
                {upsert: true, new:true}
            )
          
            tagDocuments.push(existingTags._id);
           
        }
      await Question.findByIdAndUpdate(question._id, {
            $push : {tags : {$each : tagDocuments}}
        } )

     revalidatePath(path);


    }catch(error){
     console.log(error)
     throw error
    }
}