import {
  createComment,
  deleteComment,
  editComment,
  getVideoComments,
  replytoComment,
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
  const [replyStates, setReplyStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const [replyComment, setReplyComment] = useState<{ [key: string]: string }>(
    {}
  );
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
    if (!vidId || !authUser) {
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
  const handleReplyChange = (
    commentId: string,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReplyComment((prev) => ({
      ...prev,
      [commentId]: e.target.value,
    }));
  };
  const handlePostReply = async (parentCommentId: string) => {
    const content = replyComment[parentCommentId]?.trim();
    if (!content || content.length < 4) return;

    try {
      await replytoComment(
        { commentId: parentCommentId },
        {
          content,
        }
      );
      // Reset state and refresh comments
      setReplyStates((prev) => ({ ...prev, [parentCommentId]: false }));
      setReplyComment((prev) => ({ ...prev, [parentCommentId]: "" }));
      getVidComments();
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  return (
    <div className="comments text-white  w-full mt-6">
      <h3 className="text-xl font-semibold">
        {fetchComment?.totalComments} Comments
      </h3>
      {authUser && (
        <div className="mt-4 pb-2 flex items-start">
          <img
            src={authUser?.avatar}
            alt="Uploader Avatar"
            className="sm:w-9 w-8 h-8 sm:h-9 rounded-full object-cover"
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
      )}
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
                  className="rounded-full sm:w-9 w-8 h-8 sm:h-9 object-cover"
                  alt=""
                />
              </div>

              <div className="w-full">
                {!editStates[comment._id] && (
                  <p className="text-sm font-semibold">
                    {comment.owner.username}
                    <span className="text-gray-400 text-xs ml-3">
                      {timeAgo(comment.createdAt)}
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
                  <button
                    onClick={() =>
                      setReplyStates((prev) => ({
                        ...prev,
                        [comment._id]: true,
                      }))
                    }
                    className="hover:text-white"
                  >
                    Reply
                  </button>
                </div>
                {replyStates[comment._id] && (
                  <div className="mt-3 pb-2 flex items-start pl-10">
                    <img
                      src={authUser?.avatar}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="w-full ml-2">
                      <textarea
                        value={replyComment[comment._id] || ""}
                        onChange={(e) => handleReplyChange(comment._id, e)}
                        placeholder="Reply to comment..."
                        className="w-full bg-transparent focus:outline-none resize-none"
                        rows={1}
                      />
                      <hr className=" mt-1 text-gray-500  peer-focus:text-white " />

                      <div className="flex justify-between gap-2 mt-2">
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
                                    setReplyComment((prev) => ({
                                      ...prev,
                                      [comment._id]:
                                        (prev[comment._id] || "") + e.native,
                                    }))
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            className="px-3 py-1 hover:bg-neutral-700 rounded-full"
                            onClick={() => {
                              setReplyStates((prev) => ({
                                ...prev,
                                [comment._id]: false,
                              }));
                              setReplyComment((prev) => ({
                                ...prev,
                                [comment._id]: "",
                              }));
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            disabled={
                              (replyComment[comment._id]?.trim() || "").length <
                              4
                            }
                            className={`px-3 py-1 rounded-full ${
                              (replyComment[comment._id]?.trim() || "")
                                .length >= 4
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-gray-500 opacity-50 cursor-not-allowed"
                            }`}
                            onClick={() => handlePostReply(comment._id)}
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {comment.replies?.length > 0 && (
                  <div className=" mt-3 space-y-2">
                    {comment.replies.map((reply) => (
                      <div
                        key={reply._id}
                        className="relative mt-1 flex flex-col items-start justify-between"
                      >
                        <div className="relative mt-1 w-full flex items-start justify-between">
                          <div className="flex items-start w-full">
                            <img
                              src={reply.owner.avatar}
                              alt="User Avatar"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="ml-2 cursor-default  w-full ">
                              <div className="text-sm font-semibold text-white">
                                {reply.owner.username}
                                <span className="text-gray-400 text-xs ml-3">
                                  {timeAgo(reply.createdAt)}
                                </span>
                              </div>

                              {!editStates[reply._id] ? (
                                <div className=" text-neutral-300 w-full ">
                                  {reply.content}
                                </div>
                              ) : (
                                <div className="relative mt-1 w-full">
                                  <textarea
                                    value={edtComment[reply._id] || ""}
                                    placeholder="Edit reply..."
                                    onChange={(e) =>
                                      handleEditChange(reply._id, e)
                                    }
                                    style={{
                                      resize: "none",
                                      overflow: "hidden",
                                      height: "25px",
                                    }}
                                    className="peer px-4 bg-transparent w-full focus:outline-none"
                                  />
                                  <hr className="mx-3 mt-1 text-gray-500 peer-focus:text-white" />
                                  <div className="flex justify-between w-full pl-3">
                                    <div
                                      className="emoji relative hover:bg-neutral-700 mt-1 rounded-full h-10 w-10 flex items-center justify-center"
                                      onClick={() =>
                                        toggleEmojiPicker(reply._id)
                                      }
                                    >
                                      <Smile />
                                      {isEmojiModalVisible[reply._id] && (
                                        <div
                                          className="absolute top-full left-1 mb-2 z-50"
                                          ref={pickerRef}
                                        >
                                          <div className="overflow-y-auto max-w-fit max-h-70 w-full border border-gray-300 rounded-lg shadow-lg bg-white dark:bg-gray-800 scrollbar-thin">
                                            <Picker
                                              onEmojiSelect={(e: any) =>
                                                setEdtComment((prev) => ({
                                                  ...prev,
                                                  [reply._id]:
                                                    (prev[reply._id] || "") +
                                                    e.native,
                                                }))
                                              }
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                      <button
                                        className="py-1.5 px-3 font-bold hover:bg-neutral-700 rounded-2xl"
                                        onClick={() => {
                                          setEditStates((prev) => ({
                                            ...prev,
                                            [reply._id]: false,
                                          }));
                                          setEdtComment((prev) => ({
                                            ...prev,
                                            [reply._id]: "",
                                          }));
                                        }}
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        disabled={
                                          (edtComment[reply._id]?.trim() || "")
                                            .length < 4
                                        }
                                        className={`py-1.5 px-3 ${
                                          (edtComment[reply._id]?.trim() || "")
                                            .length >= 4
                                            ? "bg-neutral-800 hover:bg-neutral-700"
                                            : "bg-neutral-600 opacity-50 cursor-not-allowed"
                                        } rounded-2xl`}
                                        onClick={() =>
                                          handleEditComment(reply._id)
                                        }
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* <button
                                onClick={() =>
                                  setReplyStates((prev) => ({
                                    ...prev,
                                    [reply._id]: true,
                                  }))
                                }
                                className="hover:text-white"
                              >
                                Reply
                              </button> */}
                            </div>
                          </div>

                          {/* edit and delete options */}
                          <div
                            className={`${
                              editStates[reply._id] ? "hidden" : "block"
                            } editordelete`}
                            onClick={() => {
                              setmodify(reply._id);
                            }}
                          >
                            <EllipsisVertical />
                          </div>

                          {modify === reply._id ? (
                            <div className="absolute right-0 w-32  bg-neutral-700 text-white rounded-lg shadow-lg">
                              {authUser?._id === reply.owner._id ? (
                                <>
                                  <button
                                    className="flex items-center gap-4 w-full px-3 py-2 hover:bg-neutral-600 rounded"
                                    onClick={() => {
                                      setEditStates((prev) => ({
                                        ...prev,
                                        [reply._id]: true,
                                      }));
                                      setEdtComment((prev) => ({
                                        ...prev,
                                        [reply._id]: reply.content,
                                      }));
                                      setmodify(null);
                                    }}
                                  >
                                    <Pencil className="w-4 h-4" /> Edit
                                  </button>
                                  <button
                                    className="flex items-center gap-4 w-full px-3  py-2 hover:bg-neutral-600 rounded"
                                    onClick={() =>
                                      handleDeleteComment(reply._id)
                                    } // or handleDeleteReply if separate
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
                        {/* {replyStates[reply._id] && (
                          <div className="mt-3 pb-2 flex items-start pl-10 w-full">
                            <img
                              src={authUser?.avatar}
                              alt="User Avatar"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="w-full ml-2">
                              <textarea
                                value={replyComment[reply._id] || ""}
                                onChange={(e) =>
                                  handleReplyChange(reply._id, e)
                                }
                                placeholder="Reply to comment..."
                                className="w-full bg-transparent focus:outline-none resize-none"
                                rows={1}
                              />
                              <hr className=" mt-1 text-gray-500  peer-focus:text-white " />

                              <div className="flex justify-between gap-2 mt-2">
                                <div
                                  className="emoji relative  hover:bg-neutral-700 mt-1 rounded-full h-10 w-10  flex items-center justify-center "
                                  onClick={() => toggleEmojiPicker(reply._id)}
                                >
                                  <Smile />
                                  {isEmojiModalVisible[reply._id] && (
                                    <div
                                      className="absolute top-full left-1 mb-2 z-50"
                                      ref={pickerRef}
                                    >
                                      <div className="overflow-y-auto  max-w-fit max-h-70 w-full border border-gray-300 rounded-lg shadow-lg bg-white dark:bg-gray-800 scrollbar-thin">
                                        <Picker
                                          onEmojiSelect={(e: any) =>
                                            setReplyComment((prev) => ({
                                              ...prev,
                                              [reply._id]:
                                                (prev[reply._id] || "") +
                                                e.native,
                                            }))
                                          }
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2 justify-between mt-2">
                                  <button
                                    className="px-3 py-1 hover:bg-neutral-700 rounded-full"
                                    onClick={() => {
                                      setReplyStates((prev) => ({
                                        ...prev,
                                        [reply._id]: false,
                                      }));
                                      setReplyComment((prev) => ({
                                        ...prev,
                                        [reply._id]: "",
                                      }));
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    disabled={
                                      (replyComment[reply._id]?.trim() || "")
                                        .length < 4
                                    }
                                    className={`px-3 py-1 rounded-full ${
                                      (replyComment[reply._id]?.trim() || "")
                                        .length >= 4
                                        ? "bg-blue-500 hover:bg-blue-600"
                                        : "bg-gray-500 opacity-50 cursor-not-allowed"
                                    }`}
                                    onClick={() => handlePostReply(reply._id)}
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )} */}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* edit and delete options */}
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
      ) : authUser ? (
        <p className="text-gray-400 mt-4">No comments yet.</p>
      ) : (
        <p className="text-gray-400 mt-4  cursor-default">
          Please signin to see comments.
        </p>
      )}
    </div>
  );
};

// interface CommentItemProps {
//   comment: Comment;
//   authUser: any;
//   onLike: (commentId: string) => void;
//   onDislike: (commentId: string) => void;
//   onEdit: (commentId: string, content: string) => void;
//   onDelete: (commentId: string) => void;
//   onReply: (parentCommentId: string, content: string) => void;
// }

// const CommentItem = ({
//   comment,
//   authUser,
//   onLike,
//   onDislike,
//   onEdit,
//   onDelete,
//   onReply,
// }: CommentItemProps) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isReplying, setIsReplying] = useState(false);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [content, setContent] = useState(comment.content);
//   const [replyContent, setReplyContent] = useState("");
//   const pickerRef = useRef<HTMLDivElement>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

//   // Handle outside clicks for emoji picker
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         pickerRef.current &&
//         !pickerRef.current.contains(event.target as Node)
//       ) {
//         setShowEmojiPicker(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
//   useEffect(() => {
//     console.log(comment);
//   }, []);

//   // Auto-resize textareas
//   useEffect(() => {
//     const adjustHeight = (ref: React.RefObject<HTMLTextAreaElement>) => {
//       if (ref.current) {
//         ref.current.style.height = "24px";
//         ref.current.style.height = `${ref.current.scrollHeight}px`;
//       }
//     };

//     if (isEditing) adjustHeight(textareaRef);
//     if (isReplying) adjustHeight(replyTextareaRef);
//   }, [content, replyContent, isEditing, isReplying]);

//   const handleSubmitEdit = () => {
//     if (content.trim().length >= 4) {
//       onEdit(comment._id, content.trim());
//       setIsEditing(false);
//     }
//   };

//   const handleSubmitReply = () => {
//     if (replyContent.trim().length >= 4) {
//       onReply(comment._id, replyContent.trim());
//       setIsReplying(false);
//       setReplyContent("");
//     }
//   };

//   return (
//     <div className="comment-item mt-4">
//       <div className="flex gap-3">
//         <img
//           src={comment?.owner?.avatar}
//           alt={comment.owner?.username}
//           className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex-shrink-0"
//         />

//         <div className="flex-1">
//           {!isEditing ? (
//             <>
//               <div className="flex justify-between">
//                 <div>
//                   <span className="font-semibold">
//                     {comment.owner?.username}
//                   </span>
//                   <span className="text-gray-400 text-xs ml-3">
//                     {timeAgo(comment.createdAt)}
//                   </span>
//                 </div>

//                 {authUser?._id === comment.owner?._id && (
//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => setIsEditing(true)}
//                       className="text-xs hover:text-blue-400"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => onDelete(comment._id)}
//                       className="text-xs hover:text-red-400"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <p className="mt-1 whitespace-pre-wrap">{comment.content}</p>

//               <div className="flex gap-4 mt-2 text-gray-400">
//                 <button
//                   onClick={() => onLike(comment._id)}
//                   className={`flex items-center gap-1 ${
//                     comment.isLikedByUser ? "text-blue-500" : "hover:text-white"
//                   }`}
//                 >
//                   <ThumbsUp size={16} /> {comment.likesCount || ""}
//                 </button>
//                 <button
//                   onClick={() => onDislike(comment._id)}
//                   className={`${
//                     comment.isDislikedByUser
//                       ? "text-blue-500"
//                       : "hover:text-white"
//                   }`}
//                 >
//                   <ThumbsDown size={16} />
//                 </button>
//                 <button
//                   onClick={() => setIsReplying(!isReplying)}
//                   className="hover:text-white"
//                 >
//                   Reply
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="edit-comment">
//               <textarea
//                 ref={textareaRef}
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 className="w-full bg-transparent focus:outline-none resize-none"
//                 rows={1}
//               />
//               <div className="flex justify-between mt-2">
//                 <button
//                   className="emoji-btn relative"
//                   onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                 >
//                   <Smile size={18} />
//                   {showEmojiPicker && (
//                     <div ref={pickerRef} className="absolute z-10 bottom-full">
//                       <Picker
//                         onEmojiSelect={(e: any) =>
//                           setContent((c) => c + e.native)
//                         }
//                         theme="dark"
//                       />
//                     </div>
//                   )}
//                 </button>
//                 <div className="flex gap-2">
//                   <button
//                     className="px-3 py-1 rounded-full hover:bg-neutral-700"
//                     onClick={() => setIsEditing(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className={`px-3 py-1 rounded-full ${
//                       content.trim().length >= 4
//                         ? "bg-blue-500 hover:bg-blue-600"
//                         : "bg-gray-500 opacity-50 cursor-not-allowed"
//                     }`}
//                     onClick={handleSubmitEdit}
//                   >
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {isReplying && (
//             <div className="mt-3 reply-input">
//               <textarea
//                 ref={replyTextareaRef}
//                 value={replyContent}
//                 onChange={(e) => setReplyContent(e.target.value)}
//                 placeholder="Write a reply..."
//                 className="w-full bg-transparent focus:outline-none resize-none"
//                 rows={1}
//               />
//               <div className="flex justify-between mt-2">
//                 <button
//                   className="emoji-btn relative"
//                   onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                 >
//                   <Smile size={18} />
//                   {showEmojiPicker && (
//                     <div ref={pickerRef} className="absolute z-10 bottom-full">
//                       <Picker
//                         onEmojiSelect={(e: any) =>
//                           setReplyContent((c) => c + e.native)
//                         }
//                         theme="dark"
//                       />
//                     </div>
//                   )}
//                 </button>
//                 <div className="flex gap-2">
//                   <button
//                     className="px-3 py-1 rounded-full hover:bg-neutral-700"
//                     onClick={() => setIsReplying(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className={`px-3 py-1 rounded-full ${
//                       replyContent.trim().length >= 4
//                         ? "bg-blue-500 hover:bg-blue-600"
//                         : "bg-gray-500 opacity-50 cursor-not-allowed"
//                     }`}
//                     onClick={handleSubmitReply}
//                   >
//                     Reply
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {comment.replies?.length > 0 && (
//             <div className="mt-3 ml-6 pl-4 border-l border-gray-700">
//               {comment.replies.map((reply) => (
//                 <CommentItem
//                   key={reply._id || "1"}
//                   comment={reply}
//                   authUser={authUser}
//                   onLike={onLike}
//                   onDislike={onDislike}
//                   onEdit={onEdit}
//                   onDelete={onDelete}
//                   onReply={onReply}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const Comments = ({ vidId }: { vidId: string }) => {
//   const { authUser } = useSelector((state: RootState) => state.auth);
//   const [comment, setComment] = useState("");
//   const [fetchComment, setFetchComment] = useState<CommentResponse | null>(
//     null
//   );
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const [isFocused, setIsFocused] = useState(false);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const pickerRef = useRef<HTMLDivElement>(null);

//   // Fetch comments
//   const getVidComments = async () => {
//     if (!vidId || !authUser) return;
//     try {
//       const response = await getVideoComments({ vidId });
//       setFetchComment(response.data.length ? response : null);
//       console.log(response);
//     } catch (error) {
//       console.error("Error fetching comments", error);
//     }
//   };

//   useEffect(() => {
//     getVidComments();
//   }, [vidId]);

//   // Emoji picker outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         pickerRef.current &&
//         !pickerRef.current.contains(event.target as Node)
//       ) {
//         setShowEmojiPicker(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Auto-resize textarea
//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "24px";
//       textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//     }
//   }, [comment]);

//   const handlePostComment = async () => {
//     if (!comment.trim() || comment.trim().length < 4) return;
//     try {
//       await createComment({ vidId }, { content: comment.trim() });
//       setComment("");
//       setIsFocused(false);
//       getVidComments();
//     } catch (error) {
//       console.error("Error posting comment", error);
//     }
//   };

//   const handleEditComment = async (commentId: string, content: string) => {
//     try {
//       await editComment({ commentId }, { content });
//       getVidComments();
//     } catch (error) {
//       console.error("Error editing comment", error);
//     }
//   };

//   const handleDeleteComment = async (commentId: string) => {
//     if (confirm("Delete this comment?")) {
//       try {
//         await deleteComment({ commentId });
//         getVidComments();
//       } catch (error) {
//         console.error("Error deleting comment", error);
//       }
//     }
//   };

//   const handlePostReply = async (parentCommentId: string, content: string) => {
//     try {
//       await replytoComment({ commentId: parentCommentId }, { content });
//       getVidComments();
//     } catch (error) {
//       console.error("Error posting reply", error);
//     }
//   };

//   const handleCommentLike = async (commentId: string) => {
//     setFetchComment((prev) => {
//       if (!prev) return prev;

//       return {
//         ...prev,
//         data: prev.data.map((comment) => {
//           if (comment._id === commentId) {
//             return {
//               ...comment,
//               isLikedByUser: !comment.isLikedByUser,
//               isDislikedByUser: false,
//               likesCount: comment.isLikedByUser
//                 ? comment.likesCount - 1
//                 : comment.likesCount + 1,
//             };
//           }
//           return comment;
//         }),
//       };
//     });

//     try {
//       await toggleLike_Dislike({
//         ObjId: commentId,
//         type: "like",
//         contentType: "Comment",
//       });
//     } catch (error) {
//       console.log("Error liking comment", error);
//       // Revert if API fails
//       setFetchComment((prev) => {
//         if (!prev) return prev;

//         return {
//           ...prev,
//           data: prev.data.map((comment) => {
//             if (comment._id === commentId) {
//               return {
//                 ...comment,
//                 isLikedByUser: !comment.isLikedByUser, // Revert change
//                 likesCount: comment.isLikedByUser
//                   ? comment.likesCount + 1
//                   : comment.likesCount - 1,
//               };
//             }
//             return comment;
//           }),
//         };
//       });
//     }
//   };

//   const handleCommentDisLike = async (commentId: string) => {
//     setFetchComment((prev) => {
//       if (!prev) return prev;

//       return {
//         ...prev,
//         data: prev.data.map((comment) => {
//           if (comment._id === commentId) {
//             return {
//               ...comment,
//               isDislikedByUser: !comment.isDislikedByUser,
//               isLikedByUser: false,
//               likesCount: comment.isLikedByUser
//                 ? comment.likesCount - 1
//                 : comment.likesCount,
//             };
//           }
//           return comment;
//         }),
//       };
//     });

//     try {
//       await toggleLike_Dislike({
//         ObjId: commentId,
//         type: "dislike",
//         contentType: "Comment",
//       });
//     } catch (error) {
//       console.log("Error disliking comment", error);
//       // Revert if API fails
//       setFetchComment((prev) => {
//         if (!prev) return prev;

//         return {
//           ...prev,
//           data: prev.data.map((comment) => {
//             if (comment._id === commentId) {
//               return {
//                 ...comment,
//                 isDislikedByUser: !comment.isDislikedByUser, // Revert change
//               };
//             }
//             return comment;
//           }),
//         };
//       });
//     }
//   };

//   return (
//     <div className="comments w-full mt-6 text-white">
//       <h3 className="text-xl font-semibold">
//         {fetchComment?.totalComments || 0} Comments
//       </h3>

//       {/* New comment form */}
//       {authUser && (
//         <div className="mt-4 pb-2 flex gap-3">
//           <img
//             src={authUser.avatar}
//             alt="Your avatar"
//             className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex-shrink-0"
//           />
//           <div className="flex-1">
//             <textarea
//               ref={textareaRef}
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               placeholder="Add a comment..."
//               className="w-full bg-transparent focus:outline-none resize-none"
//               rows={1}
//               onFocus={() => setIsFocused(true)}
//             />

//             {isFocused && (
//               <div className="flex justify-between mt-2">
//                 <button
//                   className="emoji-btn relative"
//                   onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                 >
//                   <Smile size={18} />
//                   {showEmojiPicker && (
//                     <div ref={pickerRef} className="absolute z-10 bottom-full">
//                       <Picker
//                         onEmojiSelect={(e: any) =>
//                           setComment((c) => c + e.native)
//                         }
//                         theme="dark"
//                       />
//                     </div>
//                   )}
//                 </button>
//                 <div className="flex gap-2">
//                   <button
//                     className="px-3 py-1 rounded-full hover:bg-neutral-700"
//                     onClick={() => {
//                       setIsFocused(false);
//                       setComment("");
//                     }}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     disabled={comment.trim().length < 4}
//                     className={`px-3 py-1 rounded-full ${
//                       comment.trim().length >= 4
//                         ? "bg-blue-500 hover:bg-blue-600"
//                         : "bg-gray-500 opacity-50 cursor-not-allowed"
//                     }`}
//                     onClick={handlePostComment}
//                   >
//                     Comment
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Comments list */}
//       <div className="comments-list mt-4">
//         {fetchComment?.data.length ? (
//           fetchComment.data.map((comment) => (
//             <CommentItem
//               key={comment._id}
//               comment={comment}
//               authUser={authUser}
//               onLike={handleCommentLike}
//               onDislike={handleCommentDisLike}
//               onEdit={handleEditComment}
//               onDelete={handleDeleteComment}
//               onReply={handlePostReply}
//             />
//           ))
//         ) : (
//           <p className="text-center py-4 text-gray-400">
//             No comments yet. Be the first to comment!
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };
export default Comments;
