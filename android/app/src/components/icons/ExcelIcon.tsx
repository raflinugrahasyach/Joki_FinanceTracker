import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ExcelIcon = (props: any) => (
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
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Path d="M14 2v6h6" />
    <Path d="m15.5 14-3 3 3 3" />
    <Path d="m9.5 14 3 3-3 3" />
  </Svg>
);

export default ExcelIcon;