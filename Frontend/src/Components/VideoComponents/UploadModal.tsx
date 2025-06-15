import { Upload } from "lucide-react";
import { useState } from "react";
import StepperforvideoUpload from "./ParentStepper";

interface setUploadPopupprops {
  setUploadPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadModal: React.FC<setUploadPopupprops> = ({ setUploadPopup }) => {
  const [video, setVideo] = useState<File | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const MAX_FILE_SIZE_MB = 25;
  const [isDragOver, setIsDragOver] = useState(false);

  const [videoURL, setVideoURL] = useState<string | null>(null);

  const handleFile = (file: File) => {
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > MAX_FILE_SIZE_MB) {
      setVideo(null);
      setVideoURL(null);
      setVideoError(
        `Video size exceeds ${MAX_FILE_SIZE_MB}MB. Please upload a smaller file.`
      );
      return;
    }

    setVideoError(null);
    setVideo(file);
    const url = URL.createObjectURL(file);
    setVideoURL(url);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  return (
    <>
      {video ? (
        <StepperforvideoUpload
          setUploadPopup={setUploadPopup}
          video={video}
          videoURL={videoURL}
        />
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-50">
          <div className="flex flex-col justify-between bg-neutral-700 rounded-lg shadow-lg w-[70vw] h-[80vh] max-w-full relative">
            <div className="border-b-1 border-neutral-500 flex justify-between items-start px-6 pt-4">
              <h1 className="text-white text-lg font-semibold">
                Upload videos
              </h1>
              <button
                className="mb-3 w-8 h-8 items-center rounded-full hover:bg-neutral-500 text-white text-lg"
                onClick={() => setUploadPopup(false)}
              >
                X
              </button>
            </div>

            {/* Drop Zone Container */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`mt-[6vh] flex flex-col space-y-5 items-center justify-center rounded-lg text-white border-2 border-dashed transition-all duration-300 px-6 py-8 mx-4 ${
                isDragOver
                  ? "border-blue-400 bg-neutral-600/50"
                  : "border-neutral-500"
              }`}
            >
              <div className="circle w-32 h-32 bg-neutral-800 flex items-center justify-center rounded-full p-6">
                <Upload className="w-16 h-16 mb-2" />
              </div>
              <div className="text-center">
                <p>Drag and drop video files to upload</p>
                <p className="text-sm text-white/80">
                  Your videos will be private until you publish them.
                </p>
              </div>

              {/* Select File Button */}
              <label className="mt-4 bg-white text-black hover:bg-neutral-300 rounded-3xl py-2 px-4 cursor-pointer">
                Select files
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="video/*"
                />
              </label>

              {videoError && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {videoError}
                </p>
              )}
            </div>

            <div className="px-0.5 mb-[5vh] justify-center flex items-center text-center">
              <p className="text-xs text-white mt-4">
                By submitting your videos to WatchFree, you acknowledge that you
                agree to YouTube's{" "}
                <a href="#" className="text-blue-400 underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-400 underline">
                  Community Guidelines
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadModal;
