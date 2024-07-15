import { SearchParamsProps } from '@/types'
import { getUserAnswer } from '@/lib/actions/user.action';
import AnswerCard from '../cards/AnswerCard';
// import Pagination from './Pagination';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswersTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserAnswer({
    userId,
    page: 1,
  })

  console.log('and', result)
  

  return (
    <>
      {result.answers.map((item) => (
        <AnswerCard 
          key={item._id}
          clerkId={clerkId}
          _id={item._id}
          question={item.question}
          author={item.author}
          upvotes={item.upvotes.length}
          createdAt={item.createdAt}
        />  
      ))}
{/* 
      <div className="mt-10">
        <Pagination 
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNextAnswer}
        />
      </div> */}
    </>
  )
}

export default AnswersTab