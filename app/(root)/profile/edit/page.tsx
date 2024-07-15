import Profile from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";

const page = async() => {
  const {userId} = auth()
  if(!userId) return console.log("no user found")


    const mongoUser = await getUserById(userId)
   
  
  return (
    <div>
      <h1 className="h1-bold mb-8 text-dark100_light900">Edit<a href=""></a> Profile</h1>
       <Profile
        clerkId={userId}
        user = {JSON.stringify(mongoUser)}
        />
    </div>
  );
};

export default page;

