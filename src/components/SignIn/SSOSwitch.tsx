import { useState } from 'react';
import { useTheme } from 'react-native-paper';

import CTA from '../CTA';
import { MaterialIcon } from '../MaterialIcon';

import { Divider } from './Divider';

type SSOSwitchProps = {
  isSSOExpanded: boolean;
  dividerLabel: string;
  emailButtonLabel: string;
  onPressSSO: () => void;
  onAnimationEnded?: () => void;
  disableAnimation?: boolean;
};

export const SSOSwitch: React.FC<SSOSwitchProps> = ({
  isSSOExpanded,
  dividerLabel,
  emailButtonLabel,
  onPressSSO,
  onAnimationEnded,
  disableAnimation,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(disableAnimation);
  const handleAnimationEnded = () => {
    if (isSSOExpanded !== isExpanded) {
      setIsExpanded(isSSOExpanded);
    } else {
      onAnimationEnded && onAnimationEnded();
    }
  };
  return !isExpanded ? (
    <Divider
      label={dividerLabel}
      onPress={onPressSSO}
      hide={isSSOExpanded}
      onAnimationEnded={handleAnimationEnded}
    />
  ) : (
    <CTA
      isAnimated={true}
      text={emailButtonLabel}
      accessibilityLabel={emailButtonLabel}
      testID="email-cta"
      onPress={onPressSSO}
      hide={!isSSOExpanded}
      onAnimationEnded={handleAnimationEnded}
      disableAnimation={disableAnimation}
      Icon={
        <MaterialIcon name="email" size={28} color={theme.colors.onSecondary} />
      }
    />
  );
};
