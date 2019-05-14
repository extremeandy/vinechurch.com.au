import React from "react";
import * as Sentry from "@sentry/browser";

export default class LogAndIgnoreErrorBoundary extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    //this.setState({ error });
    Sentry.withScope(scope => {
      scope.setExtra("componentStack", errorInfo.componentStack);
      Sentry.captureException(error);
    });
  }

  render() {
    return this.props.children;
    // if (this.state.error != null) {
    //   // render fallback UI
    //   return <h1>Something went wrong!</h1>;
    // } else {
    //   // when there's not an error, render children untouched
    //   return this.props.children;
    // }
  }
}
