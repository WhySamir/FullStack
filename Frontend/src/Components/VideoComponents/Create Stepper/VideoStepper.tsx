const VideoStepp = () => {
  return (
    <>
      <div className="relative  flex flex-col  w-full     mx-[3vw] space-y-4 lg:space-y-5 items-start  px-6">
        <div className="mx-2 w-full ">
          <h1 className="md:text-2xl font-bold  text-white">Video elements</h1>
          <p className="text-xs sm:text-sm whitespace-normal lg:whitespace-nowrap">
            Use cards and an end screen to show viewers related videos, websites
            and calls to action(Coming soon).
          </p>
        </div>

        <div className=" flex   items-end w-full lg:w-192  space-x-2 sm:space-x-0 justify-between  bg-[#1F1F1F]/50 rounded-lg  py-2 md:py-3 ">
          <div className="icon items-center flex md:space-x-8 space-x-4">
            <div className="pl-1 sm:pl-4"> &copy;</div>
            <div className="text flex flex-col   text-white">
              <h1>Add subtitles</h1>
              <p className="text-xs sm:text-sm text-white/70">
                Reach a broader audience by adding subtitles to your video
              </p>
            </div>
          </div>

          <button className="mr-1 px-3 sm:px-4 h-9    text-sm font-bold   text-white rounded-3xl  bg-neutral-500 hover:bg-neutral-500  ">
            <p className="text-sm">Add</p>
          </button>
        </div>
        <div className="flex   items-end  w-full lg:w-192   space-x-2 sm:space-x-0 justify-between bg-[#1F1F1F]/50 rounded-lg py-2 md:py-3 ">
          <div className="icon items-center flex md:space-x-8 space-x-4">
            <div className="pl-1 sm:pl-4"> &copy;</div>
            <div className="text flex flex-col   text-white">
              <h1>Add subtitles</h1>
              <p className="text-xs sm:text-sm text-white/70">
                Reach a broader audience by adding subtitles to your video
              </p>
            </div>
          </div>

          <button className="mr-1 px-3 sm:px-4 h-9    text-sm font-bold   text-white rounded-3xl  bg-neutral-500 hover:bg-neutral-500  ">
            <p className="text-sm">Add</p>
          </button>
        </div>
        <div className="flex   items-end  w-full lg:w-192  space-x-2 sm:space-x-0 justify-between bg-[#1F1F1F]/50 rounded-lg py-2 md:py-3 ">
          <div className="icon items-center flex md:space-x-8 space-x-4">
            <div className="pl-1 sm:pl-4"> &copy;</div>
            <div className="text flex flex-col   text-white">
              <h1>Add subtitles</h1>
              <p className="text-xs sm:text-sm text-white/70">
                Reach a broader audience by adding subtitles to your video
              </p>
            </div>
          </div>

          <button className="mr-1 px-3 sm:px-4 h-9    text-sm font-bold   text-white rounded-3xl  bg-neutral-500 hover:bg-neutral-500  ">
            <p className="text-sm">Add</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default VideoStepp;
