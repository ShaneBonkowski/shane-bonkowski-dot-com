## Public static assets

This directory is used to store all static assets for the project. These assets do not require any processing and are directly served by the web server. Examples of static assets include images, fonts, icons, libraries, and other files that are not part of the source code or JavaScript files.

Note that during the build process, Next.js empties all of the contents of `public` into the root of the package. Hence why for example assets in `/public/webps/*.webp` are accessed by the path `/webps/*.webp` in the source code.
