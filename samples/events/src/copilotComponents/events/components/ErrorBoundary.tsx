import * as React from "react";
import { TypographyControl } from "@spteck/react-controls-v2";

interface IErrorBoundaryState {
  error: Error | undefined;
}

interface IErrorBoundaryProps {
  children?: React.ReactNode;
  fallbackTitle: string;
}

export class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  public state: IErrorBoundaryState = { error: undefined };

  public static getDerivedStateFromError(error: Error): IErrorBoundaryState {
    return { error };
  }

  public componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error(
      "[EventsCopilotComponent] EventFeed render failed:",
      error,
      info.componentStack,
    );
  }

  public render(): React.ReactNode {
    if (this.state.error) {
      return (
        <TypographyControl>
          {this.props.fallbackTitle}: {this.state.error.message}
        </TypographyControl>
      );
    }
    return this.props.children;
  }
}
