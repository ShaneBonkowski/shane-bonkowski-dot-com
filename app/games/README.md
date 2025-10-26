## Creating a new `game` page

### 1. Create the game `page`.

- Duplicate one of the existing games in `/app/games` (ideally `game-template`).
- Rename the duplicated game directory to `{game-name}`.
- Update the `gameMetadata` variable.
- Replace the title, description, etc.

### 2. Create a cover image for the game.

- Create a 500x422 .png image that will be the cover image for the game.
- Use [image_resize.py](https://github.com/ShaneBonkowski/file-utilities/blob/main/src/file_utilities/tools/image_resize.py) to resize to 500x422 if needed.
- Store this image in `/public/pngs`.
- Use [image_convert.py](https://github.com/ShaneBonkowski/file-utilities/blob/main/src/file_utilities/tools/image_convert.py) to convert the image to a .webp image. Store this image in `/public/webps`.

### 3. Create a content box for the game in `/src/data/content-box-data.ts`.

- Fill in the data accordingly, updating the link to the image page, title, description, etc.

NOTE: If you are building your own game, you will also need to create the game logic. See the `src/games/README.md` for more information.
