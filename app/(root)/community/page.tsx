import UserCard from "@/components/cards/UserCard";
import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { UserFilters } from "@/constant/filter";
import { getAllUser } from "@/lib/actions/user.action";
import Link from "next/link";

export default async function Community({ searchParams }: any) {
  const result = await getAllUser({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page :  searchParams?.page ? +searchParams.page : 1
  });
  return (
    <>
      <div className=" flex w-full flex-col-reverse items-center justify-between gap-4 sm:flex-row">
        <h1 className="h1-bold text-dark100_light900">All Users</h1>
      </div>
      <div className="mt-11 flex flex-row justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/community"
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

      <section className="mt-12 flex flex-wrap gap-4">
        {result.users.length > 0 ? (
          result.users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            No users yet {"  "}
            <Link href="/sign-up" className="mt-1 font-bold text-accent-blue">
              Join to be the first
            </Link>
          </div>
        )}
      </section>

      <div className="mt-8">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result?.isNext}
        />
      </div>
    </>
  );
}
