import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';

import { colors } from '@/styles/common';

interface SvgGoogleProps {
  color?: string;
}

export const SvgGoogle: React.FC<SvgGoogleProps> = props => (
  <Svg width={24} height={24} viewBox="0 0 48 48" fill="none" {...props}>
    <G fill={props.color || colors.white} clipPath="url(#google_svg__a)">
      <Path d="M24 19.636v9.295h12.916c-.567 2.989-2.27 5.52-4.822 7.222l7.79 6.043c4.537-4.188 7.155-10.341 7.155-17.65 0-1.702-.152-3.339-.436-4.91zM10.55 28.568l-1.757 1.345-6.219 4.843C6.524 42.59 14.617 48 24 48c6.48 0 11.913-2.138 15.884-5.803l-7.79-6.044c-2.138 1.44-4.865 2.313-8.094 2.313-6.24 0-11.541-4.211-13.44-9.884z" />
      <Path d="M2.574 13.244A23.7 23.7 0 0 0 0 24c0 3.883.938 7.527 2.574 10.756 0 .022 7.986-6.196 7.986-6.196A14.4 14.4 0 0 1 9.796 24c0-1.593.284-3.12.764-4.56zM24 9.556c3.534 0 6.676 1.222 9.185 3.579l6.873-6.873C35.89 2.378 30.48 0 24 0 14.618 0 6.523 5.39 2.574 13.244l7.986 6.196c1.898-5.673 7.2-9.884 13.44-9.884" />
    </G>
    <Defs>
      <ClipPath id="google_svg__a">
        <Path fill={props.color || colors.white} d="M0 0h48v48H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
