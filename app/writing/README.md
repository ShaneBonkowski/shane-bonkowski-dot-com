## Creating a new `writing` page

### 1. Create the story `page`.

- Duplicate one of the existing stories in `/app/writing`.
- Rename the duplicated story directory to `{story-name}`.
- Update the `storyData` variable.
- Replace the title, date, etc.
- The `body` field contains a list of "paragraph" elements. Each paragraph or similar group of paragraphs can be assigned to `content`, and styled using `fontStyle` and `textAlign`.

### 2. Create a cover image for the story.

- Create a 500x422 .png image that will be the cover image for the story.
- Use [image_resize.py](https://github.com/ShaneBonkowski/file-utilities/blob/main/src/file_utilities/image/image_resize.py) to resize to 500x422 if needed.
- Store this image in `/public/pngs`.
- Use [image_convert.py](https://github.com/ShaneBonkowski/file-utilities/blob/main/src/file_utilities/image/image_convert.py) to convert the image to a .webp image. Store this image in `/public/webps`.

### 3. Create a content box for the writing in `/app/page.tsx`.

- Fill in the data accordingly, updating the link to the image page, title, description, etc.
