export interface RouteErrorType {
    data:string; 
    error:{
        message:string;
        status:number;
        statusText:string;
    }
}

export interface User extends UserImage {
  _id:string;
    username: string;
    email: string;
    password: string;
    bio: string;
    member_since: Date  | string;
    bookmarks: ExpDetails[];
    submissions: ExpDetails[];
  }
  
  export interface ExpDetails {
    _id:string,
    author:{
      _id:string,
      username:string,
      user_image:string,
    },
    title: string;
    publication_date: Date  | string;
    photo: string;
    location:{
      city:string;
      country:string;
    }
  }
  
  export interface UserImage {
    user_image: string;
  }
  

  export interface Experience extends ExperienceImage {
    _id:string;
    author: {
      a_id: string;
      username: string;
      email: string;
      bio: string;
      member_since: Date | string;
      user_image: string;
    };
    title: string;
    caption: string;
    publication_date: Date | string;
    location: {
      country: string;
      city: string;
      longitude: string | number;
      latitude: string | number;
    };
    experienceType: string;
    text_body: string;
    bookmarked_by:Bookmarks[];
    comments:CommentsType[] | null


  }

  export interface Bookmarks {
    _id:string,
    username:string,
    bio:string,
    member_since:Date | string,
    user_image:string
  }
  
  export interface ExperienceImage {
    photo: string;
    photo_body: string | string[];
  }

  export interface CommentsType {
    _id:string;
    author: {
      _id: string;
      email: string;
      username: string;
      user_image: string;
    };
    date: Date | string;
    message: string;
    experienceID:string
  }