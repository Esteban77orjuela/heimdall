const React = require('react');
const { Text } = require('react-native');

const MockIcon = ({ name, size, color, testID }) =>
  React.createElement(Text, { testID: testID || `icon-${name}` }, name || '');

module.exports = {
  MaterialCommunityIcons: MockIcon,
  Ionicons: MockIcon,
  FontAwesome: MockIcon,
  FontAwesome5: MockIcon,
  AntDesign: MockIcon,
  Feather: MockIcon,
  MaterialIcons: MockIcon,
  Entypo: MockIcon,
  createIconSet: () => MockIcon,
};
