import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const PlusIcon = (props: any) => (
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
    <Path d="M12 5v14" />
    <Path d="M5 12h14" />
  </Svg>
);

export default PlusIcon;