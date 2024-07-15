import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { toast } from "@/components/ui/use-toast";
import {QuestionFilters } from "@/constant/filter";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";

export default async function Collection({searchParams} : any) {
  const {userId} = auth();
  if(!userId) {
    return toast({title : "Please log in",
      description: "You must be logged in to perform this action"
    })
  } ;
  const result = await getSavedQuestions({
    clerkId : userId,
    searchQuery : searchParams.q,
    filter : searchParams.filter,
    page :  searchParams?.page ? +searchParams.page : 1
  });
  return (
    <>
        <h1 className="h1-bold text-dark100_light900">Saved Question</h1>
      
      <div className="mt-11 flex flex-row justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeHolder="Search for Questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          containerClasses="min-h-[56px] sm:min-w-[160px] flex "
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question : any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes.length}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no saved question to show"
            description="  Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
          />
        )}
      </div>
      <div className="mt-8">

        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result?.isNext}
        />
      </div>
    </>
  );
}
