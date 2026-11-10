const NEW_CONTENT_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export const getPageSeenStorageKey = (pagePath: string): string => {
  const normalizedPath = pagePath.replace(/\/+$/, "") || "/";
  return `page:${normalizedPath}:seen`;
};

export const getComicSeenStorageKey = (
  seriesTitle: string,
  comicNum: number
): string => `${seriesTitle}-${comicNum}-seen`;

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
  now: number = Date.now()
): boolean => {
  const contentDate = new Date(dateISO.replace(/\//g, "-")).getTime();
  const contentAge = now - contentDate;

  return (
    Number.isFinite(contentDate) &&
    contentAge >= 0 &&
    contentAge < NEW_CONTENT_WINDOW_MS
  );
};
