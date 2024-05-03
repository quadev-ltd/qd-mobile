import { type ReactNode, useState, useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Dimensions,
  Easing,
  Keyboard,
  Platform,
  ScrollView,
} from 'react-native';
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
  handleFacebookAction: () => void;
  handleGoogleAction: () => void;
  changePath: () => void;
  formHeight: number;
  children?: ReactNode;
  initiateManualSignIn?: boolean;
}

export const SSOAnimatedForm: React.FC<SSOAnimatedFormScreenProps> = ({
  screen,
  handleFacebookAction: handleFacebookLogin,
  handleGoogleAction: handleGoogleLogin,
  changePath,
  formHeight,
  children,
  initiateManualSignIn,
}) => {
  const [isSSO, setIsSSO] = useState(true);
  const { top, bottom } = useSafeAreaInsets();
  const safeAreaViewportHeight =
    VIEWPORT_HEIGHT - top - bottom - FooterPromptHeight - 12;
  const [translateY] = useState(new Animated.Value(safeAreaViewportHeight));
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
    Animated.timing(translateY, {
      toValue: translateYTo,
      duration: 500,
      delay: 0,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(onAnimationEnded);
  };

  const marginBottom = moveUpOnKeyboard.current - 80;

  return (
    <Layout>
      <SSOAnimatedHeader
        handleFacebookLogin={handleFacebookLogin}
        handleGoogleLogin={handleGoogleLogin}
        screen={screen}
        isSSOExpanded={isSSO}
        switchSSO={switchSSO}
        onAnimationEnded={animateFormShow}
        disableAnimation={disableAnimation}
        safeAreaViewportHeight={safeAreaViewportHeight}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={Platform.OS === 'ios' && isKeyboardVisible && { marginBottom }}
        contentContainerStyle={[
          styles.formContainer,
          !isKeyboardVisible && styles.srcollView,
        ]}>
        <Animated.View
          testID="form"
          style={[
            styles.form,
            {
              transform: [
                {
                  translateY: translateY,
                },
              ],
              opacity: translateY.interpolate({
                inputRange: [0, safeAreaViewportHeight],
                outputRange: [1, 0],
              }),
            },
          ]}>
          {children}
        </Animated.View>
      </ScrollView>
      <FooterPrompt changePath={changePath} screen={screen} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  srcollView: {
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
