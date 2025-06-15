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
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [thumbnailRequiredError, setThumbnailRequiredError] = useState<
    string | null
  >(null);
  const [hashtagError, setHashtagError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<boolean>(false);
  const [selectedOptionError, setSelectedOptionError] = useState<string | null>(
    null
  );

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
    thumbnailName: null,
    thumbnailSize: null,
    videoFile: video,
    duration: 0,
    isPublished: false,
    hashtag: "",
  });
  const submit = async () => {
    console.log("Submitting video", videoAttributes);
    try {
      const data = await postVideo(videoAttributes);
      console.log("Upload response:", data);
    } catch (err) {
      console.error("Submit error:", err);
    }
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
            titleError={titleError}
            setTitleError={setTitleError}
            descriptionError={descriptionError}
            setDescriptionError={setDescriptionError}
            thumbnailRequiredError={thumbnailRequiredError}
            setThumbnailRequiredError={setThumbnailRequiredError}
          />
        )}
        {currentStep === 1 && <VideoStepp />}
        {currentStep === 2 && <Checks />}
        {currentStep === 3 && (
          <Visibility
            video={video}
            videoURL={videoURL}
            setVideoAttributes={setVideoAttributes}
            setSelectedOptions={setSelectedOption}
            hashtagError={hashtagError}
            setHashtagError={setHashtagError}
            selectedOptionError={selectedOptionError}
            setSelectedOptionError={setSelectedOptionError}
          />
        )}
      </div>
      <div className="flex mt-3 lg:mt-0 px-3 sm:px-6 justify-end w-full gap-4 mb-2">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`px-4 ${
            currentStep === 0
              ? "bg-neutral-600 cursor-not-allowed"
              : "bg-neutral-500 hover:bg-neutral-400"
          }  py-2 flex justify-between text-white rounded-2xl    focus:outline-none`}
        >
          Previous
        </button>
        {currentStep < 3 ? (
          <button
            onClick={() => {
              if (currentStep === 0) {
                let isValid = true;
                const { title, description, thumbnail } = videoAttributes;

                if (!title || title.trim().length < 4) {
                  setTitleError("Title must be at least 4 characters long.");
                  isValid = false;
                } else {
                  setTitleError(null);
                }

                if (!description || description.trim().length < 4) {
                  setDescriptionError(
                    "Description must be at least 4 characters long."
                  );
                  isValid = false;
                } else {
                  setDescriptionError(null);
                }

                if (!thumbnail) {
                  setThumbnailRequiredError("Thumbnail is required.");
                  isValid = false;
                } else {
                  setThumbnailRequiredError(null);
                }

                if (!isValid) return;
              }

              nextStep();
            }}
            disabled={currentStep === steps.length - 1}
            className="px-4  py-2 flex justify-between text-white rounded-2xl  bg-neutral-500 hover:bg-neutral-400  focus:outline-none"
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => {
              let isValid = true;
              const { hashtag } = videoAttributes;

              if (!hashtag || hashtag.trim().length < 4) {
                setHashtagError("Hashtag is required.");
                isValid = false;
              } else {
                setHashtagError(null);
              }

              if (!selectedOption) {
                setSelectedOptionError("Visibility is required.");
                isValid = false;
              } else {
                setSelectedOptionError(null);
              }

              if (!isValid) return;

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
