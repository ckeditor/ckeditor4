@bender-tags: 4.8.0, bug, 698
@bender-ui: collapsed
@bender-ckeditor-plugins: widget, wysiwygarea, toolbar, sourcearea, basicstyles


**Scenario 1:**
1. Open developer console.
2. Select `ipsum`.
2. Click `Bold` button.
4. Click `Source` button.

**Scenario 2:**

1. Open developer console.
2. Select `Title lorem`.
3. Press `Delete` key.
4. Click `Source` button.

### Expected result:

No error occurs in the developer console.

### Unexpected result:

An error in the developer console occurred: `Uncaught TypeError: Cannot read property 'attributes' of null`
