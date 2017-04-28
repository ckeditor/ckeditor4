# KCFinder web file manager
http://kcfinder.sunhater.com  
Pavel Tzonkov (sunhater@sunhater.com)

## Overview
KCFinder is free open-source replacement of CKFinder web file manager. It can be integrated into FCKeditor, CKEditor, and TinyMCE WYSIWYG web editors (or your custom web applications) to upload and manage images, flash movies, and other files that can be embedded into an editor's generated HTML content.

## Licenses
* GNU General Public License, version 3
* GNU Lesser General Public License, version 3

## Features
* Ajax engine with JSON responses
* Multiple files upload
* Upload files using HTML5 drag and drop from local file manager
* Download multiple files or a folder as single ZIP file
* Clipboard for copying, moving and downloading multiple files
* Easy to integrate and configure in web applications
* Option to select and return several files. For custom applications only
* Auto resize uploaded images. Configurable maximum image resolution
* PNG watermark support
* Configurable thumbnail resolution
* Automaticaly rotate and/or flip uploaded images depending on the orientation info EXIF tag if it exist
* Multiple themes support
* Multilanguage system
* Preview images in full size

## Compatibility
* KCFinder is officialy tested on Apache 2 web server only. Probably it will works on other web servers. If your web server does not support .htaccess files, you should take care turning off script execution in the upload directory.
* PHP 5.3 or better is required. Safe mode should be off.
* At least one of these PHP extensions is required: GD, ImageMagick or GraphicsMagick.
* To work with client-side HTTP cache, the PHP must be installed as Apache module.
* KCFinder supports Fileinfo PHP extension for MIME type detection for uploaded files. If you plan to use this feature, you should to load Fileinfo extension.
* PHP ZIP extension should be loaded in order to have an option to download multiple files and directories as single ZIP file.
* Automatic rotating and flipping images requires PHP EXIF extension.
* Browser side code requires modern browser. KCFinder does not work in Internet Explorer 6, 7 and 8, but you can use Google Chrome Frame ActiveX plugin to get it working.
