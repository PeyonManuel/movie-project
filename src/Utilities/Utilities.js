export const desktopScreenCondition =
  (window.devicePixelRatio < 2 && window.screen.width <= 2560) ||
  (window.devicePixelRatio >= 2 && window.screen.width >= 1280);
