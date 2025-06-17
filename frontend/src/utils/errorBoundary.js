import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.hasError = false;
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`Error: ${error} ErrorInfo: ${errorInfo}`);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong</h1>;
    }
  }
}
