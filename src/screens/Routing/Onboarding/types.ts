/** Screens for a signed-in user who cannot use the app yet (see SessionStatus). */
export enum OnboardingScreen {
  VerifyEmail = 'VerifyEmail',
  CompleteProfile = 'CompleteProfile',
}

export type OnboardingParamList = {
  [OnboardingScreen.VerifyEmail]: { applicationName: string };
  [OnboardingScreen.CompleteProfile]: undefined;
};
