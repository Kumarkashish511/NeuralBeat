# Extension Icons

This folder should contain the following icon files:

- `icon16.png` - 16x16 pixels (toolbar icon)
- `icon32.png` - 32x32 pixels (toolbar icon)
- `icon48.png` - 48x48 pixels (extension management page)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

## Creating Icons

You can create these icons from the main VerseForge logo (`public/swords.svg`):

1. **Using Image Editor**:
   - Open `public/swords.svg` in an image editor
   - Export/resize to each required size
   - Save as PNG files with the names above

2. **Using Online Tools**:
   - Use tools like [CloudConvert](https://cloudconvert.com/svg-to-png) or [Convertio](https://convertio.co/svg-png/)
   - Upload `public/swords.svg`
   - Convert to PNG and resize to each size

3. **Using Command Line** (if you have ImageMagick):
   ```bash
   convert public/swords.svg -resize 16x16 icons/icon16.png
   convert public/swords.svg -resize 32x32 icons/icon32.png
   convert public/swords.svg -resize 48x48 icons/icon48.png
   convert public/swords.svg -resize 128x128 icons/icon128.png
   ```

## Temporary Solution

If you want to test the extension without icons:
1. Create simple colored squares as placeholders
2. Or use any 16x16, 32x32, 48x48, 128x128 PNG images
3. The extension will work, but icons won't match the brand
