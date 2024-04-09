import Svg, { Path } from 'react-native-svg';

import { colors } from '@/styles';

interface SvgFacebookProps {
  color?: string;
}

export const SvgFacebook: React.FC<SvgFacebookProps> = props => (
  <Svg width={24} height={24} viewBox="0 0 50 49" fill="none" {...props}>
    <Path
      fill={props.color || colors.white}
      d="M49.172 24.222C49.172 10.886 38.36.076 25.025.076S.88 10.886.88 24.222c0 12.052 8.83 22.042 20.373 23.853V31.202h-6.13v-6.98h6.13v-5.32c0-6.051 3.605-9.394 9.12-9.394 2.642 0 5.406.472 5.406.472v5.942h-3.045c-3 0-3.935 1.861-3.935 3.77v4.53h6.697l-1.07 6.98h-5.627v16.873c11.544-1.811 20.374-11.8 20.374-23.853"
    />
  </Svg>
);
