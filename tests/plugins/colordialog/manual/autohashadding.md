@bender-tags: manual, tc, 4.8.0, feature, 565
@bender-ui: collapsed
@bender-ckeditor-plugins: colorbutton,colordialog,toolbar,wysiwygarea,sourcearea

1. Select text
1. Press `Text Colour`
1. Use option `More colours`
1. Type **by yourself** color in hex notation **without** `#` at the beginning. E.g (`880088`). **Do not use color picking from the left side.**
1. Color of seleted text should change
1. In source `#` should be added to color value
1. Now open `More colours` again and type 3-hexdigit color, also **without** `#` at the beginning. E.g (`0CF`)
1. Color also should change and source should be modifiaed with `#`
1. Now try to put values which are not correct. Like 4 digits, or number inside another string, or anything else what came to your mind. Those should not get additional `#` at the beginning
1. Repeat above steps for `Background Colour`
