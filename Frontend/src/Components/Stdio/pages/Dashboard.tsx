import { Pencil, Upload } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="pl-6 pr-4">
      <div className="flex justify-between  items-center h-[12vh]">
        <h1 className="text-white font-semibold text-3xl">Channel dashboard</h1>
        <div className="items flex gap-3">
          <div className="h-9 px-2 w-9 items-center flex justify-center rounded-full border border-neutral-100">
            <Upload />
          </div>
          <div className="h-9 px-2 w-9 items-center flex justify-center rounded-full border border-neutral-100">
            {" "}
            <Pencil className=" " />
          </div>
        </div>
      </div>
      <div className=" text-white  ">
        {/* h-[calc(100vh-21vh)] */}
        <div className="grid grid-cols-3 space-x-6 h-full">
          {/* Latest Video Performance */}
          <div className="border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-[500] mb-4">
              Latest video performance
            </h2>
            <div className="relative bg-green-900/50 h-48 rounded-lg overflow-hidden">
              <img
                src="/api/placeholder/400/200"
                alt="Video Thumbnail"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white text-center px-4">
                  A brief insight into what this video is about
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-sm text-gray-300">
              <div className="text-center">
                <span>30</span>
                <p>Views</p>
              </div>
              <div className="text-center">
                <span>3</span>
                <p>Likes</p>
              </div>
              <div className="text-center">
                <span>3</span>
                <p>Comments</p>
              </div>
            </div>
            <div className="w-full h-[1px] my-4 bg-gray-700"></div>
            <div className="px-4 pt-2">duration</div>
            <button className="mt-3 w-auto px-4 py-1.5 rounded-[2.5rem] flex items-center justify-center bg-blue-600 hover:bg-blue-700">
              <span>Go to video analytics</span>
            </button>
            <button
              //   onClick={() => handleSubscribe(video._id)}
              className="mt-2   cursor-pointer h-9     justify-center items-center  px-3 py-1.5    rounded-[2.5rem] flex bg-[#222222] hover:bg-[#333333] "
            >
              <span className=" ">See Comments (0)</span>
            </button>
          </div>

          {/* Channel Analytics */}
          <div className="border border-gray-700 rounded-xl p-4 max-h-100">
            <h2 className="text-lg font-semibold mb-4">Channel analytics</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Current subscribers</p>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-gray-500">in last 28 days</p>
              </div>
              <div>
                <h3 className="font-semibold">Summary</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-gray-400">Views</p>
                    <p>27</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Watch time (hours)</p>
                    <p>0.6</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Top videos</h3>
                <div className="flex justify-between items-center">
                  <p>Ninja Fight</p>
                  <p>16 Views</p>
                </div>
              </div>
              <button className="w-auto px-4 py-1.5 rounded-[2.5rem] flex items-center justify-center bg-blue-600 hover:bg-blue-700">
                <span>Go to video analytics</span>
              </button>
            </div>
          </div>

          {/* Create Posts */}
          <div className="space-y-4 ">
            <div className="border border-gray-700 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="border border-gray-700 border-dashed rounded-xl p-6 flex flex-col items-center text-center">
                {/* Image */}
                <div className="w-24 h-24 mb-4">
                  <img
                    src="/api/placeholder/100/100"
                    alt="Create Post"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Text */}
                <p className="text-gray-400 text-sm mb-4">
                  Create your first post to start a conversation and get
                  feedback from your community.
                </p>

                {/* Button */}
                <button className="bg-white text-black font-semibold px-4 py-2 rounded-full hover:bg-gray-200">
                  Create post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
