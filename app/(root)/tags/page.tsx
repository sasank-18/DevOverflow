import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { UserFilters } from "@/constant/filter";
import { getAllTags } from "@/lib/actions/tag.action";
import Link from "next/link";

export default async function Tag() {
  const result = await getAllTags({});
  console.log("result", result);
  return (
    <>
      <div className=" flex w-full flex-col-reverse items-center justify-between gap-4 sm:flex-row">
        <h1 className="h1-bold text-dark100_light900">All tags</h1>
      </div>
      <div className="mt-11 flex flex-row justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeHolder="Search amazing minds here..."
          otherClasses="flex-1"
        />
        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px]  sm:min-w-[160px]"
        />
      </div>

      <section className="mt-12 flex  flex-wrap gap-4">
        {result.tags.length > 0 ? (
          result.tags.map((tag) => (
            <Link key={tag._id} href={`/tags/${tag._id}`} className="shadow-md">
              <div className="background-light900_dark200 light-border flex  min-w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
                  <p className="paragraph-semibold text-dark300_light900">
                    {tag.name}
                  </p>
                </div>
                <p className="small-medium text-dark400_light500 mt-3.5">
                  <span className="body-semibold primary-text-gradient mr-2.5">
                    {tag.question.length}+ questions
                  </span>
                </p>
              </div>
            </Link>
          ))
        ) : (
          <NoResult
            title="No Tags found"
            description="it looks like there are no tags found."
            link="/ask-question"
          />
        )}
      </section>
    </>
  );
}
