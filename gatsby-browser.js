import React from "react";
import LogAndIgnoreErrorBoundary from "./src/error-boundary";

export const wrapPageElement = ({ element }) => {
  return <LogAndIgnoreErrorBoundary>{element}</LogAndIgnoreErrorBoundary>;
};
