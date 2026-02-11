## Creating a new `writing` page

### 0. Write the story in the required format

This website uses a custom tool to convert `.docx` files into React components for seamless integration.

**Requirements:**

- Write your story in **Google Docs** or **Microsoft Word**.
- Include a header at the top of the document in this exact format:

```
<title>
<author>
<date>
```

**Example:**

```
The Moon
Shane Bonkowski
7-6-24
```

- **Supported formatting:** italics, bold, paragraph structure, left/right/center/justified text alignment.
- **Reminder:** Stories published here are typically "justified" or "centered". Make sure that the format of the text on the document makes sense prior to moving on to the next steps. If the text is "left" or "right" alignment, it is probably wrong.
- **Export:** Save as `.docx` format and download locally.

**Note:** The converter will automatically parse this header format and apply the appropriate styling to your story content. See the steps below for more information.

### 1. Create the story `page`.

- Duplicate one of the existing stories in `/app/writing`.
- Rename the duplicated story directory to `{story-name}`.
- Update the `storyMetadata` variable.
- Replace the title, date, etc.

**Converting content:**

- Delete all content between (and including) `<WrittenContentLoader {...storyMetadata}>` tags.
- Run [docx_to_written_content.py](https://github.com/ShaneBonkowski/file-utilities/blob/main/src/file_utilities/tools/docx_to_written_content.py) on your `.docx` file.
- Copy the generated React components from the output `.txt` file.
- Paste them where you deleted the `<WrittenContentLoader>` content.

**Note:** The converter automatically handles paragraph styling (`fontStyle`, `textAlign`) based on your document formatting.

### 2. Create a cover image for the story.

- Create a 500x422 .png image that will be the cover image for the story.
- Use [image_resize.py](https://github.com/ShaneBonkowski/file-utilities/blob/main/src/file_utilities/tools/image_resize.py) to resize to 500x422 if needed.
- Store this image in `/public/pngs`.
- Use [image_convert.py](https://github.com/ShaneBonkowski/file-utilities/blob/main/src/file_utilities/tools/image_convert.py) to convert the image to a .webp image. Store this image in `/public/webps`.

### 3. Create a content box for the writing in `/src/data/content-box-data.ts`.

- Fill in the data accordingly, updating the link to the image page, title, description, etc.
