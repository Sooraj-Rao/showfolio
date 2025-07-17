type SignupData = {
  name: string;
  email: string;
  password: string;
  otp: string;
  expires: number;
};

const store = new Map<string, SignupData>();

const signupStore = {
  set(email: string, data: SignupData) {
    store.set(email, data);
  },

  get(email: string): SignupData | null {
    const data = store.get(email);

    if (!data) return null;

    // Check if OTP has expired
    if (Date.now() > data.expires) {
      store.delete(email); // remove expired entry
      return null;
    }

    return data;
  },

  has(email: string) {
    return store.has(email);
  },

  delete(email: string) {
    store.delete(email);
  },
};

export default signupStore;
