import { fireEvent, render, screen } from '@testing-library/react';

import CloudProvider from './index';

describe('Home/CloudProvider', () => {
  const mockOnSelect = jest.fn();

  it('should render default', () => {
    render(<CloudProvider onSelect={mockOnSelect} />);

    expect(screen.getByTestId('HomeCloudProvider')).toBeVisible();
    expect(screen.getAllByTestId('HomeCloudProviderItem')).toHaveLength(5);
  });

  it('should call onSelect when clicked', () => {
    render(<CloudProvider onSelect={mockOnSelect} />);
    const child = screen.getAllByTestId('HomeCloudProviderItem');

    expect(mockOnSelect).toBeCalledTimes(0);
    fireEvent.click(child[0]);
    expect(mockOnSelect).toBeCalledTimes(1);
  });
});
