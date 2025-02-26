import Stepper from "./Stepper/Stepper";

interface setUploadPopupprops {
  setUploadPopup: React.Dispatch<React.SetStateAction<boolean>>;
  videoURL: string | null;
  video: File;
}

const StepperforvideoUpload: React.FC<setUploadPopupprops> = ({
  setUploadPopup,
  video,
  videoURL,
}) => {
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-50 ">
        <div className="flex  flex-col space-y-1 justify-between items-start bg-neutral-700 rounded-lg shadow-lg mx-8 lg:mx-0 lg:w-[70vw] h-[80vh] max-w-full relative">
          <div className=" border-b-1 border-neutral-500 flex  justify-between  items-start  px-3 sm:px-6 pt-4 w-full">
            <div className=" flex">
              {video && (
                <>
                  <div className="w-[80vw] lg:w-[62vw]  tracking-tight  overflow-hidden  text-white text-sm sm:text-lg font-semibold whitespace-nowrap text-ellipsis ">
                    {/* {video.name.slice(0, 99)} */}
                    {video.name}
                  </div>
                </>
              )}
            </div>
            <button
              className="sm:mb-3 h-6 w-6 sm:w-8 sm:h-8  items-center rounded-full hover:bg-neutral-500  text-white   sm:text-lg"
              onClick={() => setUploadPopup(false)}
            >
              X
            </button>
          </div>
          <Stepper video={video} videoURL={videoURL} />
        </div>
      </div>
    </>
  );
};

export default StepperforvideoUpload;
