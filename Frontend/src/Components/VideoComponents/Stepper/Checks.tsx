import { Check } from "lucide-react";

const Checks = () => {
  return (
    <>
      <div className="relative  flex flex-col mx-[3vw] space-y-4 lg:space-y-5 items-start  ">
        <div className="relative text-white">
          <h1 className="md:text-2xl font-bold  mb-2">Checks</h1>
          <p className="text-xs sm:text-sm">
            We'll check your video for issues that may restrict its visibility
            and then you will have the opportunity to fix issues before
            publishing your video. Learn more
          </p>
        </div>
        <div className="relative text-white w-full">
          <h1 className="text-sm mb-2  font-bold">Copyright</h1>
          <div className="flex justify-between">
            No issues found
            <Check color="#2B983D" />
          </div>
        </div>
        <hr className="text-white/30 w-full" />
        <div className="text-sm mb-[15vh]">
          Remember: These check results aren't final. Issues may come up in the
          future that impact your video. Learn more
        </div>
      </div>
    </>
  );
};

export default Checks;
