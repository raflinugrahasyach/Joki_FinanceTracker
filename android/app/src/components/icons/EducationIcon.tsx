import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const EducationIcon = (props: any) => (
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
    <Path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <Path d="M6 12v5c0 5 4 5 6 5s6-1 6-5v-5" />
  </Svg>
);

export default EducationIcon;