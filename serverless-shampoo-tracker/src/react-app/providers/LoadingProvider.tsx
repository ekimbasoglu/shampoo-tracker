"use client";

import React from "react";
import FullPageSpinner from "../components/FullPageSpinner";

type Ctx = { busy: boolean; show(): void; hide(): void };
const LoadingContext = React.createContext<Ctx | null>(null);

export const LoadingProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [busy, setBusy] = React.useState(false);
  const show = React.useCallback(() => setBusy(true), []);
  const hide = React.useCallback(() => setBusy(false), []);

  return (
    <LoadingContext.Provider value={{ busy, show, hide }}>
      {children}
      {busy && <FullPageSpinner />} {/* overlay lives here */}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const ctx = React.useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be inside <LoadingProvider>");
  return ctx;
};
