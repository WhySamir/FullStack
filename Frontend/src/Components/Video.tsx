const Video = () => {
  return (
    <>
      <div className="p-2 max-w-[500px]  relative flex  flex-col items-start justify-start">
        <div className="img w-fullrounded-lg h-[250px] mb-3">
          <img
            src="./MIcon.svg"
            className="object-cover rounded-lg"
            alt="No Imge"
          />
        </div>
        <div className="flex w-full h-full">
          <div className=" avatar  flex justify-center items-center  rounded-full overflow-hidden">
            <img src="./MIcon.svg" className="object-cover" alt="" />
          </div>
          <div className="text-white flex flex-col">
            <h3 className="text-sm font-semibold leading-tight line-clamp-2">
              Full Stack React Project ( AI Career Coach ) - Next JS, Tailwind,
              Gemini AI, Prisma, Shadcn...
            </h3>
            <p className="text-gray-400 text-xs">RoadsideCoder</p>
            <p className="text-gray-500 text-xs">9.4K views • 1 day ago</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Video;
