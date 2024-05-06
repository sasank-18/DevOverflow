import Questions from "@/components/forms/Questions"
import { getUserById } from "@/lib/actions/user.action";
// import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async() => {
  // const {userId } = auth();
   
  const userId ='123456789'

  if(!userId) redirect('/sign-in')

  const mongoUser = await getUserById(userId);
   
  console.log(mongoUser)
  const data = JSON.stringify(mongoUser._id)
  console.log(JSON.parse(data))
  return (
    <div>
         <h1 className="h1-bold text-dark100_light900">Ask a Question</h1> 
      <div className="mt-9">
        <Questions mongoUserId = {JSON.stringify(mongoUser._id)}/>
      </div>
      </div>
  )
}

export default page