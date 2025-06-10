import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const TransportIcon = (props: any) => (
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
    <Path d="M14 17H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1" />
    <Path d="M15 17H9" />
    <Path d="M20 17h1a2 2 0 0 0 2-2v-3.34a4 4 0 0 0-1.17-2.83L19 7h-5" />
    <Path d="M9 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    <Path d="M17 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
  </Svg>
);

export default TransportIcon;