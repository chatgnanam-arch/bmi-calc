import { ResultsScreenContent } from '../src/screens/results-screen';
import { renderWithProviders } from '../test-utils';

describe('ResultsScreenContent', () => {
  it('renders the BMI value, category, and disclaimer', async () => {
    const { findByTestId } = renderWithProviders(
      <ResultsScreenContent
        bmiValue={24.9}
        onOpenSettings={jest.fn()}
        onRecalculate={jest.fn()}
      />
    );

    expect((await findByTestId('result-value')).props.children).toBe('24.9');
    expect((await findByTestId('result-category')).props.children).toBe('Normal');
    expect((await findByTestId('result-range')).props.children).toBe('18.5 - 24.9');
    expect((await findByTestId('result-disclaimer')).props.children).toBe(
      'Adult BMI ranges are shown for general guidance only and are not a diagnosis.'
    );
  });
});
