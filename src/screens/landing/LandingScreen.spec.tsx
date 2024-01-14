import { render, screen } from '@testing-library/react-native';

import { LandingScreen } from './LandingScreen';

describe('LandingScreen', () => {
  it('shows the correct environment value', () => {
    render(<LandingScreen />);
    expect(screen.getByText('landing.title')).toBeOnTheScreen();
  });
});
