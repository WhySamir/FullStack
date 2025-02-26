import { ArrowDownIcon, Copy, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface setUploadPopupprops {
  videoURL: string | null;
  video: File;
  videoAttributes: any;
  setVideoAttributes: React.Dispatch<React.SetStateAction<any>>;
}

const Details: React.FC<setUploadPopupprops> = ({
  video,
  videoURL,
  videoAttributes,
  setVideoAttributes,
}) => {
  //for video

  //for playlist
  const [title2, setTitle2] = useState<string>("");
  const [description2, setDescription2] = useState("");
  const [playlistUI, setplaylistUI] = useState(false);
  const [createPlayist, setCreatePlayist] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuRef2 = useRef<HTMLDivElement | null>(null);

  const handleChange = (field: keyof typeof videoAttributes, value: any) => {
    setVideoAttributes((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected Thumbnail:", file.name); // ✅ Check if file is detected
      handleChange("thumbnail", file);
    }
  };

  const togglePlaylist = () => {
    setplaylistUI(!playlistUI);
  };
  const createPlaylist = () => {
    setCreatePlayist(!createPlayist);
  };
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
  //       setplaylistUI(false);
  //     }
  //     if (
  //       menuRef2.current &&
  //       !menuRef2.current.contains(event.target as Node)
  //     ) {
  //       setCreatePlayist(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [titleHeight, setTitleHeight] = useState<number>(30);
  const [descHeight, setDescHeight] = useState<number>(180);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const totalHeight = containerRef.current.clientHeight;
        setDescHeight(totalHeight * 0.6);
        setTitleHeight(totalHeight * 0.3);
        // setTitleHeight(`${totalHeight * 0.3}px`); for string if auto
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight); // Update on resize
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <>
      <div className="relative mb-3 mx-[3vw]">
        <h1 className="md:text-2xl font-bold text-white">Details</h1>
      </div>
      <div className="relative  grid grid-cols-8 mx-[3vw] gap-4 lg:gap-8 items-start overflow-scroll h-[46vh]">
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
                  <a
                    href={`${videoURL}`}
                    target="_blank"
                    className="text-sm text-blue-500 overflow-hidden text-ellipsis"
                  >
                    {videoURL}
                  </a>
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
        <div className="relative  col-span-4 sm:col-span-5 flex flex-col space-y-4 h-full">
          <div className="mb-4 relative">
            <textarea
              className="w-full  px-2 resize-none  leading-4 sm:pt-6 text-white/90 text-sm font-semibold border-1 border-white/50 rounded-lg hover:border-2 hover:border-white/80 focus:border-2 focus:border-white focus:outline-none"
              value={videoAttributes.title}
              onChange={(e) => handleChange("title", e.target.value)}
              maxLength={100}
              style={{
                height: `${Math.max(
                  Number(titleHeight),
                  videoAttributes.title.split("\n").length * 30
                )}px`,
              }}
            />

            <div className="absolute top-3  left-3 hidden sm:block  text-sm leading-1.5 font-medium sm:text-white pointer-events-none">
              Title (required)
            </div>
          </div>
          <div className="mb-4 relative">
            <textarea
              className="w-full px-2 resize-none pt-9 text-white/90 border-1 border-white/50 rounded-lg hover:border-2 hover:border-white/80 focus:border-2 focus:border-white focus:outline-none"
              value={videoAttributes.description}
              placeholder="Tell Viewers about your video."
              onChange={(e) => handleChange("description", e.target.value)}
              maxLength={5000}
              style={{
                height: `${Math.max(
                  Number(descHeight),
                  videoAttributes.description.split("\n").length * 30
                )}px`,
              }}
            />

            <div className="absolute top-3 text-sm sm:text-lg left-3 text-white pointer-events-none">
              Description (&copy;)
            </div>
          </div>

          <div className="ThumbnailSection flex flex-col text-white/90 space-y-3">
            Thumbnail
            <p className="text-sm">
              Set a thumbnail that stands out and draws viewers' attention.
            </p>
            <label className="items-center  flex-col flex justify-center border-dashed border border-white h-20  lg:w-40">
              <Upload />
              Upload file
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
          </div>
          <div className=" text-white/90 flex flex-col space-y-3">
            Playlists
            <p className="text-sm">
              Add your video to one or more playlists to organise your content
              for viewers.
            </p>
            <div className="flex items-center justify-start relative ">
              <button
                className="px-4  py-3 flex lg:w-[16vw] justify-between text-white border-1 border-white/50 rounded-lg  hover:border-2 focus:border-2 focus:border-white focus:outline-none"
                onClick={() => togglePlaylist()}
              >
                Select
                <div>
                  <ArrowDownIcon />
                </div>
              </button>
              {playlistUI && (
                <div
                  className="absolute -top-[35vh] lg:-top-[36vh]   xl:-top-[38vh] md:-top-[37vh]  left-0 bg-neutral-800 w-full lg:w-[25vw] z-30 h-[45vh] flex flex-col justify-between rounded-lg"
                  ref={menuRef}
                >
                  <p className="text-center text-sm lg:text-lg text-white py-3">
                    {" "}
                    No playlists available
                  </p>
                  <div>
                    <hr />
                    <div className="flex flex-col sm:flex-row justify-between m-3">
                      <button
                        onClick={() => createPlaylist()}
                        className="px-2 my-2 text-[12px] sm:text-lg  py-1 flex justify-between items-center text-white rounded-2xl  bg-neutral-700 hover:bg-neutral-500  focus:outline-none"
                      >
                        Create Playlists
                        <div className="ml-1">
                          <ArrowDownIcon />
                        </div>
                      </button>
                      <button
                        onClick={() => setplaylistUI(false)}
                        className="px-2  my-2 text-sm lg:text-lg  py-1 flex justify-between items-center text-white rounded-2xl  bg-neutral-700 hover:bg-neutral-500  focus:outline-none"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {createPlayist && (
                <div
                  className="fixed  inset-0 sm:m-auto my-auto bg-neutral-800 w-[96vw] mx-1 lg:w-[70vw]  z-50 h-[80vh]  flex flex-col justify-between  rounded-lg"
                  ref={menuRef2}
                >
                  <div className=" border-b-1 border-neutral-500 flex  justify-between  items-start  px-3 sm:px-6 pt-[17.5px] ">
                    <div className="flex items-end">
                      <div className="  text-white text-sm sm:text-lg font-semibold  ">
                        Create a new playlist
                      </div>
                    </div>
                    <button
                      className="sm:mb-3 h-6 w-6 sm:w-8 sm:h-8  items-center rounded-full hover:bg-neutral-500  text-white   sm:text-lg"
                      onClick={() => setCreatePlayist(false)}
                    >
                      X
                    </button>
                  </div>
                  <div className="flex flex-col ">
                    <div className="mb-4 relative mx-6 overflow-scroll">
                      <textarea
                        className="w-full px-2 resize-none pt-9  text-white border-1 border-white/50 rounded-lg hover:border-2 focus:border-2 focus:border-white focus:outline-none  min-h-[12vh]"
                        value={title2}
                        placeholder="Add title"
                        onChange={(e) => setTitle2(e.target.value)}
                        maxLength={100}
                        style={{
                          height: `${Math.max(
                            60,
                            title2.split("\n").length * 36
                          )}px`,
                        }}
                      />

                      <div className="absolute font-medium top-3 left-3 text-white/80 pointer-events-none">
                        Title (required)
                      </div>
                    </div>
                    <div className="mb-4 relative mx-6 overflow-scroll">
                      <textarea
                        className="w-full px-2 resize-none pt-9  text-white border-1 border-white/50 rounded-lg hover:border-2 focus:border-2 focus:border-white focus:outline-none min-h-[14vh]"
                        value={description2}
                        placeholder=" Tell Viewers about your video."
                        onChange={(e) => setDescription2(e.target.value)}
                        maxLength={5000}
                        style={{
                          height: `${Math.max(
                            180,
                            description2.split("\n").length * 36
                          )}px`,
                        }}
                      />

                      <div className="absolute top-3 left-3 text-white/80 pointer-events-none">
                        Description (&copy;)
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setCreatePlayist(false)}
                    className="px-4 mb-3  lg:w-[5vw]  py-2 flex justify-center mx-auto  text-white rounded-2xl  bg-neutral-700 hover:bg-neutral-500  focus:outline-none"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;

{
  /* <textarea
                className="w-full  overflow-hidden resize-none  px-2 pt-6 text-white/90  text-sm font-semibold   py-6 border-1 border-white/50  rounded-lg hover:border-2 hover:border-white/80 focus:border-2  focus:border-white focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                readOnly
                style={{
                  height: ${Math.max(90, title.split("\n").length * 30)}px,
                }}
              /> 
              <textarea
                className="w-full px-2 h-full resize-none pt-9  text-white/90 border-1 border-white/50 rounded-lg hover:border-2 hover:border-white/80 focus:border-2 focus:border-white focus:outline-none "
                value={description}
                placeholder=" Tell Viewers about your video."
                onChange={(e) => setDescription(e.target.value)}
                maxLength={5000}
                style={{
                  height: ${Math.max(
                    180,
                    description.split("\n").length * 30
                  )}px,
                }}
              />

*/
}
