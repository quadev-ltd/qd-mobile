import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { signOut } from '@/core/firebase/auth';
import { getErrorMessageKey, logFirebaseError } from '@/core/firebase/errors';
import {
  displayDateToIso,
  normaliseName,
  saveProfile,
} from '@/core/firebase/profile';
import {
  type ProviderNames,
  type SessionUser,
  type UserProfile,
} from '@/core/firebase/types';
import {
  CompleteProfileFields,
  type CompleteProfileSchemaType,
} from '@/schemas/completeProfileSchema';

/** Names to prefill: what Google/Apple sent at sign-in, else the account's display name. */
export const getPrefilledNames = (
  user: SessionUser | null,
  providerNames: ProviderNames | null,
  profile: UserProfile | null,
): ProviderNames => {
  const [displayFirst, ...displayRest] = (user?.displayName ?? '')
    .trim()
    .split(/\s+/);
  return {
    firstName:
      normaliseName(profile?.firstName) ??
      normaliseName(providerNames?.firstName) ??
      normaliseName(displayFirst),
    lastName:
      normaliseName(profile?.lastName) ??
      normaliseName(providerNames?.lastName) ??
      normaliseName(displayRest.join(' ')),
  };
};

/** Saves the profile; the session watcher then moves the user on to Home. */
export const useCompleteProfile = (uid: string | undefined) => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const save = async (formData: CompleteProfileSchemaType) => {
    if (!uid) {
      return;
    }
    setIsSaving(true);
    setErrorMessage(undefined);
    const dateOfBirth = formData[CompleteProfileFields.dob]?.trim();
    try {
      await saveProfile(uid, {
        firstName: formData[CompleteProfileFields.firstName].trim(),
        lastName: formData[CompleteProfileFields.lastName].trim(),
        ...(dateOfBirth ? { dateOfBirth: displayDateToIso(dateOfBirth) } : {}),
      });
    } catch (error) {
      logFirebaseError('saveProfile', error, uid);
      setErrorMessage(t(getErrorMessageKey(error)));
      setIsSaving(false);
    }
  };

  const signOutFromProfile = async () => {
    try {
      await signOut();
    } catch (error) {
      logFirebaseError('signOut', error, uid);
    }
  };

  return { save, isSaving, errorMessage, signOut: signOutFromProfile };
};
