import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AnimatedCTA } from '../AnimatedCTA';

import { Divider } from './Divider';

import { colors } from '@/styles';

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
    <AnimatedCTA
      text={emailButtonLabel}
      accessibilityLabel={emailButtonLabel}
      testID="email-cta"
      onPress={onPressSSO}
      hide={!isSSOExpanded}
      onAnimationEnded={handleAnimationEnded}
      disableAnimation={disableAnimation}
      Icon={<Icon name="email" size={28} color={colors.white} />}
    />
  );
};
