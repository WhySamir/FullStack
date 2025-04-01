import { EllipsisVertical, Share2, UserCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";

const ChannelProfile = () => {
  const { userName } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [tab, setTab] = useState<Number>(0);
  const handleTab = (idx: Number) => {
    setTab(idx);
  };
  return (
    <>
      <div className="mt-12   text-white py-4 ">
        {/* Profile Section */}
        <div className="flex  space-x-3 items-center px-3 sm:pl-16">
          <UserCircle className="h-22 w-22  sm:h-40 sm:w-40 " />
          <div className="flex flex-col items-start sm:w-full ">
            <h2 className="text-xl sm:text-3xl lg:text-4xl  font-bold">
              L Lawliet
            </h2>
            <div className="flex flex-col items-start sm:flex-row sm:space-x-2">
              <p className="text-sm ">@WhyLaw16</p>
              <p className="text-sm text-gray-400">1 subscriber • 1 video</p>
            </div>
            <div className="hidden sm:block">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex text-xs py-2 px-6 sm:px-0 cursor-pointer"
              >
                <p className="text-gray-400 sm:text-sm">
                  More about this channel{" "}
                  <span className="text-white">...more</span>{" "}
                </p>
              </button>
              <div className="mt-3 sm:mt-0 px-3 sm:px-0 flex-grow  flex space-x-2 justify-start w-full sm:w-full">
                <button
                  //   onClick={() => handleSubscribe(video._id)}
                  className="overflow-hidden whitespace-nowrap text-ellipsis text-sm font-medium cursor-pointer h-9   w-1/2 sm:w-auto  justify-center items-center  px-3 py-1    rounded-[2.5rem] flex bg-[#222222] hover:bg-[#333333] "
                >
                  <span className=" w-full overflow-hidden whitespace-nowrap text-ellipsis">
                    Customize Channel
                  </span>
                </button>
                <button
                  //   onClick={() => handleSubscribe(video._id)}
                  className="overflow-hidden whitespace-nowrap text-ellipsis text-sm font-medium cursor-pointer h-9   w-1/2 sm:w-auto  justify-center items-center  px-3 py-1    rounded-[2.5rem] flex bg-[#222222] hover:bg-[#333333] "
                >
                  <span className=" w-full overflow-hidden whitespace-nowrap text-ellipsis">
                    Manage videos
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="block sm:hidden">
          <div className="flex text-xs py-2 px-6 sm:px-0">
            <p className="text-gray-400">
              More about this channel{" "}
              <span className="text-white">...more</span>{" "}
            </p>
          </div>
          <div className="mt-3 sm:mt-0 px-3 sm:px-0 flex-grow  flex space-x-2 justify-start w-full sm:w-full">
            <button
              //   onClick={() => handleSubscribe(video._id)}
              className="overflow-hidden whitespace-nowrap text-ellipsis text-sm font-medium cursor-pointer h-9   w-1/2 sm:w-auto  justify-center items-center  px-3 py-1    rounded-[2.5rem] flex bg-[#222222] hover:bg-[#333333] "
            >
              <span className=" w-full overflow-hidden whitespace-nowrap text-ellipsis">
                Customize Channel
              </span>
            </button>
            <button
              //   onClick={() => handleSubscribe(video._id)}
              className="overflow-hidden whitespace-nowrap text-ellipsis text-sm font-medium cursor-pointer h-9   w-1/2 sm:w-auto  justify-center items-center  px-3 py-1    rounded-[2.5rem] flex bg-[#222222] hover:bg-[#333333] "
            >
              <span className=" w-full overflow-hidden whitespace-nowrap text-ellipsis">
                Manage videos
              </span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 sm:pl-16 flex justify-evenly sm:justify-start  space-x-8 border-b border-gray-700 mt-4 ">
          <button
            onClick={() => handleTab(0)}
            className={`pb-2 ${
              tab === 0 ? "border-b-2" : "text-gray-400"
            } border-white`}
          >
            Videos
          </button>
          <button
            onClick={() => handleTab(1)}
            className={`pb-2 ${
              tab === 1 ? "border-b-2" : "text-gray-400"
            } border-white`}
          >
            Playlists
          </button>
          <button
            onClick={() => handleTab(2)}
            className={`pb-2 ${
              tab === 2 ? "border-b-2" : "text-gray-400"
            } border-white`}
          >
            Posts
          </button>
          <button
            onClick={() => handleTab(3)}
            className={`pb-2 ${
              tab === 3 ? "border-b-2" : "text-gray-400"
            } border-white`}
          >
            Search
          </button>
        </div>

        {/* Video List */}
        <div className="mt-4 sm:mt-6 px-3 sm:pl-16">
          <div className="flex sm:flex-col space-x-3 w-full sm:w-80 sm:space-y-2">
            <div className=" aspect-video sm:w-80 sm:h-40 h-21  bg-gray-700 rounded-md"></div>
            <div className=" flex   justify-between sm:w-auto ">
              <div className=" flex flex-col  ">
                <h3 className="text-sm font-semibold">Ninja Fight</h3>
                <p className="text-xs text-gray-400">2 views • 23 hours ago</p>
              </div>
              <div className="py-2 h-5 w-5 items-center">
                <EllipsisVertical />
              </div>{" "}
            </div>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 z-10 flex justify-center items-center  bg-opacity-50">
            <div className="bg-neutral-700 p-5 rounded-lg w-80 sm:w-96">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">About</h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="text-gray-400 hover:text-white" />
                </button>
              </div>

              <div className="mt-3 space-y-5 text-sm text-gray-200 font-semibold">
                <h1 className="text-xl font-semibold text-white ">
                  Channel Details
                </h1>
                <p>
                  🌐{" "}
                  <a className="pl-2" href="https://www.youtube.com/@WhyLaw16">
                    www.youtube.com/@WhyLaw16
                  </a>
                </p>
                <p>
                  📅<span className="pl-2"> Joined: 14 Sept 2017</span>
                </p>
                <p>
                  👤<span className="pl-2"> 1 subscriber</span>
                </p>
                <p>
                  📹<span className="pl-2"> 1 video </span>
                </p>
                <p>
                  👀<span className="pl-2"> 1 view </span>
                </p>
              </div>
              <button
                //   onClick={() => handleSubscribe(video._id)}
                className="mt-6 flex  space-x-1.5 overflow-hidden whitespace-nowrap text-ellipsis text-sm font-medium cursor-pointer h-9   w-1/2 sm:w-auto  justify-center items-center  px-3 py-1    rounded-[2.5rem]  bg-neutral-600 hover:bg-[#333333] "
              >
                <Share2 />
                <span className="font-semibold w-full overflow-hidden whitespace-nowrap text-ellipsis">
                  Share Channel
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChannelProfile;
