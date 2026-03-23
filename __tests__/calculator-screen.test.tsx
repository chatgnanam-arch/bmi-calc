import { fireEvent } from '@testing-library/react-native';

import { CalculatorScreen } from '../src/screens/calculator-screen';
import { renderWithProviders } from '../test-utils';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('CalculatorScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('switches between metric and imperial field groups', async () => {
    const { findByTestId, getByText, queryByTestId } = renderWithProviders(
      <CalculatorScreen />
    );

    expect(await findByTestId('weightKg-input')).toBeTruthy();
    expect(queryByTestId('weightLb-input')).toBeNull();

    fireEvent.press(getByText('Imperial'));

    expect(queryByTestId('weightKg-input')).toBeNull();
    expect(await findByTestId('weightLb-input')).toBeTruthy();
    expect(await findByTestId('heightFt-input')).toBeTruthy();
    expect(await findByTestId('heightIn-input')).toBeTruthy();
  });
});
