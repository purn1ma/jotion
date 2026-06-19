"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function GlobalErrorHandler() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      toast.error(`${event.error?.name ?? "Error"}: ${event.message}`, {
        description: event.error?.stack
          ? event.error.stack.split("\n").slice(1, 4).join("\n")
          : `${event.filename}:${event.lineno}`,
        duration: Infinity,
      });
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        reason instanceof Error
          ? `${reason.name}: ${reason.message}`
          : String(reason);
      const stack =
        reason instanceof Error
          ? reason.stack?.split("\n").slice(1, 4).join("\n")
          : undefined;
      toast.error(message, { description: stack, duration: Infinity });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}
