import { render, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

import { Divider } from './Divider';

describe('Divider', () => {
  const handlePress = jest.fn();
  const handleAnimationEnded = jest.fn();
  beforeEach(() => {
    handlePress.mockReset();
  });

  it('should show button and then hide', async () => {
    const { findByTestId, rerender } = render(
      <Divider
        label="or"
        onPress={handlePress}
        hide={false}
        onAnimationEnded={handleAnimationEnded}
      />,
    );

    await expect(
      waitFor(
        async () => {
          const element = await findByTestId('divider');
          expect(element).toHaveStyle({ opacity: 1 });
        },
        { timeout: 1000 },
      ),
    ).resolves.toBeUndefined();

    act(() => {
      rerender(
        <Divider
          label="or"
          onPress={handlePress}
          hide={true}
          onAnimationEnded={handleAnimationEnded}
        />,
      );
    });
    await expect(
      waitFor(
        async () => {
          const element = await findByTestId('divider');
          expect(element).toHaveStyle({ opacity: 0 });
        },
        { timeout: 1000 },
      ),
    ).resolves.toBeUndefined();
    expect(handleAnimationEnded).toHaveBeenCalledTimes(2);
  });
});
