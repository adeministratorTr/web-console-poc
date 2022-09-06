import { render, screen } from '@testing-library/react';

import Home from './index';

describe('pages/Home', () => {
  it('should render default', () => {
    render(<Home />);
    expect(screen.getByTestId('Home')).toBeVisible();
  });
});
