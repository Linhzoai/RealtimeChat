export interface User {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Friend {
  _id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

export interface FriendRequest {
  _id: string;
  to?:{
    _id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  }
  from?:{
    _id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  }
  message: string;
  createdAt: string;
  updateAt:string;
}

export interface FriendState{
  loading: boolean;
  friendList: Friend[];
  receivedList: FriendRequest[];
  sendList: FriendRequest[];
  searchByUsername: (username:string)=> Promise<User | null>;
  addFriend: (to: string, message?:string)=> Promise<{code: number, message: string}>;
  getAllFriendRequests: ()=>Promise<void>;
  acceptFriendRequest: (requestId: string)=>Promise<void>;
  declineFriendRequest:(requestId: string)=>Promise<void>;
  getFriendList: ()=>Promise<void>;
}
