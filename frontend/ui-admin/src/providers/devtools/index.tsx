"use client";

import {
  DevtoolsPanel,
  DevtoolsProvider as DevtoolsProviderBase,
} from "@refinedev/devtools";
import React from "react";

export const DevtoolsProvider = (props: React.PropsWithChildren) => {
  if (process.env.NEXT_PUBLIC_DISABLE_DEVTOOLS === "true") {
    return <>{props.children}</>;
  }

  return (
    <DevtoolsProviderBase>
      {props.children}
      <DevtoolsPanel />
    </DevtoolsProviderBase>
  );
};
