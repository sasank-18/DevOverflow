import Image from "next/image";
import Link from "next/link";
import darkimage from "../../public/assets/images/dark-illustration.png";
import { Button } from "../ui/button";

interface Props {
  title: string;
  description: string;
  link: string;
}

const NoResult = ({ title, description, link }: Props) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center">
      <Image
        src="/assets/images/light-illustration.png"
        alt="NO result Illustration"
        width={270}
        height={270}
        className="block object-contain dark:hidden"
      />
      <Image
        src={darkimage}
        alt="NO result Illustration"
        width={270}
        height={200}
        className=" hidden object-contain dark:flex"
      />

      <h2 className="h2-bold text-dark200_light900 mt-8">{title} </h2>
      <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
        {description}
      </p>
      <Link href={link}>
        <Button className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 text-light-900 ">
          Ask a Questioin
        </Button>
      </Link>
    </div>
  );
};

export default NoResult;
