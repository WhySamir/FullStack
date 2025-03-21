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
  FlagOffIcon,
  Pencil,
  Smile,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { timeAgo } from "../Utilis/FormatDuration";
import { toggleLike_Dislike } from "../Api/like";

interface Comment {
  _id: string;
  content: string;
  isLikedByUser: boolean;
  isDislikedByUser: boolean;
  likesCount: number;
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
  const [edtComment, setEdtComment] = useState<{ [key: string]: string }>({});
  const [modify, setmodify] = useState<string | null>(null);
  const [editStates, setEditStates] = useState<{ [key: string]: boolean }>({});

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [isEmojiModalVisible, setIsEmojiModalVisible] = useState<{
    [key: string]: boolean;
  }>({});
  const [emojiComment, setEmojiComment] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState(false);
  const [fetchComment, setfetchComment] = useState<CommentResponse | null>(
    null
  );

  const getVidComments = async () => {
    if (!vidId) {
      return;
    }
    try {
      const response = await getVideoComments({ vidId });
      if (response.data.length === 0) {
        setfetchComment(null);
      } else {
        console.log(response);
        const sortedResponse = {
          ...response,
          data: response.data.sort((a: any, b: any) => {
            if (a.owner._id === authUser?._id) return -1;
            if (b.owner._id === authUser?._id) return 1;
            return 0;
          }),
        };

        console.log(sortedResponse);
        setfetchComment(sortedResponse);
      }
    } catch (error) {
      console.log("error fetching vidcomments", error);
    }
  };
  useEffect(() => {
    getVidComments();
  }, [vidId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setEmojiComment(false);
        setIsEmojiModalVisible((prev) => {
          const newState = { ...prev };
          Object.keys(prev).forEach((key) => {
            if (!pickerRef.current?.contains(event.target as Node)) {
              delete newState[key];
            }
          });
          return newState;
        });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //comment text
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "24px"; //reset
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };
  const handleEditChange = (
    commentId: string,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEdtComment((prev) => ({ ...prev, [commentId]: e.target.value }));
  };
  //post comment
  const handleComment = async () => {
    if (!vidId || comment.trim().length < 4) return;

    try {
      await createComment({ vidId }, { content: comment.trim() });
      console.log("Created Comment Sucess");
      setIsFocused(false);
      setComment("");
      getVidComments();
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditComment = async (commentId: string) => {
    if (!edtComment[commentId] || edtComment[commentId].trim().length < 4)
      return;

    try {
      await editComment({ commentId }, { content: edtComment[commentId] });
      setEditStates((prev) => ({ ...prev, [commentId]: false }));
      setEdtComment((prev) => ({ ...prev, [commentId]: "" }));
      getVidComments();
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteComment = async (commentId: string) => {
    const conf = confirm("Delete comment");
    if (conf) {
      try {
        await deleteComment({ commentId });
      } catch (error) {
        console.log(error);
      }
    } else return;
    getVidComments();
  };

  const handleCommentLike = async (commentId: string) => {
    setfetchComment((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        data: prev.data.map((comment) => {
          if (comment._id === commentId) {
            return {
              ...comment,
              isLikedByUser: !comment.isLikedByUser,
              isDislikedByUser: false,
              likesCount: comment.isLikedByUser
                ? comment.likesCount - 1
                : comment.likesCount + 1,
            };
          }
          return comment;
        }),
      };
    });

    try {
      await toggleLike_Dislike({
        ObjId: commentId,
        type: "like",
        contentType: "Comment",
      });
    } catch (error) {
      console.log("Error liking comment", error);
      // Revert if API fails
      setfetchComment((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          data: prev.data.map((comment) => {
            if (comment._id === commentId) {
              return {
                ...comment,
                isLikedByUser: !comment.isLikedByUser, // Revert change
                likesCount: comment.isLikedByUser
                  ? comment.likesCount + 1
                  : comment.likesCount - 1,
              };
            }
            return comment;
          }),
        };
      });
    }
  };

  const handleCommentDisLike = async (commentId: string) => {
    setfetchComment((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        data: prev.data.map((comment) => {
          if (comment._id === commentId) {
            return {
              ...comment,
              isDislikedByUser: !comment.isDislikedByUser,
              isLikedByUser: false,
              likesCount: comment.isLikedByUser
                ? comment.likesCount - 1
                : comment.likesCount,
            };
          }
          return comment;
        }),
      };
    });

    try {
      await toggleLike_Dislike({
        ObjId: commentId,
        type: "dislike",
        contentType: "Comment",
      });
    } catch (error) {
      console.log("Error disliking comment", error);
      // Revert if API fails
      setfetchComment((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          data: prev.data.map((comment) => {
            if (comment._id === commentId) {
              return {
                ...comment,
                isDislikedByUser: !comment.isDislikedByUser, // Revert change
              };
            }
            return comment;
          }),
        };
      });
    }
  };

  const toggleEmojiPicker = (commentId: string) => {
    setIsEmojiModalVisible((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
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
          className="sm:w-10 w-8 h-8 sm:h-10 rounded-full object-cover"
        />
        <div className="h-full  w-full">
          <textarea
            ref={textareaRef}
            value={comment}
            onChange={handleChange}
            placeholder="Add a comment..."
            style={{
              resize: "none",
              overflow: "hidden",
              height: "24px",
            }}
            className="peer px-4 bg-transparent w-full focus:outline-none"
            onClick={() => setIsFocused(true)}
          />

          <hr className="mx-3 mt-1 text-gray-500  peer-focus:text-white " />
          {isFocused && (
            <div className="flex justify-between w-full  pl-3">
              <button
                className="emoji relative  hover:bg-neutral-700 mt-1 rounded-full h-10 w-10  flex items-center justify-center "
                onClick={() => setEmojiComment(!emojiComment)}
              >
                <Smile />
                {emojiComment && (
                  <div
                    className="absolute top-full left-4 mb-2 z-50"
                    ref={pickerRef}
                  >
                    <div className="overflow-y-auto  max-w-fit max-h-70 w-full border border-gray-300 rounded-lg shadow-lg bg-white dark:bg-gray-800 scrollbar-thin">
                      <Picker
                        onEmojiSelect={(e: any) =>
                          setComment((c) => c + e.native)
                        }
                      />
                    </div>
                  </div>
                )}
              </button>
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
                  disabled={comment.trim().length < 4}
                  className={`py-1.5 px-3   ${
                    comment.trim().length >= 4
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
              <div className="sm:w-10 w-8 h-8 sm:h-10 rounded-full  flex-shrink-0 flex items-center justify-center text-white font-bold">
                <img
                  src={`${comment.owner.avatar}`}
                  className="rounded-full sm:w-10 w-8 h-8 sm:h-10 object-cover"
                  alt=""
                />
              </div>

              <div className="w-full">
                {!editStates[comment._id] && (
                  <p className="text-sm font-semibold">
                    {comment.owner.username}
                    <span className="text-gray-400 text-xs ml-3">
                      {timeAgo(comment.updatedAt)}
                    </span>
                  </p>
                )}
                {editStates[comment._id] ? (
                  <div className=" relative   mt-1 ">
                    <textarea
                      value={edtComment[comment._id] || ""}
                      placeholder={"Edit comment..."}
                      onChange={(e) => handleEditChange(comment._id, e)}
                      style={{
                        resize: "none",
                        overflow: "hidden",
                        height: "25px",
                      }}
                      className="peer px-4 bg-transparent w-full focus:outline-none"
                    />

                    <hr className="mx-3 mt-1 text-gray-500  peer-focus:text-white " />

                    <div className="flex justify-between w-full  pl-3">
                      <div
                        className="emoji relative  hover:bg-neutral-700 mt-1 rounded-full h-10 w-10  flex items-center justify-center "
                        onClick={() =>
                          toggleEmojiPicker(comment._id || "comment")
                        }
                      >
                        <Smile />
                        {isEmojiModalVisible[comment._id] && (
                          <div
                            className="absolute top-full left-1 mb-2 z-50"
                            ref={pickerRef}
                          >
                            <div className="overflow-y-auto  max-w-fit max-h-70 w-full border border-gray-300 rounded-lg shadow-lg bg-white dark:bg-gray-800 scrollbar-thin">
                              <Picker
                                onEmojiSelect={(e: any) =>
                                  setEdtComment((prev) => ({
                                    ...prev,
                                    [comment._id]: prev[comment._id] + e.native,
                                  }))
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          className="py-1.5  px-3 font-bold hover:bg-neutral-700 rounded-2xl"
                          onClick={() => {
                            setIsFocused(false);
                            setEdtComment((prev) => ({
                              ...prev,
                              [comment._id]: "",
                            }));

                            setEditStates((prev) => ({
                              ...prev,
                              [comment._id]: false,
                            }));
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          disabled={
                            (edtComment[comment._id]?.trim() || "").length < 4
                          }
                          className={`py-1.5 px-3   ${
                            edtComment[comment._id]?.trim().length >= 4
                              ? "bg-neutral-800 hover:bg-neutral-700"
                              : "bg-neutral-600 opacity-50 cursor-not-allowed"
                          }  rounded-2xl`}
                          onClick={() => handleEditComment(comment._id)}
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
                  <button
                    onClick={() => handleCommentLike(comment._id)}
                    className={` flex items-center gap-1 ${
                      comment.isLikedByUser
                        ? "text-blue-500"
                        : "hover:text-white"
                    }`}
                  >
                    <ThumbsUp /> <span>{comment.likesCount}</span>
                  </button>
                  <button
                    onClick={() => handleCommentDisLike(comment._id)}
                    className={` ${
                      comment.isDislikedByUser
                        ? "text-blue-500 "
                        : "hover:text-white"
                    }`}
                  >
                    <ThumbsDown />
                  </button>
                  <button className="hover:text-white">Tweet</button>
                </div>
                <p className="text-blue-400 cursor-pointer mt-1">1 tweet</p>
              </div>
            </div>
            <div
              className={`${
                editStates[comment._id] ? "hidden" : "block"
              } editordelete`}
              onClick={() => {
                setmodify(comment._id);
              }}
            >
              <EllipsisVertical />
            </div>
            {modify === comment._id ? (
              <div className="absolute right-0 w-32 bg-neutral-700 text-white rounded-lg shadow-lg">
                {authUser?._id === comment.owner._id ? (
                  <>
                    <button
                      className="flex items-center gap-4 w-full px-3 py-2 hover:bg-neutral-600 rounded"
                      onClick={() => {
                        setEditStates((prev) => ({
                          ...prev,
                          [comment._id]: true, // Set only this comment to edit mode
                        }));
                        setEdtComment((prev) => ({
                          ...prev,
                          [comment._id]: comment.content,
                        }));
                        setmodify(null);
                      }}
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button
                      className="flex items-center gap-4 w-full px-3 py-2 hover:bg-neutral-600 rounded"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setmodify(null)}
                    className="flex items-center gap-4 w-full px-3 py-2 hover:bg-neutral-600 rounded"
                  >
                    <FlagOffIcon className="w-4 h-4" /> Report
                  </button>
                )}
              </div>
            ) : null}
          </div>
        ))
      ) : (
        <p className="text-gray-400 mt-4">No comments yet.</p>
      )}
    </div>
  );
};

export default Comments;
