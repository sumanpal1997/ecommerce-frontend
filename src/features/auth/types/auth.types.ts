export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
}
