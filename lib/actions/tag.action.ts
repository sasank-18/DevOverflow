"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/database/tag.model";
import Question from "@/database/question.model";

export async function getTopPopularTags(){
  try{
   
    const popularTags = await Tag.aggregate([
      {
        $project :  {
          name : 1,
          questionCount: {
            $size : "$question"
          }
        }
      },
      {
        $sort: {
          questionCount: -1
        }
      },
      {
        $limit: 5
      }
    ]
    )
   
    return popularTags;
  }catch(e){
      console.log(e)
      throw e;
       }
}

export async function getTopInteractedTags(params:GetTopInteractedTagsParams){

    try{
     connectToDatabase();
      const {userId} = params

     const user = await User.findById({_id :userId});
     console.log(user)
   
     if(!user) throw new Error("user not found");

     // find the interaction and group by tags
      
     return [{_id: '1',name:'tags1'},{_id: '2',name:'tags2'}]

    }catch(e){

    }
}

export async function getAllTags(params : GetAllTagsParams){
    try{
        connectToDatabase();
        const {searchQuery, filter, page =1 , pageSize = 10} = params
        const query= searchQuery ? {
          $or : [
            {name : {$regex : searchQuery|| '', $options : 'i'}},
            {description : {$regex : searchQuery|| '', $options : 'i'}},
          ]
        } : {}

        let sortOptions = {}

        switch (filter) {
          case 'popular':
             sortOptions = {question : -1}
            break;
          case 'recent':
             sortOptions = {createdAt : 1}

            break;
          case 'name':
             sortOptions = {name : 1}

            break;
          case 'old':
             sortOptions = {createdAt : -1}

            break;
        
   
        }

        const tags =await Tag.find(query)
        .sort(sortOptions)
        .skip(pageSize * (page-1))
        .limit(pageSize)

       const totalTags = await Tag.countDocuments(query)
       const isNext = totalTags > pageSize*page
       console.log(totalTags)
        return {tags, isNext};
       }catch(e){
      console.log(e)
      throw e;
       }

}

export async function geQuestionByTagId(params : GetQuestionsByTagIdParams){
    try{
        connectToDatabase();
        // eslint-disable-next-line no-unused-vars
        const {tagId, page=1, pageSize =10, searchQuery} = params

        
   
    const tag = await Tag.findOne({ _id : tagId }).populate({
      path: "question",
      model: Question,
      match : searchQuery ? { title : {$regex : searchQuery, $options : 'i'}} : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });


    if(!tag) {
        throw new Error('tag not found')
    }
    
    const questions= tag.question;
    return {tagTitle : tag.name, questions};


       }catch(e){
      console.log(e)
      throw e;
       }

}