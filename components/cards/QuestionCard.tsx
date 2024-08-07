import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { formatAndDivideNumber, getTimeStamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

interface QuestionProps {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    clerkId?: string;
    name: string;
    picture: string;
  };
  upvotes: number;
  views: number;
  answers: Array<object>;
  clerkId? : string | null;
  createdAt: Date;
}

const QuestionCard = ({
  _id,
  title,
  createdAt,
  tags,
  upvotes,
  author,
  views,
  answers,
  clerkId
}: QuestionProps) => {

  const showActionButton = clerkId && clerkId === author.clerkId;


  return (
    <div className="card-wrapper rounded-[10px] border border-primary-100 p-9  shadow-sm dark:border-none sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex h-4 sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link className="cursor-pointer" href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-2 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        {/* if signed in add edit delete actions */}

      <SignedIn>
        {showActionButton &&
       <EditDeleteAction itemId = {_id} type = "Question"/>
      }
      </SignedIn>
        
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>
      <div className="flex-between  mt-6 w-full flex-wrap  gap-3">
        <Metric
          imgUrl={author?.picture}
          alt="user"
          value={author.name}
          title={`- asked ${getTimeStamp(createdAt)}`}
          href={`/profile/${author._id}`}
          isAuthor
          textStyle="body-medium text-dark400_light800"
        />

        <div className="flex justify-end  gap-3">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={formatAndDivideNumber(upvotes)}
            title="Votes"
            textStyle="small-medium text-dark400_light800"
          />

          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="answer"
            value={answers.length}
            title="Answers"
            textStyle="small-medium text-dark400_light800"
          />

          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="eye"
            value={formatAndDivideNumber(views)}
            title="Views"
            textStyle="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
