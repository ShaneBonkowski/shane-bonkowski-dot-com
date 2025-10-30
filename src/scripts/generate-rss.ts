import fs from "fs";
import path from "path";
import { contentBoxData } from "@/src/data/content-box-data";
import { comicData } from "@/src/data/comic-data";

const siteUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://shanebonkowski.com";

// Generate <item> XML entries for the content that is posted to the website.
// This rss xml file can be subscribed to by an rss watcher in order to set up
// updates when new content is posted.
const itemsXml = contentBoxData
  .flatMap((item) => {
    if (item.contentType !== "comics") {
      // --- Normal content (writing, etc.)
      return `
        <item>
          <title><![CDATA[${item.title}]]></title>
          <link>${siteUrl}${item.linkUrl}</link>
          <description><![CDATA[${item.description}]]></description>
          <pubDate>${new Date(
            item.dateISO.replace(/\//g, "-")
          ).toUTCString()}</pubDate>
          <guid>${siteUrl}${item.linkUrl}</guid>
          <category><![CDATA[${item.searchTags || ""}]]></category>
          <enclosure url="${siteUrl}${
        item.imageUrl
      }" length="0" type="image/webp" />
        </item>
      `;
    }

    // --- Comic series: expand the child comics as unique entries, instead of
    // having the comic series content box being a single entry in the feed. This
    // is because comics are a special content type where the children are sort of
    // each individual pieces of content.
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

    return children
      .map(
        (comic) => `
          <item>
            <title><![CDATA[${item.title} #${comic.comicNum}]]></title>
            <link>${siteUrl}${item.linkUrl}/?comic=${comic.comicNum}</link>
            <description><![CDATA[${comic.captionOrTitle}]]></description>
            <pubDate>${new Date(
              comic.dateISO.replace(/\//g, "-")
            ).toUTCString()}</pubDate>
            <guid>${siteUrl}${item.linkUrl}/?comic=${comic.comicNum}</guid>
            <category><![CDATA[${item.searchTags || ""}]]></category>
            <enclosure url="${siteUrl}${
          comic.imageUrl
        }" length="0" type="image/webp" />
          </item>
        `
      )
      .join("");
  })
  .join("");

// Build final XML
const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Shane's Games</title>
    <link>${siteUrl}</link>
    <description>Recent posts</description>
    <language>en-us</language>
    ${itemsXml}
  </channel>
</rss>`;

// Write to /public/rss.xml
const outputPath = path.join(process.cwd(), "public", "rss.xml");
fs.writeFileSync(outputPath, rssXml);

console.log(`RSS feed written to ${outputPath}`);
