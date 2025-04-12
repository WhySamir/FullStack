import React, { useState, useEffect, useRef } from "react";
import Details from "./Details.js";
import Visibility from "./Visibility.js";
import VideoStepp from "./VideoStepper.js";
import Checks from "./Checks.js";
import { postVideo } from "../../../Api/videoApis.js";
interface Step {
  description: string;
  completed: boolean;
  highlighted: boolean;
  selected: boolean;
}

interface setUploadPopupprops {
  videoURL: string | null;
  video: File;
  setuploadPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const Stepper: React.FC<setUploadPopupprops> = ({
  setuploadPopup,
  video,
  videoURL,
}) => {
  const steps = ["Details", "Video", "Checks", "Visibility"];
  const [currentStep, setCurrentStep] = useState(0);
  const [newStep, setNewStep] = useState<Step[]>([]);
  const stepRef = useRef<Step[]>([]);

  if (video) {
    const url = URL.createObjectURL(video);
    const videoElement = document.createElement("video");
    videoElement.src = url;
    videoElement.preload = "metadata";

    videoElement.onloadedmetadata = () => {
      const duration = videoElement.duration;
      setVideoAttributes((prev) => ({ ...prev, duration }));
    };
  }

  const [videoAttributes, setVideoAttributes] = useState({
    title: video?.name || "",
    description: "",
    thumbnail: null,
    videoFile: video,
    duration: 0,
    isPublished: false,
  });
  const submit = async () => {
    console.log("object", videoAttributes);
    const data = await postVideo(videoAttributes);
    console.log(data);
  };

  const updateStep = (stepNumber: number, steps: Step[]): Step[] => {
    return steps.map((step, index) => ({
      ...step,
      completed: index < stepNumber,
      selected: index === stepNumber,
      highlighted: index <= stepNumber,
    }));
  };
  useEffect(() => {
    const stepsState: Step[] = steps.map((step, _) => ({
      description: step,
      completed: false,
      highlighted: false,
      selected: false,
    }));

    stepRef.current = stepsState;
    setNewStep(updateStep(currentStep, stepRef.current));
  }, [currentStep]);

  const nextStep = () => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <>
      <div className="relative flex justify-center w-full items-center text-black mb-6">
        {newStep.map((step, index) => (
          <div key={index} className="flex flex-col items-start">
            <div className="flex -ml-3 justify-start text-sm lg:text-lg  font-semibold text-white items-start mb-2">
              {steps[index]}
            </div>
            {/* Step Circle */}
            <div className="flex items-center justify-center">
              <div
                className={`flex items-center justify-center rounded-full transition duration-100 ease-out bg-white border-gray-300 ${
                  step.selected ? "h-6 w-6 " : "h-4 w-4 "
                } `}
              >
                <div
                  className={`circle transition duration-100 ease-out  ${
                    step.selected
                      ? "w-3 h-3 transition duration-100 ease-out"
                      : "w-2 h-2"
                  } rounded-full bg-neutral-800`}
                ></div>
              </div>

              {/* Progress Line (Only for non-last steps) */}
              {index !== newStep.length - 1 && (
                <div
                  className={`flex-auto  w-[16vw] border-t-3 transition duration-100 ease-out ${
                    step.completed ? "border-white" : "border-neutral-400"
                  }`}
                ></div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="relative  w-full mb-2  px-3 sm:px-6 h-[50vh] ">
        {currentStep === 0 && (
          <Details
            video={video}
            videoURL={videoURL}
            videoAttributes={videoAttributes}
            setVideoAttributes={setVideoAttributes}
          />
        )}
        {currentStep === 1 && <VideoStepp />}
        {currentStep === 2 && <Checks />}
        {currentStep === 3 && <Visibility video={video} videoURL={videoURL} />}
      </div>
      <div className="flex mt-3 lg:mt-0 px-3 sm:px-6 justify-end w-full gap-4 mb-2">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-4  py-2 flex justify-between text-white rounded-2xl  bg-neutral-500 hover:bg-neutral-400  focus:outline-none"
        >
          Previous
        </button>
        {currentStep < 3 ? (
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="px-4  py-2 flex justify-between text-white rounded-2xl  bg-neutral-500 hover:bg-neutral-400  focus:outline-none"
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => {
              setuploadPopup(false);
              submit();
            }}
            className="px-4  py-2 flex justify-between text-white rounded-2xl  bg-neutral-500 hover:bg-neutral-400  focus:outline-none"
          >
            Done
          </button>
        )}
      </div>
    </>
  );
};

export default Stepper;
