jest.mock(
  '@react-native-async-storage/async-storage',
  () => {
    const values = new Map<string, string>();

    return {
      __esModule: true,
      default: {
        clear: jest.fn(async () => {
          values.clear();
        }),
        getItem: jest.fn(async (key: string) => values.get(key) ?? null),
        removeItem: jest.fn(async (key: string) => {
          values.delete(key);
        }),
        setItem: jest.fn(async (key: string, value: string) => {
          values.set(key, value);
        }),
      },
    };
  }
);

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const MaterialIcons = ({ name, ...props }: { name: string }) =>
    React.createElement(Text, props, name);

  MaterialIcons.glyphMap = {};

  return { MaterialIcons };
});
