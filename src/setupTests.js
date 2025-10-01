if (typeof BroadcastChannel === 'undefined') {
  global.BroadcastChannel = class BroadcastChannel {
    constructor(name) {
      this.name = name;
      this.onmessage = null;
    }
    postMessage(message) {
      if (this.onmessage) {
        this.onmessage({ data: message });
      }
    }
    addEventListener(type, listener) {
      if (type === 'message') {
        this.onmessage = listener;
      }
    }
    removeEventListener(type, listener) {
      if (type === 'message') {
        this.onmessage = null;
      }
    }
    close() {}
  };
}

import React from 'react';
import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill for TransformStream for MSW
const { TransformStream } = require('stream/web');
global.TransformStream = TransformStream;

// Set env for Jest
process.env.VITE_BACKEND_URL = 'http://localhost:8080/api';

// Mock window.location.assign for navigation testing
if (typeof window !== 'undefined') {
  // Only mock if not already mocked
  if (!window.location || typeof window.location.assign !== 'function' || !window.location.assign._isMockFunction) {
    try {
      // Try to add assign function if it doesn't exist
      if (window.location && !window.location.assign) {
        window.location.assign = jest.fn();
      }
    } catch (e) {
      // Ignore if we can't modify
      console.warn('Could not fully mock window.location.assign');
    }
  }
}

// Mock Response for MSW
if (typeof Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body;
      this.status = init.status || 200;
      this.statusText = init.statusText || 'OK';
      this.headers = new Map(Object.entries(init.headers || {}));
    }
    
    json() {
      return Promise.resolve(typeof this.body === 'string' ? JSON.parse(this.body) : this.body);
    }
    
    text() {
      return Promise.resolve(typeof this.body === 'string' ? this.body : JSON.stringify(this.body));
    }
  };
  
  // Error boundary for testing
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }
  
    componentDidCatch(error, errorInfo) {
      console.error('Error caught by test boundary:', error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        return (
          <div data-testid="error-boundary">
            <h2>Test Error Boundary</h2>
            <p>Error: {this.state.error?.message}</p>
            <p>Stack: {this.state.error?.stack}</p>
          </div>
        );
      }
  
      return this.props.children;
    }
  }
  
  // Add error boundary to React testing library render function
  const originalRender = global.render;
  global.render = (ui, options) => {
    return originalRender(
      <ErrorBoundary>
        {ui}
      </ErrorBoundary>,
      options
    );
  };
}

// Mock Request for MSW
if (typeof Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init = {}) {
      this.url = typeof input === 'string' ? input : input.url;
      this.method = init.method || 'GET';
      this.headers = new Map(Object.entries(init.headers || {}));
      this.body = init.body;
    }
  };
}