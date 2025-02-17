## Creating a new `game` page

### 1. Create a new data file to store the game metadata in `/src/data/games`.

- Duplicate one of the existing `*-data.ts` files.
- Rename it to `{game-name}-data.ts`.
- Rename the existing data variable to `{gameName}Data`.
- Replace the title, description, etc.

### 2. Create the game `page`.

- Duplicate one of the existing games in `/app/games`.
- Rename the duplicated game directory to `{game-name}`.
- Update the `{gameName}Data` variable to the one created in step 1, and update all references to that data variable in the file accordingly.
- Update the function name to `{GameName}`.

### 3. Create a cover image for the game.

- Create a 500x422 .png image that will be the cover image for the game.
- Store this image in `/public/pngs`.
- Use [image_convert.py](https://github.com/ShaneBonkowski/file-utilities/blob/main/src/file_utilities/image/image_convert.py) to convert the image to a .webp image. Store this image in `/public/webps`.

### 4. Create a content box for the game in `/src/data/main/content-box-data.ts`.

- Fill in the data accordinly, updating the link to the image page, title, description, etc.
