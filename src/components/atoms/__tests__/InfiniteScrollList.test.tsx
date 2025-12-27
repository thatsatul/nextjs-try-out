import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { InfiniteScrollList } from '../InfiniteScrollList';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver,
});

describe('InfiniteScrollList', () => {
  beforeEach(() => {
    mockIntersectionObserver.mockClear();
  });

  it('renders initial loading state', () => {
    render(<InfiniteScrollList />);
    expect(screen.getByText('Scroll for more')).toBeInTheDocument();
  });

  it('loads initial 100 numbers on mount', async () => {
    render(<InfiniteScrollList />);
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  it('displays numbers in correct order', async () => {
    render(<InfiniteScrollList />);
    
    await waitFor(() => {
      const firstNumber = screen.getByText('1');
      const secondNumber = screen.getByText('2');
      const lastNumber = screen.getByText('100');
      
      expect(firstNumber).toBeInTheDocument();
      expect(secondNumber).toBeInTheDocument();
      expect(lastNumber).toBeInTheDocument();
    });
  });

  it('creates IntersectionObserver on mount', () => {
    render(<InfiniteScrollList />);
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 1.0 }
    );
  });

  it('calls observe on the target element', () => {
    const mockObserve = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: mockObserve,
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    });

    render(<InfiniteScrollList />);
    
    expect(mockObserve).toHaveBeenCalled();
  });

  it('disconnects observer on unmount', () => {
    const mockDisconnect = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: mockDisconnect,
    });

    const { unmount } = render(<InfiniteScrollList />);
    unmount();
    
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('loads more numbers when intersection occurs', async () => {
    let intersectionCallback: ((entries: any[]) => void) | undefined;
    
    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
    });

    render(<InfiniteScrollList />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    // Simulate intersection
    if (intersectionCallback) {
      intersectionCallback([{ isIntersecting: true }]);
    }

    // Check if more numbers are loaded
    await waitFor(() => {
      expect(screen.getByText('101')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
    });
  });

  it('does not load more numbers when not intersecting', async () => {
    let intersectionCallback: ((entries: any[]) => void) | undefined;
    
    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
    });

    render(<InfiniteScrollList />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    const initialNumbers = screen.getAllByText(/^\d+$/).length;

    // Simulate no intersection
    if (intersectionCallback) {
      intersectionCallback([{ isIntersecting: false }]);
    }

    // Wait a bit and check that no new numbers were added
    await waitFor(() => {
      const currentNumbers = screen.getAllByText(/^\d+$/).length;
      expect(currentNumbers).toBe(initialNumbers);
    });
  });

  it('shows loading state when loading more numbers', async () => {
    let intersectionCallback: ((entries: any[]) => void) | undefined;
    
    // Mock loading state as true
    const mockSetLoading = jest.fn();
    
    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => [[], jest.fn()]) // numbers state
      .mockImplementationOnce(() => [true, mockSetLoading]) // loading state
      .mockImplementation((initial) => [initial, jest.fn()]);

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
    });

    render(<InfiniteScrollList />);

    expect(screen.getByText('Loading more...')).toBeInTheDocument();
  });
});
