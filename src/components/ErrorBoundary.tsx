import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Fit N Cheap Uncaught UI Error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetData = () => {
    try {
      localStorage.removeItem('fitncheap_measurements');
      localStorage.removeItem('fitncheap_saved_fits');
      localStorage.removeItem('fitncheap_frames');
    } catch (e) {
      console.error(e);
    }
    window.location.href = '/';
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                Something hit a bump in the road
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                An unexpected error occurred in the application. Don&apos;t worry, your fit data is still safe in your browser.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-left font-mono text-[11px] text-rose-600 dark:text-rose-400 overflow-x-auto max-h-32">
                {this.state.error.message || 'Unknown error'}
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetData}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset Local Data & Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
