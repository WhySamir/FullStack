import api from "./axios";

export const getChannelSubscribers = async (channelId:string) =>{
   try {
     const response = await api.get(`/subscriptions/u/${channelId}`);
     return response.data
   } catch (error) {
     console.error(error);
    
   }
}
export const toggleSubscribe = async (channelId: string) => {
  console.log("Channel ID being sent:", channelId); // Debugging line

  try {
    const response = await api.post(`/subscriptions/u/${channelId}`);
    console.log("Response:", response.data); // Log response
    return response.data;
  } catch (error: any) {
    console.error("Error in toggleSubscribe:", error.response?.data || error.message);
    throw error; // Ensure the error is thrown
  }
};

  

export const getUserSubcribedChannel = async (userId:string) =>{
    try {
        const response = await api.get(`/subscriptions/c/${userId}`);
        return response.data
    } catch (error) {
        console.error(error);
        
    }
}
