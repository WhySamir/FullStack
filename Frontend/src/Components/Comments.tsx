import {
  createComment,
  deleteComment,
  editComment,
  getVideoComments,
} from "../Api/comment";
import Picker from "@emoji-mart/react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import {
  EllipsisVertical,
  Pencil,
  Smile,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { timeAgo } from "../Utilis/FormatDuration";
interface Comment {
  _id: string;
  content: string;
  video: string;
  owner: {
    _id: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  parentComment: Comment | null;
  replies: Comment[];
}

interface CommentResponse {
  data: Comment[];
  totalComments: number;
  totalPages: number;
  currentPage: number;
}
const Comments = ({ vidId }: { vidId: string }) => {
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [comment, setComment] = useState("");
  const [edtComment, setEdtComment] = useState("");
  const isValidComment2 = edtComment.trim().length >= 4;
  const [modify, setmodify] = useState<string | null>(null);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const isValidComment = comment.trim().length >= 4;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [isEmojiModalVisible, setIsEmojiModalVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [fetchComment, setfetchComment] = useState<CommentResponse | null>(
    null
  );

  const toggleEmojiModal = () => {
    setIsEmojiModalVisible(!isEmojiModalVisible);
  };
  const handleSelectEmoji = (emoji: any) => {
    setComment(comment + emoji.native);
    setIsEmojiModalVisible(false);
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (
      pickerRef.current &&
      !pickerRef.current.contains(event.target as Node)
    ) {
      setIsEmojiModalVisible(false); // Close the picker if clicked outside
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const getVidComments = async () => {
      if (!vidId) {
        return;
      }
      try {
        const response = await getVideoComments({ vidId });
        if (response.data.length === 0) {
          setfetchComment(null);
        } else {
          setfetchComment(response);
        }
      } catch (error) {
        console.log("error fetching vidcomments", error);
      }
    };
    getVidComments();
  }, [vidId]);
  //comment text
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "24px"; //reset
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEdtComment(e.target.value);
  };
  //post comment
  const handleComment = async () => {
    if (!vidId || !isValidComment) return;

    console.log("Comment Submitted:", comment.trim());
    console.log("Sending request to backend:", {
      vidId,
      content: comment.trim(),
    });
    try {
      await createComment({ vidId }, { content: comment.trim() });
      console.log("Created Comment Sucess");
      setIsFocused(false);
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditComment = async (commentId: string, edtComment: string) => {
    console.log("Edit Comment:", commentId);
    try {
      await editComment({ commentId }, { content: edtComment });
      setmodify(null);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteComment = async (commentId: string) => {
    console.log("Delete Comment:", commentId);
    const conf = confirm("Delete comment");
    if (conf) {
      try {
        await deleteComment({ commentId });
      } catch (error) {
        console.log(error);
      }
    }
    setmodify(null);
  };
  return (
    <div className="comments text-white  w-full mt-6">
      <h3 className="text-xl font-semibold">
        {fetchComment?.totalComments} Comments
      </h3>
      <div className="mt-4 pb-2 flex items-start">
        <img
          src={authUser?.avatar}
          alt="Uploader Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="h-full  w-full">
          <textarea
            ref={textareaRef}
            style={{
              resize: "none",
              overflow: "hidden",
              height: "24px",
            }}
            value={comment}
            placeholder="Add a comment..."
            className="peer px-4 bg-transparent w-full focus:outline-none"
            onClick={() => setIsFocused(true)}
            onChange={handleChange}
          />

          <hr className="mx-3 mt-1 text-gray-500  peer-focus:text-white " />
          {isFocused && (
            <div className="flex justify-between w-full  pl-3">
              <div
                className="emoji relative  hover:bg-neutral-700 mt-1 rounded-full h-10 w-10  flex items-center justify-center "
                onClick={toggleEmojiModal}
              >
                <Smile />
                {isEmojiModalVisible && (
                  <div
                    className="absolute top-full left-4 mb-2 z-50"
                    ref={pickerRef}
                  >
                    <div className="overflow-y-auto  max-w-fit max-h-70 w-full border border-gray-300 rounded-lg shadow-lg bg-white dark:bg-gray-800 scrollbar-thin">
                      <Picker onEmojiSelect={handleSelectEmoji} />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  className="py-1.5  px-3 font-bold hover:bg-neutral-700 rounded-2xl"
                  onClick={() => {
                    setIsFocused(false);
                    setComment("");
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={!isValidComment}
                  className={`py-1.5 px-3   ${
                    isValidComment
                      ? "bg-neutral-800 hover:bg-neutral-700"
                      : "bg-neutral-600 opacity-50 cursor-not-allowed"
                  }  rounded-2xl`}
                  onClick={handleComment}
                >
                  Comment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {fetchComment && fetchComment.data.length > 0 ? (
        fetchComment.data.map((comment, _) => (
          <div
            key={comment._id}
            className="relative mt-4 flex items-start justify-between"
          >
            <div className="flex space-x-3 w-full">
              <div className="w-10 h-10 rounded-full  flex-shrink-0 flex items-center justify-center text-white font-bold">
                <img
                  src={`${comment.owner.avatar}`}
                  className="rounded-full w-10 h-10 object-cover"
                  alt=""
                />
              </div>

              <div className="w-full">
                {!isEditModal && (
                  <p className="text-sm font-semibold">
                    {comment.owner.username}
                    <span className="text-gray-400 text-xs ml-3">
                      {timeAgo(comment.updatedAt)}
                    </span>
                  </p>
                )}
                {isEditModal ? (
                  <div className=" relative   mt-1 ">
                    <textarea
                      style={{
                        resize: "none",
                        overflow: "hidden",
                        height: "25px",
                      }}
                      value={edtComment}
                      placeholder={edtComment}
                      className="peer px-4 bg-transparent w-full focus:outline-none"
                      onChange={handleEditChange}
                    />

                    <hr className="mx-3 mt-1 text-gray-500  peer-focus:text-white " />

                    <div className="flex justify-between w-full  pl-3">
                      <div
                        className="emoji relative  hover:bg-neutral-700 mt-1 rounded-full h-10 w-10  flex items-center justify-center "
                        onClick={toggleEmojiModal}
                      >
                        <Smile />
                        {isEmojiModalVisible && (
                          <div
                            className="absolute top-full left-4 mb-2 z-50"
                            ref={pickerRef}
                          >
                            <div className="overflow-y-auto  max-w-fit max-h-70 w-full border border-gray-300 rounded-lg shadow-lg bg-white dark:bg-gray-800 scrollbar-thin">
                              <Picker onEmojiSelect={handleSelectEmoji} />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          className="py-1.5  px-3 font-bold hover:bg-neutral-700 rounded-2xl"
                          onClick={() => {
                            setIsEditModal(false);
                            setEdtComment("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          disabled={!isValidComment2}
                          className={`py-1.5 px-3   ${
                            isValidComment2
                              ? "bg-neutral-800 hover:bg-neutral-700"
                              : "bg-neutral-600 opacity-50 cursor-not-allowed"
                          }  rounded-2xl`}
                          onClick={() =>
                            handleEditComment(comment._id, edtComment)
                          }
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1">{comment.content}</p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-gray-400">
                  <button className="flex items-center space-x-1 hover:text-white">
                    <ThumbsUp /> <span>15</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-white">
                    <ThumbsDown />
                  </button>
                  <button className="hover:text-white">Tweet</button>
                </div>
                <p className="text-blue-400 cursor-pointer mt-1">1 tweet</p>
              </div>
            </div>
            <div
              className={`${isEditModal ? "hidden" : "block"} editordelete`}
              onClick={() => {
                setmodify(comment._id);

                console.log(comment._id);
              }}
            >
              <EllipsisVertical />
            </div>
            {modify === comment._id && (
              <div
                className={` absolute right-0  w-32 bg-neutral-700 text-white rounded-lg shadow-lg `}
              >
                <button
                  className="flex items-center  gap-4 w-full px-3 py-2 hover:bg-neutral-600 rounded"
                  onClick={() => {
                    setIsEditModal(true);
                    setmodify(null);
                    setEdtComment(comment.content);
                  }}
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button
                  className="flex items-center gap-4 w-full px-3 py-2 hover:bg-neutral-600 rounded"
                  onClick={() => {
                    handleDeleteComment(comment._id);
                  }}
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-400 mt-4">No comments yet.</p>
      )}
    </div>
  );
};

export default Comments;
