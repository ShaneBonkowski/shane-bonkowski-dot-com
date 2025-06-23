type DOMPurifyInstance = {
  sanitize: (source: string, config?: Record<string, unknown>) => string;
};

let DOMPurify: DOMPurifyInstance | null = null;

// Dynamically import DOMPurify only on client side
if (typeof window !== "undefined") {
  import("dompurify").then((module) => {
    DOMPurify = module.default as DOMPurifyInstance;
  });
}

interface SanitizeOptions {
  ADD_ATTR?: string[];
  [key: string]: unknown;
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
  // Return original text if DOMPurify isn't loaded (during SSR/build)
  if (!DOMPurify) {
    return html;
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
