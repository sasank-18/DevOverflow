"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";






export async function getAllUser(params : GetAllUsersParams){
        try{
         connectToDatabase();
        //  const {page =1 , pageSize = 20 , filter, searchQuery} = params
         const users  = await User.find({})
         .sort({createdAt : -1});
        
         return {users}
        }
    
        catch(e){
        console.log(e)
        throw e;
        }
}

export async function getUserById(userId : string)
{
    try{
     connectToDatabase();
    

    //  const {userId} = params;
    console.log(userId);

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
     console.log('kutta',userData)
     const newUser = await User.create(userData);
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
    // const userQuestionIds= await Question.find({author : user._id})
    // .distinct("_id")
    
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