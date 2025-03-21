import api from "./axios";

export const toggleLike_Dislike = async ({
  ObjId,
  type,
  contentType  // Defaulting to "Video", or pass explicitly
}: { ObjId: string; type: string; contentType?: string }) => {
  if (!ObjId || !type) return;

  try {
    // Make sure you send both the params and the request body
    const response = await api.post(
      `/toggle/like-dislike/${ObjId}/${type}`,
      { contentType } // Send the contentType in the body
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

