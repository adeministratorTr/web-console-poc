import { render, screen } from '@testing-library/react';

import Header from './index';

describe('Header', () => {
  it('should render default', () => {
    render(<Header />);
    expect(screen.getByTestId('Header')).toBeVisible();
  });
});
