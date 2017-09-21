CKEditor Accessibility Checker
==================================================

# Overview

This package contains the distribution version of Accessibility Checker.

## Requirements

* CKEditor **4.3.0** or later.
* [Balloon Panel](http://ckeditor.com/addon/balloonpanel) plugin for CKEditor.
* jQuery **1.x** or later in order to run [Quail](http://quailjs.org/).

## Browser Support

Accessibility Checker has [the same browser compatibility as CKEditor](http://docs.ckeditor.com/#!/guide/dev_browsers), with the following exceptions:

* Internet Explorer 8 is not supported.
* Internet Explorer 9 Quirks Mode is not supported.

## Installation

The recommended way to install Accessibility Checker is through [CKBuilder](http://ckeditor.com/builder).

Select Accessibility Checker from the list of Available Plugins and add it to your editor build - CKBuilder will automatically resolve the dependencies for you and include all necessary plugins in your configuration.

### Limitations

**Running on local filesystem:** You cannot run Accessibility Checker on a local filesystem, since Quail uses an `XMLHttpRequest` for fetching its resources. This is not allowed when working with the `file://` scheme.

## License

Copyright (c) 2014-2016 CKSource - Frederico Knabben. All rights reserved.<br>
Licensed under the terms of the [GNU General Public License Version 2 or later (the "GPL")](http://www.gnu.org/licenses/gpl.html).

See LICENSE.md for more information.
