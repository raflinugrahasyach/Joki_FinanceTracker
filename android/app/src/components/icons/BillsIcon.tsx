import * as React from 'react';
import Svg, { Path, Polyline } from 'react-native-svg';

const BillsIcon = (props: any) => (
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
    <Path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <Polyline points="14 2 14 8 20 8" />
    <Path d="M12 18h-1v-6h1" />
    <Path d="M11 15h.01" />
  </Svg>
);

export default BillsIcon;