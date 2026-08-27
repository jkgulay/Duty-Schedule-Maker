import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * App-wide error boundary. Wraps the tree in `main.tsx` so a render error
 * shows a message instead of a blank screen.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled render error:', error, info.componentStack);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    const { error } = this.state;
    if (error === null) {
      return this.props.children;
    }
    if (this.props.fallback !== undefined) {
      return this.props.fallback;
    }
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <h1 className="text-xl font-semibold text-gray-900">Something broke</h1>
        <p className="mt-2 text-sm text-gray-600">{error.message}</p>
        <button
          type="button"
          onClick={this.handleReload}
          className="mt-4 rounded bg-brand px-4 py-2 text-sm font-medium text-white"
        >
          Reload the page
        </button>
      </div>
    );
  }
}
