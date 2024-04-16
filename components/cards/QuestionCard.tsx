import Link from "next/link";
import React from "react";

interface QuestionProps {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  upvotes: number;
  views: number;
  answers: Array<object>;
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
}: QuestionProps) => {
  return (
    <div className="card-wrapper  rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex h-4 sm:hidden">
            {String(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold line-clamp-2 flex-1">
              {title}
            </h3>
          </Link>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default QuestionCard;
