@bender-tags: 4.11.3, 1986, bug
@bender-ui: collapsed

# Test scenario

1. Use checkboxes to select allowed cell properties.
1. Use context menu on editor to open cell properties.

## Expected

- Cell properties dialog options are matching selected checkboxes.
- If none is selected then cell properties is not displayed in context menu.

## Unexpected

- Dialog options are different than selected checkboxes.

## Note:

- Selecting/unselecting checkboxes destroys and creates new editor, so visible flickering may occur.
