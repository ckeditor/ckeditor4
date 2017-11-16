@bender-ui: collapsed
@bender-tags: 4.8.0, feature, inlinetoolbar
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, floatingspace, inlinetoolbar, sourcearea, list, link, elementspath, language,stylescombo, image

## Complex Context Sample

There are several inline toolbar listeners (from highest priority):

1. `strong;em` selection should show `Bold,Underline` buttons.
1. `a[href];img[*]` selection should show `Link,Unlink` buttons.
1. `li[*]` selection should show `BulletedList,NumberedList` buttons.

### Sample Test Case

1. Click inside bold text in a list.

#### Expected

Toolbar with `Bold,Underline` is shown, as it has higher priority.