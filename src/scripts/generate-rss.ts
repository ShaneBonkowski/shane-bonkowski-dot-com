import fs from "fs";
import path from "path";
import { contentBoxData } from "@/src/data/content-box-data";
import { comicData } from "@/src/data/comic-data";

const siteUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://shanebonkowski.com";

// --- Collect all feed items as structured data before converting to XML
const allItems: {
  title: string;
  link: string;
  description: string;
  date: Date;
  guid: string;
  category?: string;
  imageUrl?: string;
}[] = [];

for (const item of contentBoxData) {
  // --- Normal content (writing, etc.)
  if (item.contentType !== "comics") {
    allItems.push({
      title: item.title,
      // Prepend e.g. https://shanebonkowski.com if this is a local path url instead of an actual url
      link: item.linkUrl.startsWith("http")
        ? item.linkUrl
        : `${siteUrl}${item.linkUrl}`,
      description: item.description,
      date: new Date(item.dateISO.replace(/\//g, "-")),
      guid: item.linkUrl.startsWith("http")
        ? item.linkUrl
        : `${siteUrl}${item.linkUrl}`,
      category: item.contentType || "",
      imageUrl: item.imageUrl ? `${siteUrl}${item.imageUrl}` : undefined,
    });
  } else {
    // --- Comic series: expand the child comics as unique entries instead of
    // having the comic series content box being a single entry in the feed.
    // This is because comics are a special content type where the children are
    // the actual individual pieces of content.
    const childDataKey = item.childDataKey;
    if (typeof childDataKey !== "string" || childDataKey.trim() === "") {
      throw new Error(
        `Comic content box "${item.title}" is missing required 'childDataKey' string.`
      );
    }

    const children = comicData[childDataKey];
    if (!Array.isArray(children) || children.length === 0) {
      throw new Error(
        `Comic content box "${item.title}" (key="${childDataKey}") has no corresponding comic data in comicData.`
      );
    }

    for (const comic of children) {
      allItems.push({
        title: `${item.title} #${comic.comicNum}`,
        // Prepend e.g. https://shanebonkowski.com if this is a local path url instead of an actual url
        link: item.linkUrl.startsWith("http")
          ? item.linkUrl
          : `${siteUrl}${item.linkUrl}/?comic=${comic.comicNum}`,
        description: comic.captionOrTitle,
        date: new Date(comic.dateISO.replace(/\//g, "-")),
        guid: item.linkUrl.startsWith("http")
          ? item.linkUrl
          : `${siteUrl}${item.linkUrl}/?comic=${comic.comicNum}`,
        category: item.contentType || "",
        imageUrl: `${siteUrl}${comic.imageUrl}`,
      });
    }
  }
}

// --- Sort all items by date (newest first)
allItems.sort((a, b) => b.date.getTime() - a.date.getTime());

// --- Convert sorted items to XML
const itemsXml = allItems
  .map(
    (entry) => `<item>
        <title><![CDATA[${entry.title}]]></title>
        <link>${entry.link}</link>
        <description><![CDATA[${entry.description}]]></description>
        <pubDate>${entry.date.toUTCString()}</pubDate>
        <guid>${entry.guid}</guid>
        <category><![CDATA[${entry.category || ""}]]></category>
        ${
          entry.imageUrl
            ? `<enclosure url="${entry.imageUrl}" length="0" type="image/webp" />`
            : ""
        }
    </item>`
  )
  .join("\n\t");

// --- Build final XML
const lastBuildDate = new Date().toUTCString();

const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Shane's Games</title>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Recent posts</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    ${itemsXml}
    <generator>Custom Feed Generator by Shane</generator>
  </channel>
</rss>`;

// --- Write to /public/feed.xml
const outputPath = path.join(process.cwd(), "public", "feed.xml");
fs.writeFileSync(outputPath, rssXml);

console.log(`RSS feed written to ${outputPath} (${allItems.length} items)`);
