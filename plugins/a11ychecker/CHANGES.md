CKEditor Accessibility Checker Changelog
========================================

[CKEditor Accessibility Checker](https://cksource.com/accessibility-checker/)

Copyright (c) 2014-2016, CKSource - Frederico Knabben. All rights reserved.

## Version 1.1.0

New Features:

* [#228](https://github.com/cksource/ckeditor-plugin-a11ychecker/issues/228): Added compatibility with new default `moono-lisa` skin.

Fixed Issues:

* [#201](https://github.com/cksource/ckeditor-plugin-a11ychecker/issues/201): `imgShouldNotHaveTitle` Quick Fix - if the image has both title and alt attributes, the alt will be used as a default value.

* [#185](https://github.com/cksource/ckeditor-plugin-a11ychecker/issues/185): Added more verbose error message when jQuery is missing in Accessibility Checker built version.

## Version 1.0

A brand new CKEditor plugin that lets you inspect accessibility level of content created in CKEditor and immediately solve any issues that are found. For an overview of its features, see the [Accessibility Checker website](https://cksource.com/accessibility-checker/).

It is built upon three key elements:

* User Interface optimized for quick problem solving.
* Flexibility allowing you to use the accessibility checking engine of your choice (default: [Quail](http://quailjs.org/)).
* Quick Fix feature letting you fix common problems fully automatically!

All of this comes bundled with a tight integration with CKEditor.

The first release includes three language versions:

* English
* German (provided by Sebastian Peilicke of [Sopra Steria GmbH](http://www.soprasteria.de/de))
* Dutch (provided by [Dutch Government](https://www.government.nl/))
