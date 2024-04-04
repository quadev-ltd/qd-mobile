import { useState } from 'react';

import { AnimatedCTA } from '../AnimatedCTA';

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
    />
  );
};
