// Jest mock for the React Native Firebase v26 modular Functions API.
const mockFunctions = { region: 'europe-west1' };

export const getFunctions = jest.fn(() => mockFunctions);
export const connectFunctionsEmulator = jest.fn();
export const httpsCallable = jest.fn(() => jest.fn());
