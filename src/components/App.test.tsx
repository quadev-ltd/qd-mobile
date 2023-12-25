import 'react-native';
import { create } from 'react-test-renderer';

import { Landing } from './Landing.tsx';

// Mocking useDispatch and useSelector
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn().mockImplementation(() => ({
    t: jest.fn().mockImplementation(() => 'example.text'),
  })),
}));

// Note: import explicitly to use the types shiped with jest.

// Note: test renderer must be required after react-native.

it('renders correctly', () => {
  create(<Landing />);
});
