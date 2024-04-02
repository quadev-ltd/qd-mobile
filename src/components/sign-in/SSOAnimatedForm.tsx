import { type ReactNode, useState, useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';

import { FooterPrompt } from '@/components/sign-in/FooterPrompt';
import { Layout } from '@/components/sign-in/Layout';
import { SSOHeader } from '@/components/sign-in/SSOHeader';
import { type ScreenType } from '@/components/sign-in/types';

const { height: VIEWPORT_HEIGHT } = Dimensions.get('window');

export interface SSOAnimatedFormScreenProps {
  screen: ScreenType;
  handleFacebookAction: () => void;
  handleGoogleAction: () => void;
  changePath: () => void;
  moveUpOnKeyboard?: number;
  children: ReactNode;
}

export const SSOAnimatedForm: React.FC<SSOAnimatedFormScreenProps> = ({
  screen,
  handleFacebookAction: handleFacebookLogin,
  handleGoogleAction: handleGoogleLogin,
  changePath,
  moveUpOnKeyboard,
  children,
}) => {
  const [isSSO, setIsSSO] = useState(true);
  const [translateY] = useState(new Animated.Value(VIEWPORT_HEIGHT));
  const [isInitialAnimation, setIsInitialAnimation] = useState(true);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        moveUpOnKeyboard && setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        moveUpOnKeyboard && setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [moveUpOnKeyboard]);

  const switchSSO = () => {
    isInitialAnimation && setIsInitialAnimation(false);
    !isSSO ? animateFormHide(() => setIsSSO(!isSSO)) : setIsSSO(!isSSO);
  };
  const animateFormHide = (onAnimationEnded?: () => void) => {
    !isSSO && animateTranslation(VIEWPORT_HEIGHT, onAnimationEnded);
  };
  const animateFormShow = () => {
    !isSSO && animateTranslation(0);
  };
  const animateTranslation = (
    translateYTo: number,
    onAnimationEnded?: () => void,
  ) => {
    Animated.timing(translateY, {
      toValue: translateYTo,
      duration: 500,
      delay: 0,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(onAnimationEnded);
  };
  return (
    <Layout>
      <SSOHeader
        handleFacebookLogin={handleFacebookLogin}
        handleGoogleLogin={handleGoogleLogin}
        screen={screen}
        isSSOExpanded={isSSO}
        switchSSO={switchSSO}
        onAnimationEnded={animateFormShow}
        isInitialAnimation={isInitialAnimation}
      />
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.keyboardAvoidingContainer}>
        <Animated.View
          style={[
            styles.form,
            {
              transform: [
                {
                  translateY: translateY,
                },
              ],
              opacity: translateY.interpolate({
                inputRange: [0, VIEWPORT_HEIGHT],
                outputRange: [1, 0],
              }),
            },
            isKeyboardVisible && { marginTop: -(moveUpOnKeyboard ?? 0) },
          ]}>
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
      <FooterPrompt changePath={changePath} screen={screen} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  form: {
    flex: 1,
    marginTop: 32,
    alignItems: 'stretch',
    overflow: 'hidden',
  },
});
