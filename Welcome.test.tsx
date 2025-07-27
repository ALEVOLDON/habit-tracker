import { render, screen } from '@testing-library/react';
import Welcome from './Welcome';

describe('Welcome Component', () => {
  it('should render the welcome message correctly', () => {
    render(<Welcome />);

    const headingElement = screen.getByRole('heading', { name: /Добро пожаловать в Трекер Привычек!/i });
    expect(headingElement).toBeInTheDocument();
  });
});