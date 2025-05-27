import { useEffect, useRef, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

export const useKeyboardVisibility = (deps: unknown[]) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const isKeyboardVisibleRef = useRef<boolean>(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const keyboardOffsetRef = useRef<number>(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      event => {
        if (!isKeyboardVisibleRef.current) isKeyboardVisibleRef.current = true;
        keyboardOffsetRef.current = event.endCoordinates.height;
        setKeyboardVisibility();
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        keyboardOffsetRef.current = 0;
        if (isKeyboardVisibleRef.current) isKeyboardVisibleRef.current = false;
        setKeyboardVisibility();
      },
    );

    const setKeyboardVisibility = () => {
      setKeyboardVisible(isKeyboardVisibleRef.current);
      setKeyboardOffset(keyboardOffsetRef.current);
    };

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [deps]);

  return { isKeyboardVisible, keyboardOffset };
};
