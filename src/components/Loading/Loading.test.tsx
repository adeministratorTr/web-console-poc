import { render, screen } from '@testing-library/react';

import Loading from './index';

describe('Loading', () => {
  it('should render default', () => {
    render(<Loading />);
    expect(screen.getByTestId('Loading')).toBeVisible();
  });
});
