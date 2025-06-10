import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const GroceriesIcon = (props: any) => (
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
    <Path d="m15 11-1 9" />
    <Path d="m19 11-4-7" />
    <Path d="M2 11h20" />
    <Path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8c.9 0 1.8-.7 2-1.6L20.5 11" />
  </Svg>
);

export default GroceriesIcon;