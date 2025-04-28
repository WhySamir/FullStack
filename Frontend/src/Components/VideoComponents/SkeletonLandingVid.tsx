const SkeletonLandingVid = () => {
  return (
    <div className="pb-3  sm:p-2 w-full  flex flex-col items-start">
      <div className="relative  w-full  sm:rounded-lg mb-2 aspect-video  skeleton "></div>
      <div className=" pl-2 flex  gap-x-2.5 items-start w-full  ">
        <div className="h-9 w-9 rounded-full   skeleton" />
        <div className="flex flex-col flex-grow gap-y-2">
          <div className={`h-4  skeleton rounded-md`} />
          <div className="h-3 w-1/2 skeleton rounded-md" />
          <div className="h-3 w-1/3 skeleton rounded-md" />
        </div>
      </div>
    </div>
  );
};
export default SkeletonLandingVid;
