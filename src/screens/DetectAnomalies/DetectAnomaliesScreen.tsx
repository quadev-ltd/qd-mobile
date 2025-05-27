import { zodResolver } from '@hookform/resolvers/zod';
import { type DrawerScreenProps } from '@react-navigation/drawer';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import AnalysisResult from './AnalysisResult';
import Camera from './Camera';
import ScreenLayout from './ScreenLayout';

import CTA from '@/components/CTA';
import { HookFormTextInput } from '@/components/HookFormInputs/HookFormTextInput';
import { MaterialIcon } from '@/components/MaterialIcon';
import Subtitle from '@/components/Subtitle';
import { useDetectAnomaly } from '@/core/api/hooks/useDetectAnomaly';
import { useKeyboardVisibility } from '@/hooks/useKeyboardVisibility';
import {
  DetectAnomalyFields,
  detectAnomalySchema,
  type DetectAnomalySchemaType,
} from '@/schemas/detectAnomalySchema';
import {
  type DrawerParamList,
  type PrivateScreen,
} from '@/screens/Routing/Private/types';

export type DetecObjectScreenProps = DrawerScreenProps<
  DrawerParamList,
  PrivateScreen.DetectObject
>;

const DetectAnomaliesScreen: React.FC<DetecObjectScreenProps> = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DetectAnomalySchemaType>({
    resolver: zodResolver(detectAnomalySchema),
  });
  const photoURI = watch(DetectAnomalyFields.photo);
  const [retakePhoto, setRetakePhoto] = useState<boolean>(false);
  const { t } = useTranslation();
  const { colors: themeColors } = useTheme();
  const { submitDetectAnomaly, isLoading, isSuccess, reset, data } =
    useDetectAnomaly();

  const { keyboardOffset } = useKeyboardVisibility([]);

  const takeAnotherPhoto = () => {
    Keyboard.dismiss();
    setRetakePhoto(true);
  };

  const closeCamera = () => {
    setRetakePhoto(false);
  };

  const handleDetectAnomaly = () => {
    Keyboard.dismiss();
    handleSubmit(submitDetectAnomaly)();
  };

  const goBack = () => {
    reset();
  };

  const renderCamera = () => (
    <ScreenLayout isSubmitting={false}>
      {retakePhoto && (
        <TouchableOpacity style={styles.closeCamera} onPress={closeCamera}>
          <MaterialIcon
            name="close"
            size={40}
            color={themeColors.onBackground}
          />
        </TouchableOpacity>
      )}
      <View
        style={[
          styles.cameraContainer,
          { backgroundColor: themeColors.background },
        ]}>
        <Controller
          control={control}
          name={DetectAnomalyFields.photo}
          render={({ field: { onChange } }) => (
            <Camera
              loadPhotoURI={photo => {
                onChange(photo);
                setRetakePhoto(false);
              }}
            />
          )}
        />
      </View>
    </ScreenLayout>
  );

  const renderLoading = () => <ScreenLayout isSubmitting={true} />;

  const renderResult = () => (
    <AnalysisResult text={data?.text as string} goBack={goBack} />
  );

  if (!photoURI || retakePhoto) {
    return renderCamera();
  }

  if (isLoading) {
    return renderLoading();
  }

  if (isSuccess && data) {
    return renderResult();
  }

  return (
    <ScreenLayout isSubmitting={false} keyboardOffset={keyboardOffset}>
      <View
        style={[
          styles.takenPhoto,
          {
            borderColor: themeColors.onBackground,
            backgroundColor: themeColors.background,
          },
        ]}>
        <TouchableOpacity
          onPress={takeAnotherPhoto}
          style={styles.takeAnotherPhotoCTA}>
          <Image
            source={{ uri: `file://${photoURI}` }}
            style={[StyleSheet.absoluteFill, styles.photoImage]}
          />
          <MaterialIcon
            style={styles.takeAnotherPhotoIcon}
            name="camera-retake"
            size={28}
            color={themeColors.background}
          />
        </TouchableOpacity>
      </View>
      <Subtitle
        text={t('detectAnomaly.addDescription')}
        accessibilityLabel={t('detectAnomaly.addDescriptionAccessibilityLabel')}
      />
      <View style={styles.footer}>
        <HookFormTextInput
          error={errors[DetectAnomalyFields.description]}
          control={control}
          label={t('detectAnomaly.descriptionInputLabel')}
          accessibilityLabel={t(
            'detectAnomaly.descriptionInputAccessibilityLabel',
          )}
          name={DetectAnomalyFields.description}
          containerStyle={styles.textAreaContainer}
          style={styles.textArea}
          numberOfLines={5}
          multiline
          textAlignVertical="top"
        />
        <CTA
          text={t('detectAnomaly.submitPhoto')}
          accessibilityLabel={t('detectAnomaly.submitPhotoAccessibilityLabel')}
          onPress={handleDetectAnomaly}
        />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    paddingTop: 20,
    paddingHorizontal: 24,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
  },
  closeCamera: {
    zIndex: 10,
    position: 'absolute',
    top: 8,
    right: 16,
  },
  takenPhoto: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    borderWidth: 2,
    borderRadius: 8,
    position: 'relative',
    marginBottom: 32,
    marginTop: 8,
  },
  photoImage: {
    borderRadius: 8,
  },
  takeAnotherPhotoIcon: {
    bottom: 8,
    right: 8,
    position: 'absolute',
  },
  takeAnotherPhotoCTA: {
    flex: 1,
  },
  textAreaContainer: {
    flex: 1,
  },
  textArea: {
    height: '100%',
  },
  footer: {
    flex: 1,
    flexDirection: 'column',
  },
});

export default DetectAnomaliesScreen;
