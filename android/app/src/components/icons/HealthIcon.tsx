import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const HealthIcon = (props: any) => (
  <Svg
    width={32}
    height={32}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <Path d="M3.22 12H9.5l.7-1.5L11.5 14l1.5-2.5L14.5 12H21" />
  </Svg>
);

export default HealthIcon;