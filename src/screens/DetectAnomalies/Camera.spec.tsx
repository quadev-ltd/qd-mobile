import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useCameraPermissions, type CameraViewProps } from 'expo-camera';
import { launchImageLibraryAsync } from 'expo-image-picker';
// eslint-disable-next-line no-restricted-imports -- type-only, to type jest.requireActual('react')
import type * as ReactModule from 'react';

import CameraComponent from './Camera';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock('expo-camera', () => {
  const { forwardRef, useImperativeHandle, Fragment } =
    jest.requireActual<typeof ReactModule>('react');
  const CameraView = forwardRef<unknown, CameraViewProps>((props, ref) => {
    useImperativeHandle(ref, () => ({
      takePictureAsync: jest
        .fn()
        .mockResolvedValue({ uri: 'file://mock-photo-path' }),
    }));
    return <Fragment>{props.children}</Fragment>;
  });
  CameraView.displayName = 'MockCameraView';
  return {
    CameraView,
    useCameraPermissions: jest.fn(),
  };
});

describe('CameraComponent', () => {
  const mockRequestPermission = jest.fn();
  const mockLoadPhotoURI = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the no‐camera header and requests permission when none granted', async () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      { granted: false },
      mockRequestPermission.mockResolvedValue({ granted: false }),
    ]);

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
    (useCameraPermissions as jest.Mock).mockReturnValue([
      { granted: true },
      mockRequestPermission,
    ]);

    const { getByTestId } = render(
      <CameraComponent loadPhotoURI={mockLoadPhotoURI} />,
    );

    const takePhotoButton = getByTestId('take-photo');
    expect(takePhotoButton).toBeDefined();
    const photoLibraryButton = getByTestId('photo-library');
    expect(photoLibraryButton).toBeDefined();
  });

  it('calls loadPhotoURI with the camera path on take‐photo', async () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      { granted: true },
      mockRequestPermission,
    ]);

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
    (useCameraPermissions as jest.Mock).mockReturnValue([
      { granted: true },
      mockRequestPermission,
    ]);

    (launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      assets: [{ uri: 'library-image-uri' }],
    });

    const { getByTestId } = render(
      <CameraComponent loadPhotoURI={mockLoadPhotoURI} />,
    );

    const libraryButton = getByTestId('photo-library');

    fireEvent.press(libraryButton);

    await waitFor(() => {
      expect(launchImageLibraryAsync).toHaveBeenCalledWith({
        mediaTypes: ['images'],
        selectionLimit: 1,
      });
      expect(mockLoadPhotoURI).toHaveBeenCalledWith('library-image-uri');
    });
  });

  it('does not call loadPhotoURI if library returns no assets', async () => {
    (useCameraPermissions as jest.Mock).mockReturnValue([
      { granted: true },
      mockRequestPermission,
    ]);

    (launchImageLibraryAsync as jest.Mock).mockResolvedValue({ assets: [] });

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
