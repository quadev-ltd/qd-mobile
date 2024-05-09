import { act, render, waitFor } from '@testing-library/react-native';

import { CTA } from './CTA';

describe('AnimatedCTA', () => {
  const handlePress = jest.fn();
  const handleAnimationEnded = jest.fn();
  beforeEach(() => {
    handlePress.mockReset();
  });
  it('should show button and then hide', async () => {
    const { findByTestId, rerender } = render(
      <CTA
        isAnimated={true}
        testID="cta"
        text="test label"
        accessibilityLabel="test label"
        onPress={handlePress}
        hide={false}
        onAnimationEnded={handleAnimationEnded}
      />,
    );

    await expect(
      waitFor(
        async () => {
          expect(await findByTestId('cta')).toHaveStyle({ opacity: 1 });
          expect(handleAnimationEnded).toHaveBeenCalledTimes(1);
        },
        { timeout: 1000 },
      ),
    ).resolves.toBeUndefined();

    await act(() => {
      rerender(
        <CTA
          isAnimated={true}
          testID="cta"
          text="test label"
          accessibilityLabel="test label"
          onPress={handlePress}
          hide={true}
          onAnimationEnded={handleAnimationEnded}
        />,
      );
    });
    await expect(
      waitFor(
        async () => {
          expect(await findByTestId('cta')).toHaveStyle({ opacity: 0 });
          expect(handleAnimationEnded).toHaveBeenCalledTimes(2);
        },
        { timeout: 1000 },
      ),
    ).resolves.toBeUndefined();
  });
});
