import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the app', () => {
    render(<App />);
    // Check for the actual app title
    expect(screen.getByText(/AI Pipeline Editor/i)).toBeInTheDocument();
  });
});
