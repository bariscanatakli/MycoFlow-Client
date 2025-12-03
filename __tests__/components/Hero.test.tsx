/**
 * Hero Component Tests
 */

import { render, screen } from '@testing-library/react';
import Hero from '@/components/Hero';
import { ContentProvider } from '@/lib/content';

// Wrap component with ContentProvider
const renderWithProvider = (component: React.ReactNode) => {
  return render(
    <ContentProvider>
      {component}
    </ContentProvider>
  );
};

describe('Hero Component', () => {
  it('should render the main title', () => {
    renderWithProvider(<Hero />);
    
    expect(screen.getByText('MycoFlow')).toBeInTheDocument();
  });

  it('should render the badge', () => {
    renderWithProvider(<Hero />);
    
    expect(screen.getByText(/OpenWrt Package/i)).toBeInTheDocument();
  });

  it('should render primary CTA button', () => {
    renderWithProvider(<Hero />);
    
    const ctaButton = screen.getByRole('button', { name: /See It In Action/i });
    expect(ctaButton).toBeInTheDocument();
  });

  it('should render secondary CTA button', () => {
    renderWithProvider(<Hero />);
    
    const secondaryButton = screen.getByRole('button', { name: /How It Works/i });
    expect(secondaryButton).toBeInTheDocument();
  });

  it('should have proper heading structure', () => {
    renderWithProvider(<Hero />);
    
    // Main title should be h1
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
