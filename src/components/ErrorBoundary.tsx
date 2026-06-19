"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("[ErrorBoundary]", error);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="m-4 rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
        <p className="mb-1 font-semibold text-red-700 dark:text-red-400">
          {error.name}: {error.message}
        </p>
        <pre className="overflow-auto whitespace-pre-wrap text-xs text-red-600 dark:text-red-300">
          {error.stack}
        </pre>
        <button
          className="mt-3 rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
          onClick={() => this.setState({ error: null })}
        >
          Dismiss
        </button>
      </div>
    );
  }
}
