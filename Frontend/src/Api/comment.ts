import api from "./axios"

//pagination left in both comment and userfetchrecommendedvideo
export const getVideoComments = async({vidId}:{vidId:string})=>{
    try {     
        const response = await api.get(`/comments/getvideocomments/u/${vidId}`);
        if (response.data.success) {
        return response.data
        }
    } catch (error) {
        console.log("cannot get video comments",error)
        return null
    }
}
export const createComment = async({vidId}:{vidId:string}, content: { content: string},
)=>{
    try {     
        console.log("API Request Data:",  content );

        const response = await api.post(`/comments/createcomments/u/${vidId}`,content);
        if (response.data.success) {
        return response.data
        }
    } catch (error:any) {
        console.log("cannot post video comments",error.response?.data || error.message)
        return null
    }
    
}
export const deleteComment = async({commentId}:{commentId:string}) =>{
    try {
        const response = await api.delete(`/comments/deletecomment/u/${commentId}`);
        if(response.data.success){
            return response.data
        }
        
    } catch (error:any) {
        console.log("cannot delete video comments",error.response?.data || error.message)
        return null
        
    }
}
export const editComment = async({commentId}:{commentId:string}, content: { content: string})=>{
    try {
        const response = await api.patch(`/comments/editusercomment/u/${commentId}`,content);
        if(response.data.success){
            return response.data
        }
        
    } catch (error:any) {
        console.log("cannot delete video comments",error.response?.data || error.message)
        return null
        
    }
}

export const replytoComment= async({commentId}:{commentId:string}, content: { content: string})=>{
try {
     await api.post(`/comments/replycomment/u/${commentId}`, content);
} catch (error:any) {
    console.log("cannot reply to video comments", error.response?.data || error.message);
    return null;
    
}
}
