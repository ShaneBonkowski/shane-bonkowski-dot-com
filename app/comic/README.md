## Creating a new `comic` page

### 1. Setup

- Make sure you have a .png file for the original comic called e.g. `{comic-name}.png`.
- For the actual comic, size does not matter. Only the cover image "thumbnail" needs to be a particular size. See below for details.
- Store this in `/public/pngs`.
- Use [image_convert.py](https://github.com/ShaneBonkowski/file-utilities/blob/main/src/file_utilities/tools/image_convert.py) to convert the image to a .webp image. Store this image in `/public/webps`. For comics, it is advised to convert with the `--lossless` flag, so that no detail is lost.

### 2. Create OR append the comic `page`.

If creating a new comic series, or a one-off comic:

- Duplicate one of the existing comic pages in `/app/comic`.
- Rename the duplicated comic directory to `{comic-series-name}`.
- ...FIXME: add details here...

If adding to an existing comic series:

- ...FIXME: add details here...
- It should be as simple as that! No need to do the further steps.

### 3. Create a cover image for the comic series.

If creating a new comic series, or a one-off comic:

- It is likely that your comic (or desired cover image) is not the required cover image size of 500x422.
- Use [image_resize.py](https://github.com/ShaneBonkowski/file-utilities/blob/main/src/file_utilities/tools/image_resize.py) to convert **A DUPLICATE** of the existing .webp file you have in `/public/webps` of your comic to a 500x422 .webp image called e.g. `{comic-series-name}-cover-art.webp`. This will be the cover image for the comic.
- Or, you can have an entirely custom image for the cover image of the series. Up to you!

### 4. Create a content box for the comic in `/app/page.tsx`.

If creating a new comic series, or a one-off comic:

- Fill in the data accordingly, updating the links, title, description, etc.
- NOTE: This will link to the comic cover image (e.g. `{comic-series-name}-cover-art.webp`), not the actual comic! The actual comic and the cover image will typically be different sizes.
