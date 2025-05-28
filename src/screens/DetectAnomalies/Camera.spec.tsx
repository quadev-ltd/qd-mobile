import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { forwardRef, useImperativeHandle, Fragment } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  useCameraPermission,
  useCameraDevice,
  type CameraProps,
} from 'react-native-vision-camera';

import CameraComponent from './Camera';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}));

jest.mock('react-native-vision-camera', () => {
  const Camera = forwardRef<unknown, CameraProps>((props, ref) => {
    useImperativeHandle(ref, () => ({
      takePhoto: jest.fn().mockResolvedValue({ path: 'mock-photo-path' }),
    }));
    return <Fragment>{props.children}</Fragment>;
  });
  Camera.displayName = 'MockCamera';
  return {
    Camera,
    useCameraPermission: jest.fn(),
    useCameraDevice: jest.fn(),
  };
});

describe('CameraComponent', () => {
  const mockRequestPermission = jest.fn();
  const mockLoadPhotoURI = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the no‐camera header and requests permission when none granted', async () => {
    (useCameraPermission as jest.Mock).mockReturnValue({
      hasPermission: false,
      requestPermission: mockRequestPermission.mockResolvedValue(false),
    });
    (useCameraDevice as jest.Mock).mockReturnValue(null);

    const { getByText } = render(
      <CameraComponent loadPhotoURI={mockLoadPhotoURI} />,
    );

    await waitFor(() => {
      expect(mockRequestPermission).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(getByText('detectAnomaly.noCamera')).toBeTruthy();
      expect(mockLoadPhotoURI).not.toHaveBeenCalled();
    });
  });

  it('renders camera preview and CTAs when permission granted and device ready', () => {
    (useCameraPermission as jest.Mock).mockReturnValue({
      hasPermission: true,
      requestPermission: mockRequestPermission,
    });
    (useCameraDevice as jest.Mock).mockReturnValue({ id: 'back' });

    const { getByTestId } = render(
      <CameraComponent loadPhotoURI={mockLoadPhotoURI} />,
    );

    const takePhotoButton = getByTestId('take-photo');
    expect(takePhotoButton).toBeDefined();
    const photoLibraryButton = getByTestId('photo-library');
    expect(photoLibraryButton).toBeDefined();
  });

  it('calls loadPhotoURI with the camera path on take‐photo', async () => {
    (useCameraPermission as jest.Mock).mockReturnValue({
      hasPermission: true,
      requestPermission: mockRequestPermission,
    });
    (useCameraDevice as jest.Mock).mockReturnValue({ id: 'back' });

    const { getByTestId } = render(
      <CameraComponent loadPhotoURI={mockLoadPhotoURI} />,
    );

    const captureButton = getByTestId('take-photo');
    fireEvent.press(captureButton);

    await waitFor(() => {
      expect(mockLoadPhotoURI).toHaveBeenCalledWith('mock-photo-path');
    });
  });

  it('opens library and calls loadPhotoURI with selected image URI', async () => {
    (useCameraPermission as jest.Mock).mockReturnValue({
      hasPermission: true,
      requestPermission: mockRequestPermission,
    });
    (useCameraDevice as jest.Mock).mockReturnValue({ id: 'back' });

    (launchImageLibrary as jest.Mock).mockResolvedValue({
      assets: [{ uri: 'library-image-uri' }],
    });

    const { getByTestId } = render(
      <CameraComponent loadPhotoURI={mockLoadPhotoURI} />,
    );

    const libraryButton = getByTestId('photo-library');

    fireEvent.press(libraryButton);

    await waitFor(() => {
      expect(launchImageLibrary).toHaveBeenCalledWith({
        mediaType: 'photo',
        selectionLimit: 1,
      });
      expect(mockLoadPhotoURI).toHaveBeenCalledWith('library-image-uri');
    });
  });

  it('does not call loadPhotoURI if library returns no assets', async () => {
    (useCameraPermission as jest.Mock).mockReturnValue({
      hasPermission: true,
      requestPermission: mockRequestPermission,
    });
    (useCameraDevice as jest.Mock).mockReturnValue({ id: 'back' });

    (launchImageLibrary as jest.Mock).mockResolvedValue({ assets: [] });

    const { getByTestId } = render(
      <CameraComponent loadPhotoURI={mockLoadPhotoURI} />,
    );

    const libraryButton = getByTestId('photo-library');

    fireEvent.press(libraryButton);

    await waitFor(() => {
      expect(mockLoadPhotoURI).not.toHaveBeenCalled();
    });
  });
});
