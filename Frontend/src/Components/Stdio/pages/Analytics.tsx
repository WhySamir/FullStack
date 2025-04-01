import { useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Analytics = () => {
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [selectedGraph, setSelectedGraph] = useState<Number>(0);
  const tabs = ["Overview", "Content"];
  const viewData = [
    { date: "28 Feb", views: 0 },
    { date: "5 Mar", views: 0 },
    { date: "9 Mar", views: 0 },
    { date: "14 Mar", views: 0 },
    { date: "18 Mar", views: 10 },
    { date: "23 Mar", views: 15 },
    { date: "27 Mar", views: 5 },
  ];
  const subscribersData = [
    { date: "28 Feb", subscribers: 10 },
    { date: "5 Mar", subscribers: 20 },
    { date: "9 Mar", subscribers: 30 },
    { date: "14 Mar", subscribers: 40 },
    { date: "18 Mar", subscribers: 10 },
    { date: "23 Mar", subscribers: 15 },
    { date: "27 Mar", subscribers: 5 },
  ];
  const watchData = [
    { date: "28 Feb", watchTime: 10 },
    { date: "5 Mar", watchTime: 50 },
    { date: "9 Mar", watchTime: 80 },
    { date: "14 Mar", watchTime: 90 },
    { date: "18 Mar", watchTime: 100 },
    { date: "23 Mar", watchTime: 15 },
    { date: "27 Mar", watchTime: 5 },
  ];
  return (
    <>
      <div className="pl-6 pr-4 flex justify-between  items-center h-[12vh]">
        <h1 className="text-white font-semibold text-3xl">Channel analytics</h1>
      </div>
      <div className="pl-6 pr-4 flex mb-4 space-x-8 border-b border-gray-700 ">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={` py-2 ${
              selectedTab === tab
                ? "font-semibold border-b-2 border-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className=" pl-6 pr-4 grid grid-cols-[5.9fr_2fr] space-x-9 ">
        <div className="">
          <h2 className="text-3xl text-center text-white font-bold my-6">
            Your channel got 30 views in the last 28 days
          </h2>
          <div className="border  border-gray-700 text-white overflow-hidden rounded-lg">
            <div className="grid grid-cols-3  mb-12">
              <button
                onClick={() => setSelectedGraph(0)}
                className={` border-r border-r-gray-700 p-4  ${
                  selectedGraph === 0 && "bg-neutral-800"
                }`}
              >
                <p className="text-neutral-400">Views</p>
                <p className="text-2xl font-bold">30</p>
              </button>
              <button
                onClick={() => setSelectedGraph(1)}
                className={`  border-r border-r-gray-700 p-4 ${
                  selectedGraph === 1 && "bg-neutral-800"
                }`}
              >
                <p className="text-neutral-400">Watch time (hours)</p>
                <p className="text-2xl font-bold">0.6</p>
              </button>
              <button
                onClick={() => setSelectedGraph(2)}
                className={`${
                  selectedGraph === 2 && "bg-neutral-800"
                } border-r border-r-gray-700 p-4 `}
              >
                <p className="text-neutral-400">Subscribers</p>
                <p className="text-2xl font-bold text-green-500">+1</p>
              </button>
            </div>

            <div className="h-64  w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={
                    selectedGraph === 0
                      ? viewData
                      : selectedGraph === 1
                      ? subscribersData
                      : watchData
                  }
                >
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis
                    dataKey={
                      selectedGraph === 0
                        ? "views"
                        : selectedGraph === 1
                        ? "subscribers"
                        : "watchTime"
                    }
                    className="text-xs"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#404040",
                      borderColor: "#404040",
                      color: "#ffffff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={
                      selectedGraph === 0
                        ? "views"
                        : selectedGraph === 1
                        ? "subscribers"
                        : "watchTime"
                    }
                    stroke="#00b4ff"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className=" self-start px-2 pb-4 border rounded-lg  border-gray-700 ">
          <div className=" grid grid-cols-2 gap-2 my-5">
            <div className="bg-neutral-800 p-4 rounded">
              <h3 className=" mb-2 text-white">Realtime</h3>
              <p className="text-neutral-400 text-sm mb-3">Updating Live</p>
              <div className="flex flex-col justify-start gap-2">
                <p className="text-2xl font-bold text-white">2</p>
                <p className="text-sm font-bold">Subscribers</p>
              </div>
            </div>
            <div className="bg-neutral-800 p-4 rounded">
              <h3 className="text-neutral-400 mb-2"> Last 48 hours </h3>
              <h3 className="text-neutral-400 mb-2">Views </h3>
              <p className="text-2xl font-bold">12</p>
              <div className="flex items-center mt-2">
                <div className="w-full h-12 bg-neutral-700 rounded overflow-hidden">
                  <div className="h-full bg-blue-500 w-1/2"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800 p-4 rounded mt-4">
            <h3 className="text-neutral-400 mb-2">Top content</h3>
            <div className="flex items-center">
              <div className="w-16 h-10 bg-neutral-700 rounded mr-4"></div>
              <div>
                <p className="font-bold">Ninja Fight</p>
                <p className="text-neutral-400">12 views</p>
              </div>
            </div>
            <button className="mt-4 px-4 rounded-4xl text-white bg-neutral-700 py-2 ">
              Content
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
