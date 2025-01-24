import {
  useRoute,
  useNavigation,
  type RouteProp,
} from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect } from 'react';
import { type UseFormReset } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import { showUnexpectedErrorToast } from '@/components/Toast';
import { useGetUserProfileQuery } from '@/core/api';
import logger from '@/core/logger';
import { useAppDispatch } from '@/core/state/hooks';
import { logout } from '@/core/state/slices/authSlice';
import { AccountStatus } from '@/core/state/slices/types';
import {
  setProfileDetails,
  setUserVerified,
} from '@/core/state/slices/userSlice';
import {
  PublicScreen,
  type StackParamList,
} from '@/screens/Routing/Public/types';

type NavigationProps =
  | NativeStackNavigationProp<StackParamList, PublicScreen.SignIn, undefined>
  | NativeStackNavigationProp<
      StackParamList,
      PublicScreen.VerifyEmail,
      undefined
    >;

type RouteProps =
  | RouteProp<StackParamList, PublicScreen.SignIn>
  | RouteProp<StackParamList, PublicScreen.VerifyEmail>;

export const useLoadUserProfile = (
  authToken: string | undefined,
  onError?: UseFormReset<{
    email: string;
    password: string;
  }>,
  isVerified?: boolean,
) => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { data, isSuccess, isError, isLoading, isFetching } =
    useGetUserProfileQuery(!authToken ? skipToken : undefined, {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });
  useEffect(() => {
    if (isVerified && data) {
      dispatch(setUserVerified());
    }
  }, [isVerified, data, dispatch]);

  useEffect(() => {
    // Handle get profile success
    if (isSuccess && data) {
      if (data.user.accountStatus === AccountStatus.Verified && !authToken) {
        dispatch(logout());
        logger().logError(Error('Tokens must not be undefined at this stage.'));
        showUnexpectedErrorToast(t);
        return;
      }
      dispatch(setProfileDetails(data.user));
      if (
        data.user.accountStatus === AccountStatus.Unverified &&
        route.name === PublicScreen.SignIn
      ) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: PublicScreen.VerifyEmail,
              params: {
                firstName: data.user.firstName,
                userID: data.user.userID,
              },
            },
          ],
        });
        return;
      }
      if (isVerified) {
        dispatch(setUserVerified());
        return;
      }
      !(
        data.user.accountStatus === AccountStatus.Verified ||
        data.user.accountStatus === AccountStatus.Unverified
      ) &&
        logger().logError(
          Error(`Unknown account status ${data.user.accountStatus}`),
        );
    }
  }, [
    isSuccess,
    data,
    authToken,
    isVerified,
    dispatch,
    navigation,
    route.name,
    t,
  ]);

  useEffect(() => {
    // Handle get profile errors
    if (isError || (isSuccess && !data)) {
      logger().logError(Error('Failed to get user profile'));
      Toast.show({
        type: 'error',
        text1: t('error.unexpectedErrorTitle'),
        text2: t('error.unexpectedErrorMessage'),
        position: 'bottom',
      });
      dispatch(logout());
      onError && onError();
      if (route.name !== PublicScreen.SignIn) {
        navigation.replace(PublicScreen.SignIn, {});
      }
    }
  }, [isSuccess, isError, onError, data, dispatch, navigation, route.name, t]);

  return isLoading || isFetching || isSuccess;
};
