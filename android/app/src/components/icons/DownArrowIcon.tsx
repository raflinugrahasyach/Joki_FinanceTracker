import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const DownArrowIcon = (props: any) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="m6 9 6 6 6-6" />
  </Svg>
);

export default DownArrowIcon;