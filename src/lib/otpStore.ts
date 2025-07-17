type TempSignupData = {
  name: string;
  email: string;
  password: string; 
  otp: string;
  expires: number;
};

const signupStore = new Map<string, TempSignupData>();

export default signupStore;
