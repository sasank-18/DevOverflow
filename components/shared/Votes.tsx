"use client";

import { downVoteAnswer, upVoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
  downVoteQuestion,
  upVotesQuestion,
} from "@/lib/actions/question.action";
import { ToggleSaveQuestion } from "@/lib/actions/user.action";
import { formatAndDivideNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "../ui/use-toast";

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasUpVoted: boolean;
  downvotes: number;
  hasDownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasUpVoted,
  downvotes,
  hasDownVoted,
  hasSaved,
}: Props) => {

  const pathname = usePathname();
  const router = useRouter();
  const handleSave = async ()=>{
    if(!userId) {
      return toast({title : "Please log in",
        description: "You must be logged in to perform this action"
      })
    }
    try{
      await ToggleSaveQuestion({
        questionId : JSON.parse(itemId),
        userId : JSON.parse(userId),
        path : pathname
      })
    }catch(error){
      console.log(error);
      throw error
    }

    return toast({title : `Question ${!hasSaved ?'Saved in':'Removed from'} your collection`,
      variant : !hasUpVoted ? 'default' : 'destructive'
  })
  
  }

  const handleVote = async (action: string) => {
    if (!userId) {
      return toast({title : "Please log in",
        description: "You must be logged in to perform this action"
      })
    }
  
  
    if (action === "upvote") {
      if (type === "Question") {
        await upVotesQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await upVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
      }
      // todo: show a toast
      return  toast({title : `Upvote ${!hasUpVoted ?'Successfully':'Removed'}`,
        variant : !hasUpVoted ? 'default' : 'destructive'
    })
    }

    if (action === "downvote") {
      if (type === "Question") {
        await downVoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await downVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
      }
      return  toast({title : `Downvote ${!hasUpVoted ?'Successfully':'Removed'}`,
        variant : !hasUpVoted ? 'default' : 'destructive'
    })  
    }
  };
 

    useEffect(()=>{
      viewQuestion({
        questionId: JSON.parse(itemId),          
        userId: userId ?  JSON.parse(userId) : undefined,
      })

    }, [itemId, userId, pathname, router])

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasUpVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote("upvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(upvotes)}
            </p>
          </div>
        </div>

        <div className="flex-center gap-1.5">
          <Image
            src={
              hasDownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => handleVote("downvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>

      {type === "Question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
