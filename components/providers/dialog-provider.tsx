"use client";

import * as React from "react";

type DialogContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  // Generic payload for programmatic dialogs
  dialogProps: unknown;
  openDialog: (props: unknown) => void;
  closeDialog: () => void;
};

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dialogProps, setDialogProps] = React.useState<unknown>(null);

  const openDialog = React.useCallback((props: unknown) => {
    setDialogProps(props);
    setIsOpen(true);
  }, []);

  const closeDialog = React.useCallback(() => {
    setIsOpen(false);
    setDialogProps(null);
  }, []);

  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen, dialogProps, openDialog, closeDialog }}>
      {children}
      {/* A global Dialog container could be rendered here listening to this state */}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("useDialog must be used within DialogProvider");
  return context;
}
