import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ST6 weekly planning render failure", error, errorInfo);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="min-h-screen bg-cloud p-6">
        <section className="mx-auto max-w-2xl rounded-md border border-red-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-red-700">Weekly planning could not load</p>
          <h1 className="mt-2 text-xl font-semibold text-ink">ST6 hit an unexpected rendering error.</h1>
          <p className="mt-2 text-sm text-slate-600">
            Reload the workspace to restore the current planning session. If this keeps happening, include the
            browser console details with the support request.
          </p>
          <button
            type="button"
            className="mt-4 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white"
            onClick={() => window.location.reload()}
          >
            Reload workspace
          </button>
        </section>
      </main>
    );
  }
}
