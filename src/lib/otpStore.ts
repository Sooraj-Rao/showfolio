/* eslint-disable import/no-anonymous-default-export */
type SignupData = {
  name: string;
  email: string;
  password: string;
  otp: string;
  expires: number;
  attempts: number[];
};

const signupStore = new Map<string, SignupData>();

function setSignupData(email: string, data: Omit<SignupData, "attempts">) {
  const now = Date.now();
  const existing = signupStore.get(email);

  const updatedAttempts =
    existing?.attempts?.filter((t) => now - t < 5 * 60 * 1000) || [];

  updatedAttempts.push(now);

  signupStore.set(email, {
    ...data,
    attempts: updatedAttempts,
  });
}

function getSignupData(email: string): SignupData | undefined {
  return signupStore.get(email);
}

function canSendOtp(email: string): boolean {
  const data = signupStore.get(email);
  if (!data) return true;
  const now = Date.now();
  const recentAttempts = data.attempts.filter(
    (timestamp) => now - timestamp < 5 * 60 * 1000
  );
  return recentAttempts.length < 2;
}

export default {
  set: setSignupData,
  get: getSignupData,
  canSendOtp,
};
