export type User = {
  id: number;
  username: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  email: string;
};

export type PayloadCreateUser = Omit<User, 'id'>;

export type PayloadUpdateUser = Omit<User, 'password' | 'username'>;
