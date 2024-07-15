import Questions from "@/components/forms/Questions";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";

const page = async({params} : any) => {
  const {userId} = auth()
  if(!userId) return console.log("no user found")


    const mongoUser = await getUserById(userId)
   
  const result = await getQuestionById({questionId : params.id})
  // console.log(mongoUser,result)
  
  return (
    <div>
      <h1 className="h1-bold mb-8 text-dark100_light900">Edit<a href=""></a> Question</h1>
       <Questions 
        type = "Edit"
        mongoUserId={mongoUser._id}
        questionDetail = {JSON.stringify(result)}
        />
    </div>
  );
};

export default page;

