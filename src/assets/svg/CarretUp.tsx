import Svg, { Path } from 'react-native-svg';

export const SvgCarretUp: React.FC = props => (
  <Svg width={48} height={48} viewBox="0 0 24 24" fill="none" {...props}>
    <Path stroke="#151515" d="m9 13.5 3-3 3 3" />
  </Svg>
);
