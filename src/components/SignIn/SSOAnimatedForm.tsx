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
import { useKeyboardVisibility } from '@/hooks/useKeyboardVisibility';

const { height: VIEWPORT_HEIGHT } = Dimensions.get('window');

export interface SSOAnimatedFormScreenProps {
  screen: ScreenType;
  changePath: () => void;
  formHeight: number;
  children?: ReactNode;
  initiateManualSignIn?: boolean;
  setFocusOnManualFormShow?: () => void;
}

export const SSOAnimatedForm: React.FC<SSOAnimatedFormScreenProps> = ({
  screen,
  changePath,
  formHeight,
  children,
  initiateManualSignIn,
  setFocusOnManualFormShow,
}) => {
  const [isSSO, setIsSSO] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { top, bottom } = useSafeAreaInsets();
  const safeAreaViewportHeight =
    VIEWPORT_HEIGHT - top - bottom - FooterPromptHeight - 12;
  const translateY = useSharedValue(safeAreaViewportHeight);
  const [disableAnimation, setDisableAnimation] = useState(true);
  const shouldSetInitialFocus = useRef(true);

  const { isKeyboardVisible, keyboardOffset } = useKeyboardVisibility([
    formHeight,
    safeAreaViewportHeight,
  ]);

  useEffect(() => {
    if (initiateManualSignIn) {
      switchSSO();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchSSO = () => {
    disableAnimation && setDisableAnimation(false);
    !isSSO ? animateFormHide() : setIsSSO(!isSSO);
    shouldSetInitialFocus.current = isSSO;
  };

  const animateFormHide = () => {
    !isSSO &&
      animateTranslation(safeAreaViewportHeight, () => {
        setIsSSO(!isSSO);
        Keyboard.dismiss();
      });
  };

  const animateFormShow = () => {
    !isSSO &&
      animateTranslation(0, () => {
        const isAndroidAndShouldSetInitialFocus =
          Platform.OS === 'android' &&
          shouldSetInitialFocus.current &&
          setFocusOnManualFormShow;
        isAndroidAndShouldSetInitialFocus && setFocusOnManualFormShow();
        shouldSetInitialFocus.current = false;
      });
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

  const marginBottom = keyboardOffset.current - 80;

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
