import React from 'react';

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
    constructor(props: React.PropsWithChildren) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('ErrorBoundary caught:', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center text-white p-8">
                    <div className="text-center backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 max-w-sm w-full">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h2 className="text-xl font-bold mb-2">Terjadi Kesalahan</h2>
                        <p className="text-white/60 text-sm mb-6">
                            Halaman mengalami error yang tidak terduga.
                        </p>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false });
                                window.location.reload();
                            }}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
                        >
                            Muat Ulang
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
