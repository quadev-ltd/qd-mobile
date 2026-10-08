import { zodResolver } from '@hookform/resolvers/zod';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';

import { getPrefilledNames, useCompleteProfile } from './useCompleteProfile';

import CTA from '@/components/CTA';
import { HookFormDateInput } from '@/components/HookFormInputs/HookFormDateInput';
import { HookFormTextInput } from '@/components/HookFormInputs/HookFormTextInput';
import BrandedSubtitle from '@/components/SignIn/BrandedSubtitle';
import BrandedTitle from '@/components/SignIn/BrandedTitle';
import ErrorMessage from '@/components/SignIn/ErrorMessage';
import { FooterPrompt } from '@/components/SignIn/FooterPrompt';
import { Layout } from '@/components/SignIn/Layout';
import { ScreenType } from '@/components/SignIn/types';
import Spinner from '@/components/Spinner';
import { useAppSelector } from '@/core/state/hooks';
import { selectSession } from '@/core/state/selectors/session';
import {
  CompleteProfileFields,
  completeProfileSchema,
  type CompleteProfileSchemaType,
} from '@/schemas/completeProfileSchema';
import {
  type OnboardingParamList,
  type OnboardingScreen,
} from '@/screens/Routing/Onboarding/types';

export type CompleteProfileScreenProps = NativeStackScreenProps<
  OnboardingParamList,
  OnboardingScreen.CompleteProfile
>;

/** Shown when a signed-in user has no profile yet (e.g. Apple without a name, or a failed write). */
export const CompleteProfileScreen: React.FC<
  CompleteProfileScreenProps
> = () => {
  const { t } = useTranslation();
  const { user, providerNames, profile } = useAppSelector(selectSession);
  const prefilled = getPrefilledNames(user, providerNames, profile);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteProfileSchemaType>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      [CompleteProfileFields.firstName]: prefilled.firstName ?? '',
      [CompleteProfileFields.lastName]: prefilled.lastName ?? '',
      [CompleteProfileFields.dob]: '',
    },
  });
  const { save, isSaving, errorMessage, signOut } = useCompleteProfile(
    user?.uid,
  );

  const onSubmit = () => {
    Keyboard.dismiss();
    handleSubmit(save)();
  };

  return (
    <Layout>
      <BrandedTitle
        text={t('completeProfile.title')}
        accessibilityLabel={t('completeProfile.title')}
      />
      {isSaving ? (
        <Spinner />
      ) : (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.form}>
          <BrandedSubtitle
            text={t('completeProfile.subtitle')}
            accessibilityLabel={t('completeProfile.subtitle')}
          />
          <HookFormTextInput
            label={t('signUp.firstNameLabel')}
            accessibilityLabel={t('signUp.firstNameAccessibilityLabel')}
            name={CompleteProfileFields.firstName}
            control={control}
            error={errors[CompleteProfileFields.firstName]}
            onSubmitEditing={onSubmit}
          />
          <HookFormTextInput
            label={t('signUp.lastNameLabel')}
            accessibilityLabel={t('signUp.lastNameAccessibilityLabel')}
            name={CompleteProfileFields.lastName}
            control={control}
            error={errors[CompleteProfileFields.lastName]}
            onSubmitEditing={onSubmit}
          />
          <HookFormDateInput
            label={t('signUp.dobLabel')}
            accessibilityLabel={t('signUp.dobAccessibilityLabel')}
            name={CompleteProfileFields.dob}
            control={control}
            error={errors[CompleteProfileFields.dob]}
            onSubmitEditing={onSubmit}
          />
          {errorMessage ? (
            <ErrorMessage
              text={errorMessage}
              accessibilityLabel={errorMessage}
            />
          ) : null}
          <View style={styles.footerButton}>
            <CTA
              testID="complete-profile-cta"
              text={t('completeProfile.submitButton')}
              accessibilityLabel={t(
                'completeProfile.submitButtonAccessibilityLabel',
              )}
              onPress={onSubmit}
            />
          </View>
        </ScrollView>
      )}
      <FooterPrompt changePath={signOut} screen={ScreenType.CompleteProfile} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  form: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  footerButton: {
    marginBottom: 12,
    flex: 1,
    justifyContent: 'flex-end',
    alignContent: 'stretch',
  },
});

export default CompleteProfileScreen;
