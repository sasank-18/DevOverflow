/* eslint-disable no-unused-vars */
"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Answer from "@/database/answer.model";




export async function getUserQuestion(params: GetUserStatsParams) {
  try {
    connectToDatabase();
     
    const {userId} = params;
    
    const totalQuestions = await Question.countDocuments({author : userId});


    const userQuestion = await  Question.find({author: userId})
    .populate('tags', '_id name')
    .populate('author', '_id clerkId name picture')
    .sort({createdAt : -1, views: -1, upvotes : -1})


    return {totalQuestions, questions : userQuestion}
  } catch (e) {
    console.log(e);
    throw e;
  }
}


export async function getUserAnswer(params: GetUserStatsParams) {
  try {
    connectToDatabase();
     
    const {userId} = params;
    
    const totalAnswers = await Answer.countDocuments({author : userId});
    
    const userAnswer = await  Answer.find({author: userId})
    .populate('question', '_id title')
    .populate('author', '_id clerkId name picture')
    .sort({upvotes : -1})


    return {totalAnswers, answers : userAnswer}
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();
     
    const {userId} = params;
   
    const user = await User.findOne({clerkId : userId})
    console.log('user',user)
    const totalQuestions = await Question.countDocuments({author : user._id});
    const totalAnswers = await Answer.countDocuments({author: user._id});


    if(!user){
      throw new Error('User not found')
    }
 


    return {user, totalQuestions, totalAnswers}
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();

    // eslint-disable-next-line no-unused-vars
    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

    const query:FilterQuery<typeof Question> = searchQuery
    ? {title : {$regex : new RegExp(searchQuery, 'i')}}
    : {};

    let sortOption = {}

    switch (filter) {
      case "most_voted":
        sortOption = {upvotes :-1}
        break;
      case "most_recent":
        sortOption = {createdAt :-1}

        break;
      case "oldest":
        sortOption = {createdAt :1}

        break;
      case "most_viewed":
        sortOption = {views :-1}
        break;
      case "most_answered": 
      sortOption = {answers :-1}
        break;
      
      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      model: Question,
      match : query,
      options: {
        sort: sortOption,
        skip :pageSize * (page-1),
        limit : pageSize
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });


    const isNext = user.saved.length + 1 > pageSize

     console.log(isNext)
    if(!user) {
        throw new Error('User not found')
    }
    
    const savedQuestion = user.saved;
    return {questions : savedQuestion, isNext};

  } catch (e) {
    console.log(e);
    throw e;
  }
}


export async function ToggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, userId, path } = params;

    const user = await User.findById(userId);

    const isSavedQuestion = user.saved.includes(questionId);

    if (isSavedQuestion) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getAllUser(params: GetAllUsersParams) {
  try {
    connectToDatabase();
     const {page =1 , pageSize = 10 , filter, searchQuery} = params

     const searchUser = searchQuery ? {
      $or : [
         {name  : {$regex : searchQuery || "", $options : 'i' }},
         {username  : {$regex : searchQuery || "", $options : 'i' }}
      ]
     } : {};

     let filterQuery = {}
     switch (filter) {
      case "new_users":
        filterQuery = {joinedAt : -1}
        break;
        case "old_users":
          filterQuery = {joinedAt : 1}
          break;
        case "top_contributors":
          filterQuery = {reputation : -1}
          break;
      default:
        break;
     }

    const users = await User.find(searchUser)
    .sort(filterQuery)
    .skip(pageSize * (page-1))
    .limit(pageSize)
    
    const totalNoOfUser = await User.countDocuments(searchUser);
    const isNext = totalNoOfUser > pageSize * page

    return { users , isNext};
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function getUserById(userId: string) {
  try {
    connectToDatabase();


    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();
    console.log("kutta", userData);
    const newUser = await User.create(userData);
    return newUser;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
export async function updateUser(userParams: UpdateUserParams) {
  try {
    connectToDatabase();
    const { clerkId, updateData, path } = userParams;

    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

    revalidatePath(path);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function deleleUser(param: DeleteUserParams) {
  try {
    const { clerkId } = param;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) throw new Error("User not found");

    // Delete user from database
    // and questions, answers, comments, etc.

    // get user Question Ids
    // const userQuestionIds= await Question.find({author : user._id})
    // .distinct("_id")

    // delete all the questions
    await Question.deleteMany({ author: user._id });

    // TODO: delete answers, comments, etc.

    return user;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
