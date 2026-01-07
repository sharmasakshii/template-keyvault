import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorMessage from '../../../component/forms/errorMessaage';

describe('ErrorMessage Component', () => {
  it('does not render when not touched and without errors', () => {
    const { container } = render(<ErrorMessage />);
    expect(container.firstChild).toBeNull();
  });

  it('renders when touched and with errors', () => {
    const { getByText } = render(<ErrorMessage touched errors="Some error message" />);
    expect(getByText('Some error message')).toBeInTheDocument();
  });

  it('renders with correct styles', () => {
    const { getByText } = render(<ErrorMessage touched errors="Error" />);
    const errorMessage = getByText('Error');
    expect(errorMessage).toHaveClass('text-danger', 'font-12');
  });

  // Add more test cases as needed
});