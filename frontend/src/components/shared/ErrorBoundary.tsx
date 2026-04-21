import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-sentinel-error/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-12 h-12 text-sentinel-error" />
          </div>
          
          <h1 className="text-3xl font-bold font-headline text-white mb-4">
            Something went wrong
          </h1>
          
          <p className="text-[hsl(215,15%,55%)] max-w-md mb-8">
            An unexpected error occurred while rendering this page. Our systems have 
            logged the issue for investigation.
          </p>

          <div className="bg-surface-low p-4 rounded-lg border border-ghost text-left w-full max-w-2xl mb-8 overflow-x-auto">
            <p className="text-sentinel-error font-mono text-sm mb-2">
              {this.state.error?.toString()}
            </p>
            <pre className="text-[10px] text-muted-foreground font-mono">
              {this.state.error?.stack?.split("\n").slice(0, 5).join("\n")}
            </pre>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={this.handleReset}
              className="flex items-center gap-2 bg-gradient-primary px-6 py-2.5 rounded-lg text-sm font-bold text-on-primary-fixed shadow-glow-primary hover:opacity-90 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <a 
              href="/app/dashboard"
              className="flex items-center gap-2 bg-surface-container px-6 py-2.5 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors"
            >
              <Home className="w-4 h-4" />
              Return Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
