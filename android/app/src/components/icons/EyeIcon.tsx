import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const EyeIcon = (props: any) => (
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
    <Path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
    <Path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
  </Svg>
);

export default EyeIcon;