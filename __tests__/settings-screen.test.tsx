import { fireEvent, waitFor } from '@testing-library/react-native';

import { SettingsScreen } from '../src/screens/settings-screen';
import { createMemorySettingsStorage, renderWithProviders } from '../test-utils';

const mockBack = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
    replace: mockReplace,
  }),
}));

describe('SettingsScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockReplace.mockClear();
  });

  it('persists theme selection across remounts', async () => {
    const storage = createMemorySettingsStorage();
    const firstRender = renderWithProviders(<SettingsScreen />, { storage });

    fireEvent.press(await firstRender.findByTestId('theme-dark'));

    await waitFor(() => {
      expect(storage.save).toHaveBeenCalled();
    });

    firstRender.unmount();

    const secondRender = renderWithProviders(<SettingsScreen />, { storage });

    await waitFor(() => {
      expect(
        secondRender.getByTestId('theme-dark').props.accessibilityState.selected
      ).toBe(true);
    });
  });
});
