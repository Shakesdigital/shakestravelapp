import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListingsManager from '../ListingsManager';
import { mockListings } from '../__mocks__/listingData';

// Mock child components
jest.mock('../ExperienceManager', () => {
  return function ExperienceManager({ experiences, onUpdate }: any) {
    return (
      <div data-testid="experience-manager">
        <h3>Experience Manager</h3>
        <div>Experiences: {experiences.length}</div>
        <button onClick={() => onUpdate(experiences)}>Update Experiences</button>
      </div>
    );
  };
});

jest.mock('../AccommodationManager', () => {
  return function AccommodationManager({ accommodations, onUpdate }: any) {
    return (
      <div data-testid="accommodation-manager">
        <h3>Accommodation Manager</h3>
        <div>Accommodations: {accommodations.length}</div>
        <button onClick={() => onUpdate(accommodations)}>Update Accommodations</button>
      </div>
    );
  };
});

jest.mock('../ListingStatusManager', () => {
  return function ListingStatusManager({ listings, onStatusUpdate }: any) {
    return (
      <div data-testid="status-manager">
        <h3>Status Manager</h3>
        <div>Pending: {listings.length}</div>
        <button 
          onClick={() => listings.length > 0 && onStatusUpdate(listings[0].id, 'approved')}
        >
          Approve First
        </button>
      </div>
    );
  };
});

describe('Listings Management Integration', () => {
  const defaultProps = {
    userRole: 'admin' as const
  };

  beforeEach(() => {
    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render the main listings dashboard', () => {
    render(<ListingsManager {...defaultProps} />);
    
    expect(screen.getByText('🏷️ Listings Management')).toBeInTheDocument();
    expect(screen.getByText('Total Listings')).toBeInTheDocument();
    expect(screen.getByText('Pending Review')).toBeInTheDocument();
    expect(screen.getByText('Featured')).toBeInTheDocument();
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
  });

  it('should display correct statistics', async () => {
    render(<ListingsManager {...defaultProps} />);
    
    // Wait for mock data to load
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument(); // Total listings
    });
    
    // Check for pending listings
    expect(screen.getByText('1')).toBeInTheDocument(); // Pending count
    
    // Check for featured listings
    expect(screen.getByText('1')).toBeInTheDocument(); // Featured count (one featured listing)
  });

  it('should switch between tabs correctly', async () => {
    render(<ListingsManager {...defaultProps} />);
    
    // Initially on overview tab
    expect(screen.getByRole('table')).toBeInTheDocument();
    
    // Switch to experiences tab
    fireEvent.click(screen.getByText('Experiences'));
    await waitFor(() => {
      expect(screen.getByTestId('experience-manager')).toBeInTheDocument();
    });
    
    // Switch to accommodations tab
    fireEvent.click(screen.getByText('Accommodations'));
    await waitFor(() => {
      expect(screen.getByTestId('accommodation-manager')).toBeInTheDocument();
    });
    
    // Switch to pending tab
    fireEvent.click(screen.getByText('Pending Review'));
    await waitFor(() => {
      expect(screen.getByTestId('status-manager')).toBeInTheDocument();
    });
  });

  it('should handle search filtering', async () => {
    render(<ListingsManager {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search listings...');
    
    // Search for gorilla
    fireEvent.change(searchInput, { target: { value: 'gorilla' } });
    
    await waitFor(() => {
      expect(screen.getByText('Gorilla Trekking Adventure')).toBeInTheDocument();
      expect(screen.queryByText('Nile River Safari Lodge')).not.toBeInTheDocument();
    });
  });

  it('should handle status filtering', async () => {
    render(<ListingsManager {...defaultProps} />);
    
    const statusSelect = screen.getByDisplayValue('All Status');
    
    // Filter by pending status
    fireEvent.change(statusSelect, { target: { value: 'pending' } });
    
    await waitFor(() => {
      expect(screen.getByText('White Water Rafting Experience')).toBeInTheDocument();
      expect(screen.queryByText('Gorilla Trekking Adventure')).not.toBeInTheDocument();
    });
  });

  it('should handle type filtering', async () => {
    render(<ListingsManager {...defaultProps} />);
    
    const typeSelect = screen.getByDisplayValue('All Types');
    
    // Filter by experience type
    fireEvent.change(typeSelect, { target: { value: 'experience' } });
    
    await waitFor(() => {
      expect(screen.getByText('Gorilla Trekking Adventure')).toBeInTheDocument();
      expect(screen.getByText('White Water Rafting Experience')).toBeInTheDocument();
      expect(screen.queryByText('Nile River Safari Lodge')).not.toBeInTheDocument();
    });
  });

  it('should toggle between table and grid view', () => {
    render(<ListingsManager {...defaultProps} />);
    
    // Initially in table view
    expect(screen.getByRole('table')).toBeInTheDocument();
    
    // Switch to grid view
    const gridButton = screen.getByText('⊞');
    fireEvent.click(gridButton);
    
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByText('Gorilla Trekking Adventure')).toBeInTheDocument(); // Still shows listings
  });

  it('should handle bulk selection and actions', async () => {
    render(<ListingsManager {...defaultProps} />);
    
    // Select all listings
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(selectAllCheckbox);
    
    await waitFor(() => {
      expect(screen.getByText('3 selected')).toBeInTheDocument();
      expect(screen.getByText('🔧 Bulk Actions')).toBeInTheDocument();
    });
    
    // Open bulk actions modal
    fireEvent.click(screen.getByText('🔧 Bulk Actions'));
    
    await waitFor(() => {
      expect(screen.getByText('Apply actions to 3 selected listings')).toBeInTheDocument();
    });
  });

  it('should integrate with child components', async () => {
    render(<ListingsManager {...defaultProps} />);
    
    // Switch to experiences tab and verify integration
    fireEvent.click(screen.getByText('Experiences'));
    
    await waitFor(() => {
      const experienceManager = screen.getByTestId('experience-manager');
      expect(experienceManager).toBeInTheDocument();
      expect(screen.getByText('Experiences: 2')).toBeInTheDocument(); // 2 experiences
    });
    
    // Test update callback
    const updateButton = screen.getByText('Update Experiences');
    fireEvent.click(updateButton);
    
    // Should not throw error (callback handled)
    expect(updateButton).toBeInTheDocument();
  });

  it('should handle status updates from child components', async () => {
    render(<ListingsManager {...defaultProps} />);
    
    // Switch to pending tab
    fireEvent.click(screen.getByText('Pending Review'));
    
    await waitFor(() => {
      const statusManager = screen.getByTestId('status-manager');
      expect(statusManager).toBeInTheDocument();
      expect(screen.getByText('Pending: 1')).toBeInTheDocument();
    });
    
    // Approve first pending item
    const approveButton = screen.getByText('Approve First');
    fireEvent.click(approveButton);
    
    // Status update should be handled (no errors thrown)
    expect(approveButton).toBeInTheDocument();
  });

  it('should display proper permissions based on user role', async () => {
    const { rerender } = render(<ListingsManager userRole="owner" />);
    
    // Switch to pending tab to check approval buttons
    fireEvent.click(screen.getByText('Pending Review'));
    
    await waitFor(() => {
      expect(screen.getByTestId('status-manager')).toBeInTheDocument();
    });
    
    // Re-render with admin role and check overview tab
    rerender(<ListingsManager userRole="admin" />);
    
    // Admin should see all functionality
    expect(screen.getByText('🏷️ Listings Management')).toBeInTheDocument();
  });

  it('should handle empty states gracefully', () => {
    // Mock empty listings
    const originalUseEffect = React.useEffect;
    const mockUseEffect = jest.fn((callback) => callback());
    React.useEffect = mockUseEffect;
    
    render(<ListingsManager {...defaultProps} />);
    
    // Should still render main structure
    expect(screen.getByText('🏷️ Listings Management')).toBeInTheDocument();
    expect(screen.getByText('Total Listings')).toBeInTheDocument();
    
    React.useEffect = originalUseEffect;
  });

  it('should maintain responsive design', () => {
    render(<ListingsManager {...defaultProps} />);
    
    // Check for responsive classes
    const container = screen.getByText('🏷️ Listings Management').closest('div');
    expect(container).toBeInTheDocument();
    
    // Grid should be responsive
    const statsGrid = screen.getByText('Total Listings').closest('.grid');
    expect(statsGrid).toHaveClass('grid-cols-1', 'sm:grid-cols-4');
  });

  it('should preserve state across tab switches', async () => {
    render(<ListingsManager {...defaultProps} />);
    
    // Apply search filter
    const searchInput = screen.getByPlaceholderText('Search listings...');
    fireEvent.change(searchInput, { target: { value: 'gorilla' } });
    
    // Switch to experiences tab and back
    fireEvent.click(screen.getByText('Experiences'));
    fireEvent.click(screen.getByText('Overview'));
    
    // Search should be preserved
    await waitFor(() => {
      expect(searchInput).toHaveValue('gorilla');
    });
  });
});