import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const UserIcon = (props: any) => (
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
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Path d="M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
  </Svg>
);

export default UserIcon;