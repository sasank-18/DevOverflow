import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import RenderTag from "../shared/RenderTag";
import { getTopInteractedTags } from "@/lib/actions/tag.action";

interface props {
  user: {
    _id:string;
    clerkId:string;
    name:string;
    picture:string;
    username:string;
  };
}

const UserCard = async({ user }: props) => {
   const interactedTags = await getTopInteractedTags({userId: user._id})

   return (
    <Link
      className="w-full rounded-2xl shadow shadow-slate-100 dark:shadow-none max-xs:min-w-full xs:w-[260px]"
      href={`/profile/${user.clerkId}`}
    >
      <div className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={user.picture}
          alt="user profile picture"
          width={100}
          height={100}
          className="size-20 rounded-full object-cover "
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>
        <div> 
          {interactedTags!.length > 0 ? (
            <div className="mt-2 flex  items-center gap-2">
              {interactedTags!.map((tag)=>(
                <RenderTag
                key = {tag._id}
                _id = {tag._id}
                name={tag.name}
                />
                
              ))}
            </div>
            
          ): (
            <Badge>
              No tags yet
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
};

export default UserCard;
