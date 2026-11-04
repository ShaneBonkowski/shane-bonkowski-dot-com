import fs from "fs";
import path from "path";

const siteUrl = "https://shanebonkowski.com";
const projectDirectory = process.cwd();
const manifestPath = path.join(
  projectDirectory,
  ".next",
  "prerender-manifest.json"
);
const outputDirectory = path.join(projectDirectory, "out");

if (!fs.existsSync(manifestPath)) {
  throw new Error(`Next.js prerender manifest not found: ${manifestPath}`);
}

if (!fs.existsSync(outputDirectory)) {
  throw new Error(`Static export directory not found: ${outputDirectory}`);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
  routes?: Record<
    string,
    {
      initialHeaders?: Record<string, string>;
    }
  >;
};
const routes = Object.keys(manifest.routes ?? {})
  .filter(
    (route) => {
      const contentType = manifest.routes?.[route]?.initialHeaders?.[
        "content-type"
      ];

      return (
        route.startsWith("/") &&
        route !== "/404" &&
        route !== "/_not-found" &&
        !route.includes("[") &&
        !route.includes("]") &&
        (!contentType || contentType.startsWith("text/html"))
      );
    }
  )
  .map((route) => {
    const pathname = route === "/" ? "/" : `/${route.replace(/^\/+|\/+$/g, "")}/`;
    return new URL(pathname, siteUrl).href;
  });
const uniqueRoutes = [...new Set(routes)].sort();

if (uniqueRoutes.length === 0) {
  throw new Error("No public prerendered routes found for the sitemap.");
}

const xmlEscape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueRoutes.map((url) => `  <url><loc>${xmlEscape(url)}</loc></url>`).join("\n")}
</urlset>
`;

const outputPath = path.join(outputDirectory, "sitemap.xml");
fs.writeFileSync(outputPath, sitemapXml);

console.log(`Sitemap written to ${outputPath} (${uniqueRoutes.length} URLs)`);
