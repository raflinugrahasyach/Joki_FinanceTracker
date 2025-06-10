import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ChartIcon = (props: any) => (
  <Svg
    width={28}
    height={28}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M3 3v18h18" />
    <Path d="m19 9-5 5-4-4-3 3" />
  </Svg>
);

export default ChartIcon;