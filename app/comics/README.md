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
- Update the `comicMetadata` variable in the `page.tsx` with information about your new comic series.
- Go into `/src/data/comic-data` and add a new entry in the `comicData` record for your new comic series. This is where in the future you can add any new comic into the series. In other words, each element in the list that corresponds your record is a comic in your series. For now, just add the first comic you intend to create here.
- Update the `ComicContentLoader` call to use the record you added to `comicData`.

If adding to an existing comic series:

- Add the information for your new "child" comic to top of the `/src/data/comic-data` record that corresponds to your series.
- It should be as simple as that! No need to do any further steps!

### 3. Create a cover image for the comic series.

If creating a new comic series, or a one-off comic:

- It is likely that your comic (or desired cover image) is not the required cover image size of 500x422.
- Use [image_resize.py](https://github.com/ShaneBonkowski/file-utilities/blob/main/src/file_utilities/tools/image_resize.py) to convert **A DUPLICATE** of the existing .webp file you have in `/public/webps` of your comic to a 500x422 .webp image called e.g. `{comic-series-name}-cover-art.webp`. This will be the cover image for the comic series.
- Or, you can have an entirely custom image for the cover image of the series. Up to you!

### 4. Create a content box for the comic in `/src/data/content-box-data.ts`.

If creating a new comic series, or a one-off comic:

- For comic series, the content box is populated in a slightly more unique way than other forms of content. It is advised to copy and paste an existing comic series and use that as a reference when making a new comic content box.
- Fill in the data accordingly, updating the links, title, description, etc.
- NOTE: This will link to the comic cover image for the series (e.g. `{comic-series-name}-cover-art.webp`), not the actual comic!
- **IMPORTANT:** Make sure the `childDataKey` is provided! This is needed for mapping the comic series and children data sources together. This is just the key that was chosen for the record added to `comicData` above.
