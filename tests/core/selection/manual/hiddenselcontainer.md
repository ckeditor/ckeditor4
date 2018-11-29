@bender-tags: 4.11.0, bug, 898
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, image2

Click on the image

## Expected:

There shouldn't be any visible text around the image.

## Unexpected:

There is a visible text around the image.

# Test steps for Firefox with JAWS text reader:

1. Open JAWS.
1. Place caret in the text, eg: `Test: ^`.
1. Use right arrow to select the image.

## Expected:

Text reader reads image alt text:

	Lorem ipsum dolor sit amet, consetetur sadipscing elitr...

## Unexpected:

Text reader doesn't read image alt text.
