import { CameraView, useCameraPermissions } from 'expo-camera';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import CTA from '@/components/CTA';
import Header from '@/components/Header';
import { MaterialIcon } from '@/components/MaterialIcon';
import Spinner from '@/components/Spinner';
import { colors } from '@/styles/colors';

export interface CameraProps {
  loadPhotoURI: (photoURI: string) => void;
}

const CameraComponent: React.FC<CameraProps> = ({ loadPhotoURI }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const permissionLoaded = permission != null;
  const hasPermission = permission?.granted ?? false;
  const [requestingPermissions, setRequestingPermissions] =
    useState<boolean>(false);
  const { t } = useTranslation();
  const camera = useRef<CameraView>(null);
  const { colors: themeColors } = useTheme();

  useEffect(() => {
    (async () => {
      if (permissionLoaded && !hasPermission) {
        setRequestingPermissions(true);
        await requestPermission();
        setRequestingPermissions(false);
      }
    })();
  }, [permissionLoaded, hasPermission, requestPermission]);

  const capturePhoto = async () => {
    if (camera.current) {
      const newPhoto = await camera.current.takePictureAsync();
      // Same value as before: a plain file path (the screen adds the file:// prefix).
      if (newPhoto) {
        loadPhotoURI(newPhoto.uri.replace(/^file:\/\//, ''));
      }
    }
  };

  const openPhotoLibrary = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: ['images'],
      selectionLimit: 1,
    });

    if (result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      if (selectedImage.uri) {
        loadPhotoURI(selectedImage.uri);
      }
    }
  };

  if (requestingPermissions) {
    return <Spinner color={themeColors.primary} />;
  }

  if (!hasPermission) {
    return (
      <Header
        title={t('detectAnomaly.noCamera')}
        titleAccessibilityLabel={t('detectAnomaly.noCamera')}
      />
    );
  }

  return (
    <>
      <CameraView
        ref={camera}
        style={StyleSheet.absoluteFill}
        facing="back"
        active={true}
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
