"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/database/tag.model";

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
        const tags =await Tag.find({});
        return {tags};
       }catch(e){
      console.log(e)
      throw e;
       }

}