export const SkeletonWatchVid = () => {
  return (
    <div className="mt-14 animate-pulse">
      <div className=" sm:mx-auto sm:max-w-[1400px] h-full sm:px-6 lg:px-8 text-white">
        <div className="flex flex-col lg:grid grid-cols-12 items-start">
          {/* Main video + info */}
          <div className="flex flex-col lg:col-span-8 lg:mr-6 w-full lg:w-auto">
            {/* Video Player */}
            <div className="sticky top-[3.42rem] sm:top-[3.48rem] z-10  lg:static aspect-video bg-neutral-800 sm:rounded-xl overflow-hidden shadow-2xl" />

            {/* Title and owner info */}
            <div className="pl-1 w-full pr-1 mt-3 caret-transparent">
              <div className="w-full  px-2.5 xs:px-3 sm:px-0">
                {/* Title */}
                <div className="h-6 bg-neutral-700 rounded w-full  mb-3" />

                {/* Owner section */}
                <div className="mt-3 flex items-start justify-between">
                  {/* Avatar and Name */}
                  <div className="flex items-start sm:gap-2 justify-between">
                    <div className="flex gap-2 items-center">
                      <div className="sm:w-10 sm:h-10 w-8 h-8 rounded-full bg-neutral-700" />
                      <div className="space-y-1">
                        <div className="h-4 bg-neutral-700 rounded w-24" />
                        <div className="h-3 bg-neutral-700 rounded w-16" />
                      </div>
                    </div>
                  </div>

                  {/* Subscribe/Edit buttons */}
                  <div className="sm:flex-grow flex justify-end md:ml-[2.5vw] mr-1 lg:mr-0    lg:ml-3 space-x-2">
                    <div className="h-9 w-24 bg-neutral-700 rounded-full" />
                    <div className="h-9 w-24 bg-neutral-700 rounded-full hidden sm:block" />
                  </div>
                </div>

                {/* Like/Dislike/Share/Download */}
                <div className="flex mt-4 gap-2 xs:gap-0 xs:justify-normal xs:space-x-6 sm:space-x-2">
                  <div className="flex space-x-2">
                    <div className="w-20 xs:w-30 md:w-34 h-9 bg-neutral-700 rounded-full" />
                    <div className="h-9 w-24 bg-neutral-700 rounded-full" />
                    <div className="h-9 w-24 bg-neutral-700 rounded-full" />
                    <div className="hidden sm:block h-9 w-24 bg-neutral-700 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mx-1 xs:mx-3 sm:mr-1 mt-3 p-4 bg-[#242828] rounded-lg space-y-3 ">
              <div className="flex space-x-3">
                <div className="h-4 bg-neutral-700 rounded w-24" />
                <div className="h-4 bg-neutral-700 rounded w-20" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-neutral-700 rounded w-5/6" />
                <div className="h-4 bg-neutral-700 rounded w-2/3" />
              </div>
            </div>

            {/* Comments for small screen */}
            <div className="px-2 xs:px-4 sm:px-0 sm:hidden lg:block w-full sm:mb-8 mt-6">
              <div className="h-64 bg-neutral-800 rounded-xl" />
            </div>
          </div>

          {/* Comments for medium screen */}
          <div className="px-2 xs:px-4 sm:px-0 hidden sm:block lg:hidden w-full  sm:mb-8 mt-6">
            <div className="h-64 bg-neutral-800 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
