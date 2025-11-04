import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    // TODO: Invia errore a servizio di logging (Sentry, LogRocket, etc.)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-primary bg-pattern flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-slate-900/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-500/20 rounded-full">
                <AlertTriangle className="w-16 h-16 text-red-400" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white text-center mb-4">
              Oops! Qualcosa è andato storto
            </h1>

            {/* Description */}
            <p className="text-white/70 text-center mb-6">
              Si è verificato un errore imprevisto. Non preoccuparti, i tuoi dati sono al sicuro.
            </p>

            {/* Error Details (solo in development) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <h3 className="text-red-300 font-semibold mb-2">Dettagli Errore (Dev Mode):</h3>
                <pre className="text-red-200 text-sm overflow-auto max-h-40">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-red-300 text-sm cursor-pointer hover:text-red-200">
                      Stack Trace
                    </summary>
                    <pre className="text-red-200 text-xs mt-2 overflow-auto max-h-60">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Riprova
              </Button>
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Torna alla Home
              </Button>
            </div>

            {/* Help Text */}
            <p className="text-white/50 text-sm text-center mt-6">
              Se il problema persiste, contatta il supporto o ricarica la pagina
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

