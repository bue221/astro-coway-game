import * as React from "react";

import { MOBILE_BREAKPOINT_PX } from "../../../lib/constants/game";

const useIsMobile = (mobileScreenSize = MOBILE_BREAKPOINT_PX) => {
  const [isMobile, setIsMobile] = React.useState(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return false;
    }

    return window.matchMedia(`(max-width: ${mobileScreenSize}px)`).matches;
  });

  const checkIsMobile = React.useCallback((event: MediaQueryListEvent) => {
    setIsMobile(event.matches);
  }, []);

  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const mediaListener = window.matchMedia(
      `(max-width: ${mobileScreenSize}px)`
    );

    try {
      mediaListener.addEventListener("change", checkIsMobile);
    } catch {
      mediaListener.addListener(checkIsMobile);
    }

    return () => {
      try {
        mediaListener.removeEventListener("change", checkIsMobile);
      } catch {
        mediaListener.removeListener(checkIsMobile);
      }
    };
  }, [checkIsMobile, mobileScreenSize]);

  return isMobile;
};

export default useIsMobile;
