import { render, screen } from '@testing-library/react';

import NoResult from './index';

describe('NoResult', () => {
  it('should render default', () => {
    render(<NoResult />);

    expect(screen.getByTestId('NoResult')).toBeVisible();
  });
});
