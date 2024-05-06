"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export async function getUserById(userId : any)
{
    try{
     connectToDatabase();
    

    //  const {userId} = params;

     const user  = await User.findOne({clerkId : userId});
      
     return user
    }

    catch(e){
    console.log(e)
    throw e;
    }
}

export async function createUser(userData : CreateUserParams)
{
    try{
     connectToDatabase();
     
     const newUser = await User.create({userData});
     return newUser;
    }

    catch(e){
    console.log(e)
    throw e;
    }
}
export async function updateUser(userParams : UpdateUserParams)
{
    try{
     connectToDatabase();
     const {clerkId, updateData, path} = userParams;
      
      await User.findOneAndUpdate(
        {clerkId},
         updateData,
         {new :true}
      )

    revalidatePath(path)

    }
    catch(e){
    console.log(e)
    throw e;
    }
}

export async function deleleUser(param : DeleteUserParams)
{
    try{
    const { clerkId } = param;

    const user = await  User.findOneAndDelete({clerkId})
    
    if(!user) throw new Error('User not found');

    // Delete user from database
    // and questions, answers, comments, etc.

    // get user Question Ids
    const userQuestionIds= await Question.find({author : user._id})
    .distinct("_id")
    
    // delete all the questions 
    await Question.deleteMany({author : user._id});

    
    // TODO: delete answers, comments, etc.

    return user;
    }
    catch(e){
    console.log(e)
    throw e;
    }
}