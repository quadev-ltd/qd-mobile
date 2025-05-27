import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import {
  type ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import { useTheme } from 'react-native-paper';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

import CTA from '@/components/CTA';
import Header from '@/components/Header';
import { MaterialIcon } from '@/components/MaterialIcon';
import { colors } from '@/styles/colors';

export interface CameraProps {
  loadPhotoURI: (photoURI: string) => void;
}

const CameraComponent: React.FC<CameraProps> = ({ loadPhotoURI }) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [granted, setGranted] = useState<boolean>(hasPermission);
  const { t } = useTranslation();
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const { colors: themeColors } = useTheme();

  useEffect(() => {
    (async () => {
      if (!hasPermission) {
        setGranted(await requestPermission());
      }
    })();
  }, [hasPermission, requestPermission]);

  const capturePhoto = async () => {
    if (camera.current) {
      const newPhoto = await camera.current.takePhoto();
      loadPhotoURI(newPhoto.path);
    }
  };

  const openPhotoLibrary = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
    };

    const result = await launchImageLibrary(options);

    if (result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      if (selectedImage.uri) {
        loadPhotoURI(selectedImage.uri);
      }
    }
  };

  if (device == null || !granted) {
    return (
      <Header
        title={t('detectAnomaly.noCamera')}
        titleAccessibilityLabel={t('detectAnomaly.noCamera')}
      />
    );
  }

  return (
    <>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
      <View style={styles.takePhotoCTAContainer}>
        <View style={styles.photoFrame} />
        <View style={styles.cameraCTAsContainer}>
          <CTA
            testID="take-photo"
            accessibilityLabel={t('detectAnomaly.takePhotoAccessibilityLabel')}
            onPress={capturePhoto}
            Icon={
              <MaterialIcon
                name="camera"
                size={28}
                color={themeColors.onPrimary}
              />
            }
          />
          <CTA
            testID="photo-library"
            containerStyle={styles.photoLibraryCTA}
            accessibilityLabel={t('detectAnomaly.takePhotoAccessibilityLabel')}
            onPress={openPhotoLibrary}
            Icon={
              <MaterialIcon
                name="image-multiple"
                size={28}
                color={themeColors.onPrimary}
              />
            }
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  photoFrame: {
    flex: 1,
    borderColor: colors.white,
    borderWidth: 3,
    marginTop: 20,
    marginBottom: 44,
    borderStyle: 'dashed',
  },
  takePhotoCTAContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
  },
  cameraCTAsContainer: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  photoLibraryCTA: {
    right: 0,
    position: 'absolute',
  },
});

export default CameraComponent;
