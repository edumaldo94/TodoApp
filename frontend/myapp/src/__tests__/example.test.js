// filepath: /c:/Users/Eduardo/Documents/GitHub/TodoApp/frontend/myapp/src/__tests__/example.test.js
import React from 'react';
import { render } from '@testing-library/react-native';
import MyComponent from '../components/MyComponent';

test('renders correctly', () => {
  const { getByText } = render(<MyComponent />);
  expect(getByText('Hello, world!')).toBeTruthy();
});