import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { act } from 'react';
import { TouchableOpacity } from 'react-native';

import { type CameraProps } from './Camera';
import DetectAnomaliesScreen, {
  type DetecObjectScreenProps,
} from './DetectAnomaliesScreen';

import { useDetectAnomaly } from '@/core/api/hooks/useDetectAnomaly';
import { useKeyboardVisibility } from '@/hooks/useKeyboardVisibility';

jest.mock('./Camera', () => {
  const MockCamera = ({ loadPhotoURI }: CameraProps) => {
    return (
      <TouchableOpacity
        testID="mock-camera"
        onPress={() => loadPhotoURI('mock-photo-uri')}
      />
    );
  };
  MockCamera.displayName = 'MockCamera';
  return MockCamera;
});
jest.mock('@react-native-firebase/crashlytics', () => ({
  log: jest.fn(),
  recordError: jest.fn(),
}));
jest.mock('@react-native-firebase/auth', () => 'Auth');
jest.mock('@/core/api/hooks/useDetectAnomaly');
jest.mock('@/hooks/useKeyboardVisibility');
jest.mock('@/components/Spinner');

const navigationMock = {} as DetecObjectScreenProps;

describe('DetectAnomaliesScreen', () => {
  const mockSubmit = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useKeyboardVisibility as jest.Mock).mockReturnValue({ keyboardOffset: 0 });
  });

  it('shows the camera when no photo yet', () => {
    (useDetectAnomaly as jest.Mock).mockReturnValue({
      submitDetectAnomaly: mockSubmit,
      isLoading: false,
      isSuccess: false,
      reset: mockReset,
      data: undefined,
    });

    const { getByTestId } = render(
      <DetectAnomaliesScreen {...navigationMock} />,
    );

    expect(getByTestId('mock-camera')).toBeTruthy();
  });

  it('shows loading state when isLoading=true', async () => {
    (useDetectAnomaly as jest.Mock).mockReturnValue({
      submitDetectAnomaly: mockSubmit,
      isLoading: true,
      isSuccess: false,
      reset: mockReset,
      data: undefined,
    });

    const { getByText, getByTestId } = render(
      <DetectAnomaliesScreen {...navigationMock} />,
    );

    const camera = getByTestId('mock-camera');
    act(() => fireEvent.press(camera));

    await waitFor(() => {
      expect(getByText('detectAnomaly.analysing')).toBeTruthy();
    });
  });

  it('shows result when isSuccess && data', async () => {
    (useDetectAnomaly as jest.Mock).mockReturnValue({
      submitDetectAnomaly: mockSubmit,
      isLoading: false,
      isSuccess: true,
      reset: mockReset,
      data: { text: 'All good!' },
    });

    const { getByTestId, getByText } = render(
      <DetectAnomaliesScreen {...navigationMock} />,
    );

    const camera = getByTestId('mock-camera');
    act(() => fireEvent.press(camera));

    await waitFor(() => {
      const result = getByText('All good!');
      expect(result).toBeDefined();
    });
  });

  it('after camera “takes” a photo, bottom UI appears and CTA calls submitDetectAnomaly', async () => {
    (useDetectAnomaly as jest.Mock).mockReturnValue({
      submitDetectAnomaly: mockSubmit,
      isLoading: false,
      isSuccess: false,
      reset: mockReset,
      data: undefined,
    });

    const { getByTestId, getByText } = render(
      <DetectAnomaliesScreen {...navigationMock} />,
    );

    const camera = getByTestId('mock-camera');
    await act(async () => fireEvent.press(camera));

    const submitCTA = getByText('detectAnomaly.submitPhoto');
    await act(async () => fireEvent.press(submitCTA));
    await waitFor(() => {
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    const input = getByTestId('detectAnomaly.descriptionInputLabel');
    await act(async () => fireEvent.changeText(input, 'Test description'));

    await act(async () => fireEvent.press(submitCTA));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });
});
