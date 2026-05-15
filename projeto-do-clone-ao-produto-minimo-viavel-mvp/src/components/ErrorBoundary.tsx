import React from 'react';

export class ErrorBoundary extends (React.Component as any) {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if ((this.state as any).hasError) {
      let errorMessage = "Desculpe, algo deu errado.";
      
      try {
        // Try to parse if it's a Firestore error JSON
        const parsed = JSON.parse((this.state as any).error?.message || "");
        if (parsed.error && parsed.error.includes("permissions")) {
          errorMessage = "Você não tem permissão para realizar esta ação.";
        }
      } catch (e) {
        // Not a JSON error message, use default
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-solar-base03 p-4">
          <div className="bg-solar-base02 border border-solar-yellow p-8 rounded-lg max-w-md w-full text-center">
            <h2 className="text-solar-yellow text-2xl font-bold mb-4">Ops!</h2>
            <p className="text-solar-cyan mb-6">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-solar-yellow text-solar-base03 px-6 py-2 rounded font-bold hover:bg-solar-cyan transition-colors"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return (this.props as any).children;
  }
}
