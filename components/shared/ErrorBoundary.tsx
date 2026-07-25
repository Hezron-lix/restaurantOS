"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in component:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-6 bg-red-950/20 border border-red-900/50 rounded-xl w-full h-full min-h-[200px]">
          <AlertTriangle className="w-8 h-8 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-red-400 mb-2">Component Error</h2>
          <p className="text-sm text-red-300/80 mb-4 text-center max-w-sm">
            {this.state.error?.message || "An unexpected error occurred in this module."}
          </p>
          <Button variant="outline" onClick={this.handleReset} className="border-red-900 text-red-400 hover:bg-red-950">
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
