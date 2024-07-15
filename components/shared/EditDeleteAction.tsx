"use client";

import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const EditDeleteAction = ({
  itemId,
  type,
}: {
  itemId: string;
  type: string;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const handleEdit = () => {
    router.push(`/question/edit/${itemId}`)
  };

  const handleDelete = async (type: string) => {
    console.log(type);
    console.log("itemId", itemId);
    if (type === "Question") {
      await deleteQuestion({ questionId: itemId, path: pathname });
    } else if (type === "Answer") {
      await deleteAnswer({ answerId: itemId, path: pathname });
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === "Question" && (
        <Image
          src="/assets/icons/edit.svg"
          alt="Edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}

      <Image
        src="/assets/icons/trash.svg"
        alt="Delete"
        width={14}
        height={14}
        className="cursor-pointer object-contain"
        onClick={() => handleDelete(type)}
      />
    </div>
  );
};

export default EditDeleteAction;
