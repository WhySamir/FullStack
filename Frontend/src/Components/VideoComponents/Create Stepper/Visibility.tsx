import { Copy } from "lucide-react";
import { useRef, useEffect, useState } from "react";

interface setUploadPopupprops {
  videoURL: string | null;
  video: File;
}

const Visibility: React.FC<setUploadPopupprops> = ({ video, videoURL }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const containerRef2 = useRef<HTMLDivElement | null>(null);
  const optareaRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(180);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const descAreaRef = useRef<HTMLTextAreaElement>(null);
  const [descHeight, setDescHeight] = useState<number>(180);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current && optareaRef.current) {
        const height = containerRef.current.clientHeight;
        setContainerHeight(height);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight); // Update on resize

    return () => window.removeEventListener("resize", updateHeight);
  }, []);
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef2.current) {
        const height2 = containerRef2.current.clientHeight;
        setDescHeight(height2 * 0.6);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight); // Update on resize

    return () => window.removeEventListener("resize", updateHeight);
  }, []);
  useEffect(() => {
    const adjustTitleHeight = () => {
      if (descAreaRef.current) {
        descAreaRef.current.style.height = "auto";
        const newHeight = Math.max(
          descHeight,
          descAreaRef.current.scrollHeight
        );
        descAreaRef.current.style.height = `${newHeight}px`;
      }
    };

    adjustTitleHeight();
  }, [description, descHeight]);

  return (
    <>
      <div className="relative  mx-[3vw]">
        <h1 className="mb-1 md:text-2xl font-bold text-white">Visibility</h1>
      </div>
      <div className="relative grid grid-cols-8 mx-[3vw] gap-4 lg:gap-8 items-start overflow-y-scroll  h-[46vh]">
        <div
          ref={containerRef}
          className="videoRightCol col-span-4 order-2 sm:col-span-3 sticky top-0 "
        >
          <div className="items-center rounded-lg bg-neutral-800 h-full">
            {videoURL && (
              <video className="sm:w-full h-full" controls>
                <source src={videoURL} type={video?.type} />
                Your browser does not support the video tag.
              </video>
            )}
            <div className="mt-3 p-3 relative">
              <div className="flex flex-col whitespace-nowrap">
                <p className="leading-4 text-[12px]">Video link</p>
                <div className="flex items-center space-x-8 justify-between">
                  <p className="text-sm text-blue-500 overflow-hidden text-ellipsis">
                    {videoURL}
                  </p>
                  <div className="-mt-4">
                    <Copy size={30} />
                  </div>
                </div>
              </div>
              <div className="mt-3 text-[14px] whitespace-nowrap flex flex-col">
                File Name
                <div className="overflow-hidden text-ellipsis text-white font-semibold">
                  {video?.name}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative col-span-4 sm:col-span-5 flex flex-col space-y-4 h-full">
          <div className="mb-2 sm:mb-4 relative">
            <div
              ref={optareaRef}
              className="w-full flex flex-col resize-none px-1 sm:px-4 pt-1 sm:pt-3 text-white/90 text-sm font-semibold py-6 border-1 border-white/50 rounded-lg hover:border-2 hover:border-white/80 focus:border-2 focus:border-white focus:outline-none"
              style={{
                height: containerHeight,
              }}
            >
              <div className="text-white font-semibold "> Save or publish</div>
              <p className="text-white/70 font-normal text-xs md:text-sm">
                Make your video public, unlisted, or private
              </p>
              <div className="space-y-2 mt-2">
                {[
                  {
                    value: "private",
                    label: "Private",
                    desc: "Only  you  can watch your video",
                  },
                  {
                    value: "unlisted",
                    label: "Unlisted",
                    desc: "Anyone with the video link can watch your video",
                  },
                  {
                    value: "public",
                    label: "Public",
                    desc: "Everyone can watch your video",
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-start   space-x-3 p-2 rounded-lg cursor-pointer "
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value={option.value}
                      checked={selectedOption === option.value}
                      onChange={() => setSelectedOption(option.value)}
                      className="mt-1  sm:w-5 sm:h-5 accent-blue-500"
                    />
                    <div>
                      <p className="text-xs sm:text-sm font-medium">
                        {option.label}
                      </p>
                      <p className="md:block hidden text-gray-400 text-sm max-w-full whitespace-nowrap">
                        {option.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4 relative" ref={containerRef2}>
            <textarea
              ref={descAreaRef}
              value={description}
              className="w-full px-2  resize-none pt-9  text-white/90 border-1 border-white/50 rounded-lg hover:border-2 hover:border-white/80 focus:border-2 focus:border-white focus:outline-none "
              placeholder=" Tell Viewers about your video."
              onChange={(e) => setDescription(e.target.value)}
              maxLength={5000}
              style={{
                height: `${Math.max(
                  150,
                  description.split("\n").length * 30
                )}px`,
              }}
            />

            <div className="absolute top-3 text-sm sm:text-lg left-3 text-white pointer-events-none">
              Description (&copy;)
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Visibility;
