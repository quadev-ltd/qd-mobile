import { type ReactNode, useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  FooterPrompt,
  FooterPromptHeight,
} from '@/components/SignIn/FooterPrompt';
import { Layout } from '@/components/SignIn/Layout';
import { SSOAnimatedHeader } from '@/components/SignIn/SSOAnimatedHeader';
import { type ScreenType } from '@/components/SignIn/types';

const { height: VIEWPORT_HEIGHT } = Dimensions.get('window');

export interface SSOAnimatedFormScreenProps {
  screen: ScreenType;
  changePath: () => void;
  formHeight: number;
  children?: ReactNode;
  initiateManualSignIn?: boolean;
}

export const SSOAnimatedForm: React.FC<SSOAnimatedFormScreenProps> = ({
  screen,
  changePath,
  formHeight,
  children,
  initiateManualSignIn,
}) => {
  const [isSSO, setIsSSO] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { top, bottom } = useSafeAreaInsets();
  const safeAreaViewportHeight =
    VIEWPORT_HEIGHT - top - bottom - FooterPromptHeight - 12;
  const translateY = useSharedValue(safeAreaViewportHeight);
  const [disableAnimation, setDisableAnimation] = useState(true);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const isKeyboardVisibleRef = useRef<boolean>(false);
  const moveUpOnKeyboard = useRef<number>(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      event => {
        if (!isKeyboardVisibleRef.current) isKeyboardVisibleRef.current = true;
        moveUpOnKeyboard.current = event.endCoordinates.height;
        setKeyboardVisibility();
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        moveUpOnKeyboard.current = 0;
        if (isKeyboardVisibleRef.current) isKeyboardVisibleRef.current = false;
        setKeyboardVisibility();
      },
    );

    const setKeyboardVisibility = () => {
      setKeyboardVisible(isKeyboardVisibleRef.current);
    };

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [formHeight, safeAreaViewportHeight]);

  useEffect(() => {
    if (initiateManualSignIn) {
      switchSSO();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchSSO = () => {
    disableAnimation && setDisableAnimation(false);
    !isSSO
      ? animateFormHide(() => {
          setIsSSO(!isSSO);
          Keyboard.dismiss();
        })
      : setIsSSO(!isSSO);
  };

  const animateFormHide = (onAnimationEnded?: () => void) => {
    !isSSO && animateTranslation(safeAreaViewportHeight, onAnimationEnded);
  };

  const animateFormShow = () => {
    !isSSO && animateTranslation(0);
  };

  const animateTranslation = (
    translateYTo: number,
    onAnimationEnded?: () => void,
  ) => {
    translateY.value = withTiming(
      translateYTo,
      {
        duration: 500,
        easing: Easing.out(Easing.ease),
      },
      isFinished => {
        if (isFinished && onAnimationEnded) {
          runOnJS(onAnimationEnded)();
        }
      },
    );
  };

  const marginBottom = moveUpOnKeyboard.current - 80;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: translateY.value === safeAreaViewportHeight ? 0 : 1,
    };
  }, [translateY, safeAreaViewportHeight]);

  return (
    <Layout>
      <SSOAnimatedHeader
        screen={screen}
        isSSOExpanded={isSSO}
        switchSSO={switchSSO}
        onAnimationEnded={animateFormShow}
        disableAnimation={disableAnimation}
        safeAreaViewportHeight={safeAreaViewportHeight}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={Platform.OS === 'ios' && isKeyboardVisible && { marginBottom }}
        contentContainerStyle={[
          styles.formContainer,
          !isKeyboardVisible && styles.scrollView,
        ]}>
        <Animated.View testID="form" style={[styles.form, animatedStyle]}>
          {children}
        </Animated.View>
      </ScrollView>
      {!isLoading && <FooterPrompt changePath={changePath} screen={screen} />}
    </Layout>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  form: {
    flex: 1,
    marginTop: 24,
    alignItems: 'stretch',
    overflow: 'hidden',
  },
  formContainer: {
    paddingHorizontal: 16,
  },
});
