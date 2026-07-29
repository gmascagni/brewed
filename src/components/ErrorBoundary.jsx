import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("The Brew App Error Boundary caught an exception:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-espresso-950 flex items-center justify-center p-6 text-cream-light font-sans">
          <div className="max-w-md w-full p-8 rounded-3xl bg-espresso-900 border-2 border-amber-gold shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-amber-gold/20 text-amber-gold flex items-center justify-center mx-auto mb-4 border border-amber-gold/40">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-extrabold mb-2">Workspace Reload Required</h2>
            <p className="text-xs text-cream-soft/80 mb-6 leading-relaxed">
              The application encountered a transient state sync error while switching brew tracks. Click below to reload the workspace.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3.5 rounded-2xl btn-tactile-amber text-espresso-950 text-xs font-extrabold flex items-center justify-center gap-2 shadow-xl active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Workspace</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
