
export interface VideoOwner {
    _id: string;
    username: string;
    avatar: string;
  }
  
export interface VideoProps {
    thumbnail: string;
    title: string;
    hashtag:string;
    description: string;
    duration: number;
    videoFile: string;
    isPublished: boolean;
    views: number | null;
    owner: VideoOwner;
    isLikedByUser: boolean;
    isDislikedByUser: boolean;
    likesCount: number;
    isSubscribedByUser: boolean;
    subscribersCount: number;
    commentCount:number;
    updatedAt: string;
    createdAt: string;
    _id: string;
  }
  
