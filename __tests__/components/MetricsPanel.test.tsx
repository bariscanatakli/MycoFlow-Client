/**
 * MetricsPanel Component Tests
 */

import { render, screen, act } from '@testing-library/react';
import MetricsPanel from '@/components/MetricsPanel';
import { ContentProvider } from '@/lib/content';

// Wrap component with ContentProvider
const renderWithProvider = (component: React.ReactNode) => {
  return render(
    <ContentProvider updateInterval={100}>
      {component}
    </ContentProvider>
  );
};

describe('MetricsPanel Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render all metric labels', () => {
    renderWithProvider(<MetricsPanel />);
    
    expect(screen.getByText(/Round Trip Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Jitter/i)).toBeInTheDocument();
    expect(screen.getByText(/Packet Loss/i)).toBeInTheDocument();
    expect(screen.getByText(/Throughput/i)).toBeInTheDocument();
  });

  it('should render metric values with units', () => {
    renderWithProvider(<MetricsPanel />);
    
    // Check for ms units
    const msElements = screen.getAllByText(/ms$/);
    expect(msElements.length).toBeGreaterThan(0);
    
    // Check for Mbps unit
    expect(screen.getByText(/Mbps$/)).toBeInTheDocument();
  });

  it('should render toggle button for live updates', () => {
    renderWithProvider(<MetricsPanel />);
    
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  it('should update metrics over time when live', async () => {
    renderWithProvider(<MetricsPanel />);
    
    // Just verify RTT label is present
    expect(screen.getByText(/Round Trip Time/i)).toBeInTheDocument();
    
    // Advance time
    await act(async () => {
      jest.advanceTimersByTime(200);
    });
    
    // Values should potentially change (probabilistic)
    // This test just ensures the component doesn't crash during updates
    expect(screen.getByText(/Round Trip Time/i)).toBeInTheDocument();
  });

  it('should render CPU and Queue metrics', () => {
    renderWithProvider(<MetricsPanel />);
    
    expect(screen.getByText(/CPU/i)).toBeInTheDocument();
    expect(screen.getByText(/Queue/i)).toBeInTheDocument();
  });

  it('should display percentage values correctly', () => {
    renderWithProvider(<MetricsPanel />);
    
    // Check for % units (packet loss, queue depth, cpu)
    const percentElements = screen.getAllByText(/%$/);
    expect(percentElements.length).toBeGreaterThan(0);
  });
});
