import api from "./axios";

export const postVideo = async(videoData:{
    thumbnail:File|null;
    title:string;
    description:string;
    duration:number;
    videoFile:File|null;
    isPublished:boolean;

})=>{
    const formData = new FormData()
    // supports only string Blob and files

    //string
    formData.append("title",videoData.title);
    formData.append("description",videoData.description);
    //file
    if(videoData.videoFile){
        formData.append("videoFile",videoData.videoFile);
    }
    if(videoData.thumbnail){
        formData.append("thumbnail",videoData.thumbnail);
    }
    //boolean & number
    formData.append("isPublished",String(videoData.isPublished));
    formData.append("duration",videoData.duration.toString());

    //url name getallvideos but works for post and get both
    try {
   const response =  await api.post('/videos/getallvideos',formData,{
        headers:{"Content-Type": "multipart/form-data",}
    })
     if(response.data.success){
        console.log("Video uploaded sucessfully",response.data)  
         return response.data
     }
     else{
         console.log("Error uploading video")
         return null
     }
   } catch (error:any) {
    console.error(error)
    return null
   }
}

export const userAllvideo = async({ userId }:{userId:string})=>{
    try {
    const response = await api.get(`/videos/getallvideos?page=1&limit=60&query=${userId}&sortBy=title&sortType=asc`,{
       headers:{ 'Content-Type':'application/json'}
    })
      if(response.data){
        //   console.log('Got user All videos successfully',response.data.data)
          return response.data;
      }
      else{
          console.log('Falied getting user data')
          return null
      }
      
  } catch (error:any) {
    console.error("Error getting data",error)
    return null
  }
}