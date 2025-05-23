## Creating a new `art` page

### 1. Setup

- Make sure you have a .png file for the original artwork called e.g. `{art-name}.png`.
- Store this in `/public/pngs`.
- Use [image_convert.py](https://github.com/ShaneBonkowski/file-utilities/blob/main/src/file_utilities/image/image_convert.py) to convert the image to a .webp image. Store this image in `/public/webps`.

### 2. Create the art `page`.

- Duplicate one of the existing artwork pages in `/app/art`.
- Rename the duplicated art directory to `{art-name}`.
- Update the contents of the `imageData`.
- Make sure `artContent: true` and `body: []` if there is no text desired to be added below the image.
- Link to the **actual** art image that will be displayed on the page.
- Make sure `width` and `height` match the size of the image.

### 3. Create a cover image for the artwork.

- It is likely that your artwork is not the required cover image size of 500x422.
- Use [image_resize.py](https://github.com/ShaneBonkowski/file-utilities/blob/main/src/file_utilities/image/image_resize.py) to convert **A DUPLICATE** of the existing .webp file you have in `/public/webps` of your artwork to a 500x422 .webp image called e.g. `{art-name}-cover-art.webp`. This will be the cover image for the artwork.

### 4. Create a content box for the art in `/app/page.tsx`.

- Fill in the data accordingly, updating the link to the image page, title, description, etc.
- NOTE: This will link to the artwork cover image (e.g. `{art-name}-cover-art.webp`), not the actual artwork! The actual artworks and the cover image will typically be different sizes.
