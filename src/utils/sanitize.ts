type DOMPurifyInstance = {
  sanitize: (source: string, config?: Record<string, unknown>) => string;
};

let DOMPurify: DOMPurifyInstance | null = null;
let isLoaded = false;

interface SanitizeOptions {
  ADD_ATTR?: string[];
  [key: string]: unknown;
}

// Only load DOMPurify on client side and when actually needed. This is
// because there seems to be some issues with it running in SSR/static generation.
const loadDOMPurify = async () => {
  if (isLoaded || typeof window === "undefined") return;

  try {
    const domModule = await import("dompurify");
    DOMPurify = domModule.default as DOMPurifyInstance;
    isLoaded = true;
  } catch (error) {
    console.error("Failed to load DOMPurify:", error);
  }
};

// Preload DOMPurify immediately if on client side
if (typeof window !== "undefined") {
  loadDOMPurify();
}

/**
 * Sanitizes HTML content using DOMPurify.
 * @param {string} html - The HTML string to sanitize.
 * @param {SanitizeOptions} [options] - Optional configuration for DOMPurify.
 * @returns {string} - The sanitized HTML string.
 */
export const sanitizeHtml = (
  html: string,
  options?: SanitizeOptions
): string => {
  // During SSR/static generation, return original HTML (skip sanitization)
  if (typeof window === "undefined") {
    return html;
  }

  // If DOMPurify not loaded yet on client, return unsanitized for now,
  // but trigger loading for future calls since loading is async.
  if (!DOMPurify) {
    if (!isLoaded) {
      loadDOMPurify(); // Load for next time
    }
    return html; // Return unsanitized temporarily
  }

  // Default values, which prevent purify stripping out target and rel attributes
  // from links in the HTML. This is important for allowing external links to open
  // in new tabs.
  const defaultOptions = {
    ADD_ATTR: ["target", "rel"],
  };

  return DOMPurify.sanitize(html, {
    ...defaultOptions,
    ...options, // This will override defaults if provided
  });
};
