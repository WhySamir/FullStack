const Main = () => {
  return (
    <div className="p-6 bg-[#121212] text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Channel dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Latest Video Performance */}
        <div className="bg-[#202020] rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">
            Latest video performance
          </h2>
          <div className="bg-green-900 rounded-lg h-48 mb-4 flex items-center justify-center">
            <img
              src="/ninja-fight-thumbnail.jpg"
              alt="Ninja Fight"
              className="max-h-full max-w-full object-cover"
            />
          </div>
          <div className="text-sm text-gray-400">
            <p>Ninja Fight</p>
            <div className="flex justify-between mt-2">
              <span>Views: 11</span>
              <span>Comments: 0</span>
            </div>
          </div>
        </div>

        {/* Channel Analytics */}
        <div className="bg-[#202020] rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Channel analytics</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400">Current subscribers</p>
              <p className="text-2xl font-bold">1</p>
            </div>
            <div className="bg-gray-800 p-2 rounded">
              <p className="text-sm text-gray-400">Summary (Last 28 days)</p>
              <div className="flex justify-between">
                <span>Views</span>
                <span>1 -</span>
              </div>
              <div className="flex justify-between">
                <span>Watch time (hours)</span>
                <span>0.1 -</span>
              </div>
            </div>
          </div>
        </div>

        {/* Creator Insider */}
        <div className="bg-[#202020] rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Creator Insider</h2>
          <div className="bg-gray-800 rounded-lg h-48 flex items-center justify-center">
            <img
              src="/creator-insider.jpg"
              alt="This Week at YouTube"
              className="max-h-full max-w-full object-cover"
            />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-400">
              This week's topics: Experiments about Shorts, end screens and AI
              protection tools...
            </p>
            <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md w-full">
              Watch on YouTube
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
