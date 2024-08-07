import HomeFilter from "@/components/Home/HomeFilter";
import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constant/filter";
import { getQuestions } from "@/lib/actions/question.action";
import Link from "next/link";

export default async function Home({searchParams} : any) {
  const result = await getQuestions({
    searchQuery : searchParams.q,
    filter : searchParams.filter,
    page : searchParams?.page ? +searchParams.page : 1
  });

  return (
    <>
      <div className=" flex w-full flex-col-reverse items-center justify-between gap-4 sm:flex-row">
        <h1 className="h1-bold text-dark100_light900">All Question</h1>
        <Link className="flex justify-end max-sm:w-full" href="/ask-question">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 text-sm text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex flex-row justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeHolder="Search for Questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          containerClasses="hidden max-md:flex"
          otherClasses="min-h-[56px]  sm:min-w-[160px]"
        />
      </div>
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
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
            title="There's no question to show"
            description="  Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
          />
        )}

        <div className=" mt-8">
          <Pagination
          pageNumber = {searchParams?.page  ? +searchParams.page : 1}
          isNext = {result?.isNext}/>
        </div>
      </div>
    </>
  );
}
