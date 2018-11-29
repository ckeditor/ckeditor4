@bender-tags: feature, 4.11.0, 2224

1. Focus text area.
2. Type in some value with any valid CSS unit.
3. Press `Enter` or blur text area.
4. Try different values, including negative ones.

## Expected:

- Boxes changes their `margin-right` to match passed value.
- Both boxes has visually same width.
- Boxes `margin-right` is displayed as text.

### Note:

- Percentage values aren't converted.
- Incorrect values aren't validated in any way.
