/* eslint-disable camelcase */
// post question
"use server";
import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";

export async function getHotQuestions() {
  try {
    connectToDatabase();

    const hotQuestions = await Question.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5);

    return hotQuestions;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();
    const { questionId, title, content, path } = params;

    const question = await Question.findById({ _id: questionId }).populate(
      "tags"
    );

    if (!question) {
      throw new Error("Question not found");
    }

    question.title = title;
    question.content = content;

    await question.save();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();

    // delete question and it related stf like ans tag and interaction ;
    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { question: questionId },
      { $pull: { question: questionId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();

    const { questionId } = params;
    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}





export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();
    const { searchQuery, filter , page =1, pageSize = 10 } = params;

    let sortOption = {};
    let filterQueryForUnAnswered = {};


    switch (filter) {
      case "newest":
        sortOption = { createdAt: -1 };
        break;

      case "recommended":
        sortOption = { views: -1 };

        break;
      case "frequent":
        sortOption = { views: -1 };

        break;
      case "unanswered":
        filterQueryForUnAnswered = { answers: { $size: 0 } };
        break;
    }

    const questions = await Question.find({
      $and: [
        {
          $or: [
            { title: { $regex: searchQuery || "", $options: "i" } },
            { content: { $regex: searchQuery || "", $options: "i" } },
          ],
        },
        filterQueryForUnAnswered,
      ]
    })
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort(sortOption)
      .skip(pageSize * (page-1))
      .limit(pageSize)

     const total_No_Of_Question = await Question.countDocuments({
      $and: [
        {
          $or: [
            { title: { $regex: searchQuery || "", $options: "i" } },
            { content: { $regex: searchQuery || "", $options: "i" } },
          ],
        },
        filterQueryForUnAnswered,
      ]
    })
      console.log(total_No_Of_Question)
     const isNext  = total_No_Of_Question > pageSize * page 
     console.log(pageSize * page)
     console.log(isNext)


    return { questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}




export async function createQuestion(params: CreateQuestionParams) {
  // eslint-disable-next-line no-empty
  try {
    connectToDatabase();

    const { title, content, tags, author, path } = params;

    const question = await Question.create({
      title,
      content,
      author,
    });
    const tagDocuments = [];

    for (const tag of tags) {
      const existingTags = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { question: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTags._id);
    }
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags:{ $each: tagDocuments } },
    });

    // creatre an interaction record for the user's ask_question action
     
    await Interaction.create({
      user : author, 
      action : "ask_question",
      question : question._id,
      tags : tagDocuments
    })
    
    
    // Increment author's reputation by +5 for creating a question
    await User.findByIdAndUpdate({_id : author}, {
        $inc: {reputation : 5}
    })

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}



export async function upVotesQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();
    const { questionId, userId, hasUpVoted, hasDownVoted, path } = params;

    let updateQuery = {};

    if (hasUpVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
      };
    } else if (hasDownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { upvotes: userId },
      };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // increment author's reputation by +!/-1 for upvoting/revoking an upvote to the question

    await User.findByIdAndUpdate(userId, {
      $inc :  {reputation : hasUpVoted ? -1 : 1}
    })

   // Increment author's reputation by +10/-10 for recieving an upvote/revoking an upvote to the question
   
   await User.findByIdAndUpdate(question.author, { 
    $inc :  {reputation : hasUpVoted ? -10 : 10}
   } )

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downVoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();
    const { questionId, userId, hasUpVoted, hasDownVoted, path } = params;

    let updateQuery = {};

    if (hasDownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
      };
    } else if (hasUpVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { downvotes: userId },
      };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // increment author's reputation;
  await User.findByIdAndUpdate(userId, {
      $inc :  {reputation : hasDownVoted ? -1 : 1}
    })

   // Increment author's reputation by +10/-10 for recieving an upvote/revoking an upvote to the question
   
   await User.findByIdAndUpdate(question.author, { 
    $inc :  {reputation : hasDownVoted ? -10 : 10}
   } )
    

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
