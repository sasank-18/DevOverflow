/* eslint-disable no-unused-vars */
"use server"

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { AnswerVoteParams, CreateAnswerParams, DeleteAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";
import Interaction from "@/database/interaction.model";



export async function deleteAnswer(params : DeleteAnswerParams){
  try {
      connectToDatabase();

      // delete question and it related stf like ans tag and interaction ;
      const {answerId, path} = params

      await Answer.deleteOne({_id : answerId})
      await Question.updateMany({answers: answerId}, 
        {$pull : {answers : answerId}}
      )
      await Interaction.deleteMany({answer : answerId})

      revalidatePath(path);
      
  } catch (error) {
    console.log(error);
    throw error;
  }
}


export async function createAnswer(params: CreateAnswerParams)
{

    try {
      connectToDatabase();
     const{content, author, question,path} = params;
    //  new answer would the save the data we have to do it explicitly
     const newAnswer = new Answer({
        author,
        content,
        question
      });
      
     const questionObject =  await  Question.findByIdAndUpdate(question,
       {$push : {answers : newAnswer._id}}
      )

      await newAnswer.save();

      // TODO: Add interaction;

      await Interaction.create({
        user : author,
        action : "answer",
        question , 
        answer : newAnswer._id,
        tags : questionObject.tags
      })

     await User.findByIdAndUpdate(author, {
      $inc : {reputation  :10}
     })



    revalidatePath(path);
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getAnswers(params: GetAnswersParams)
{

    try {
      connectToDatabase();
      
     const  {questionId, page, sortBy} = params
 

     let sortOptions = {}

     switch (sortBy) {
      case 'highestUpvotes':
        sortOptions = {upvotes : -1}
        break;
      case 'lowestUpvotes':
        sortOptions = {upvotes : 1}

        break;
      case 'recent':
        sortOptions = {createdAt : -1}

        break;
      case 'old':
        sortOptions = {createdAt : 1}
        break;
     
      default:
        break;
     }

     const answer = await Answer.find({question : questionId})
     .populate({path: 'author',model : User, select: '_id clerkId name picture'})
     .sort(sortOptions);

     return {answer};
    } catch (error) {
        console.log(error)
        throw error
    }
}


export async function upVoteAnswer(params : 
  AnswerVoteParams ){


  try {
    connectToDatabase();
    const{ answerId,
      userId,
      hasUpVoted,
      hasDownVoted,
      path,} = params

      console.log("answer",answerId)
      console.log("answer",userId)

      let updateData = {}

      if(hasUpVoted){

        updateData = {
          $pull : {upvotes : userId}
        }

      }else if(hasDownVoted){
        updateData =  { 
          $pull : {downvotes : userId},
          $push : {upvotes : userId}
        }
      }else{
        updateData =  { 
          $addToSet : {upvotes : userId}
        }
      }

      const answer = await Answer.findByIdAndUpdate(answerId, updateData, {new : true})

      if(!answer) console.log("Answer Not found")


        // increment author reputation
        await User.findByIdAndUpdate(userId, {
          $inc: {reputation : hasUpVoted ? -2 : 2}
        })
        await User.findByIdAndUpdate(answer.author, {
          $inc : {reputation : hasUpVoted ? -10: 10}
        })

     
        revalidatePath(path);

  } catch (error) {
      console.log(error)
      throw error
  }

}


export async function downVoteAnswer(params : 
  AnswerVoteParams ){


  try {
    connectToDatabase();
    const{ answerId,
      userId,
      hasUpVoted,
      hasDownVoted,
      path,} = params


   

      let updateData = {}

      if(hasDownVoted){

        updateData = {
          $pull : {downvotes : userId}
        }

      }else if(hasUpVoted){
        updateData =  { 
          $push : {downvotes : userId},
          $pull : {upvotes : userId}
        }
      }else{
        updateData =  { 
          $addToSet : {downvotes : userId}
        }
      }

      const answer = await Answer.findByIdAndUpdate(answerId, updateData, {new : true})

      if(!answer) console.log("Answer Not found")


           // increment author reputation
           await User.findByIdAndUpdate(userId, {
            $inc: {reputation : hasDownVoted ? -2 : 2}
          })
          await User.findByIdAndUpdate(answer.author, {
            $inc : {reputation : hasDownVoted ? -10: 10}
          })
     


        revalidatePath(path);

  } catch (error) {
      console.log(error)
      throw error
  }

}