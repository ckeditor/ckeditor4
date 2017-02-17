CKEditor "Kama" Skin
====================

The Kama skin is currently the default skin of CKEditor. It is the one included on the standard CKEditor distributions. It is actively maintained by the CKEditor core developers.

For in-depth information about skins, please check the "CKEditor Skin SDK" documentation:
http://docs.cksource.com/CKEditor_4.x/Skin_SDK

Directory Structure
-------------------

- **editor.css**: the main CSS file. It is split in several different files, for easier maintenance.
- **dialog.css**: the CSS files for dialogs.
- **editor_XYZ.css** and **dialog_XYZ.css**: browser specific CSS hacks.
- **skin.js**: registers the skin, its browser specific files and its icons and defines the Chameleon feature.
- **icons/**: contains all skin defined icons.
- **images/**: contains a fill general used images.

License
-------

Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.

Licensed under the terms of any of the following licenses at your choice: [GPL](http://www.gnu.org/licenses/gpl.html), [LGPL](http://www.gnu.org/licenses/lgpl.html) and [MPL](http://www.mozilla.org/MPL/MPL-1.1.html).

See LICENSE.md for more information.
