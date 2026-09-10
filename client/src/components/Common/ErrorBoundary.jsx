import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught React Runtime Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#090d16] text-white flex flex-col items-center justify-center p-6 select-none font-sans">
          <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6">
            {/* Warning Icon */}
            <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                Application Rendering Notice
              </span>
              <h2 className="text-xl font-black text-white pt-1">Something went wrong</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected component rendering error occurred. The system caught the error safely to prevent application unavailability.
              </p>
            </div>

            {/* Error Snippet if in development */}
            {this.state.error && (
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-rose-300 font-mono text-left line-clamp-3 overflow-hidden">
                {this.state.error.toString()}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg hover:brightness-110 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Page
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Home className="w-3.5 h-3.5 text-indigo-400" /> Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
