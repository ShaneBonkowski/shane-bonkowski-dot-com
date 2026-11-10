const NEW_CONTENT_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

const getPathSlug = (path: string): string =>
  path.replace(/^\/+|\/+$/g, "").replace(/\//g, "-") || "home";

export const getPageSeenStorageKey = (pagePath: string): string =>
  `${getPathSlug(pagePath)}-seen`;

export const getComicSeenStorageKey = (
  seriesPath: string,
  comicNum: number,
): string => `${getPathSlug(seriesPath)}-${comicNum}-seen`;

export const hasSeenContent = (storageKey: string): boolean => {
  // eslint-disable-next-line no-restricted-syntax
  return localStorage.getItem(storageKey) === "true";
};

export const markContentAsSeen = (storageKey: string): void => {
  // eslint-disable-next-line no-restricted-syntax
  localStorage.setItem(storageKey, "true");
};

export const isContentRecentlyCreated = (
  dateISO: string,
  now: number = Date.now(),
): boolean => {
  const contentDate = new Date(dateISO).getTime();
  const contentAge = now - contentDate;

  return (
    Number.isFinite(contentDate) &&
    contentAge >= 0 &&
    contentAge <= NEW_CONTENT_WINDOW_MS
  );
};
