export type Auth = {
  access_token: string;
  message: string;
  user: User;
};

export type User = {
  id: number;
  email: string;
  name: string;
  user_type: 'admin' | 'user';
  profile_pic: string;
  is_super_admin: boolean;
};
