type SignupData = {
  name: string;
  email: string;
  password: string;
  otp: string;
  expires: number;
  attempts: number;
};

const otpMap = new Map<string, SignupData>();

const signupStore = {
  set(email: string, data: Omit<SignupData, "attempts">) {
    otpMap.set(email, { ...data, attempts: 0 });
  },

  get(email: string): SignupData | undefined {
    return otpMap.get(email);
  },

  canSendOtp(email: string): boolean {
    const entry = otpMap.get(email);
    if (!entry) return true;

    if (entry.attempts >= 2) return false;

    if (Date.now() > entry.expires) {
      otpMap.delete(email);
      return true;
    }

    return true;
  },

  incrementAttempts(email: string) {
    const entry = otpMap.get(email);
    if (entry) {
      entry.attempts += 1;
      otpMap.set(email, entry);
    }
  },

  delete(email: string) {
    otpMap.delete(email);
  },
};

export default signupStore;
