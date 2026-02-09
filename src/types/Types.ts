export type User = {
  id: string;
  userId: string;
  name: string;
  role: string;
  subrole: string;
  phone: string;
  joiningDate: string;
  endDate: string;
  lastActive: string;
  payment: boolean;
};

export type LoginPayload = {
  userId: string;
  password: string;
};

export type LoginResponse = {
  status: string;
  message: string;
  data: {
    token: string;
    user: User;
  };
};

export type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
};
