# CKEditor 4 - The best browser-based WYSIWYG editor

[![GitHub tag](https://img.shields.io/github/tag/ckeditor/ckeditor-dev.svg)](https://github.com/ckeditor/ckeditor-dev)
[![Dependencies](https://img.shields.io/david/ckeditor/ckeditor-dev.svg)](https://david-dm.org/ckeditor/ckeditor-dev)
[![Dev dependencies](https://img.shields.io/david/dev/ckeditor/ckeditor-dev.svg)](https://david-dm.org/ckeditor/ckeditor-dev?type=dev)

A highly configurable WYSIWYG HTML editor with hundreds of features, from creating rich text content with captioned images, videos, tables, or media embeds to pasting from Word and drag&drop image upload.

Supports a broad range of browsers, including legacy ones.

![CKEditor 4 screenshot](https://c.cksource.com/a/1/img/npm/ckeditor4.png)

## Getting started

### Using [NPM package](https://www.npmjs.com/package/ckeditor)

```
npm install --save ckeditor
```

Use it on your website:

```html
<div id="editor">
    <p>This is the editor content.</p>
</div>
<script src="./node_modules/ckeditor/ckeditor.js"></script>
<script>
    CKEDITOR.replace( 'editor' );
</script> 
```

### Using [CDN](https://cdn.ckeditor.com/#ckeditor4)

Simply load CKEditor 4 script from CDN:

```html
<div id="editor">
    <p>This is the editor content.</p>
</div>
<script src="https://cdn.ckeditor.com/4.12.1/standard/ckeditor.js"></script>
<script>
    CKEDITOR.replace( 'editor' );
</script>
```

### Integrating with Angular and React frameworks

Refer to official usage guides for [ckeditor4-angular](https://www.npmjs.com/package/ckeditor4-angular#usage) and [ckeditor4-react](https://www.npmjs.com/package/ckeditor4-react#usage) packages.

### Manual download

Visit [CKEditor 4 download section](https://ckeditor.com/ckeditor-4/download/) on [CKEditor website](https://ckeditor.com/ckeditor-4/)
to download ready-to-use CKEditor 4 packages or to create customized CKEditor 4 build.

## Features

* Over 500 plugins in the [Add-ons Repository](https://ckeditor.com/cke4/addons).
* Pasting from Microsoft Word and Excel.
* Drag&drop image uploads.
* Media embeds to insert videos, tweets, maps, slideshows.
* Powerful clipboard integration.
* Content quality control with Advanced Content Filter.
* Extensible widget system.
* Custom table selection.
* Accessibility conforming to WCAG and Section 508.
* Over 60 localizations available with full RTL support.

## Browser Support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome (Android) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| IE8, IE9, IE10, IE11, Edge| latest version| latest version| latest version| latest version| latest version| latest version

Find out more in the [Browser Compatibility guide](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_browsers.html#officially-supported-browsers).

---

## Working with `ckeditor-dev` repostiory

**Attention**: The code in this repository should be used locally and for development purposes only. We do not recommend using it in production environment because the user experience will be very limited.

### Code Installation

There is no special installation procedure to install the development code.
Simply clone it to any local directory and you are set.

### Available Branches

This repository contains the following branches:

  - **master** &ndash; Development of the upcoming minor release.
  - **major** &ndash; Development of the upcoming major release.
  - **stable** &ndash; Latest stable release tag point (non-beta).
  - **latest** &ndash; Latest release tag point (including betas).
  - **release/A.B.x** (e.g. 4.0.x, 4.1.x) &ndash; Release freeze, tests and tagging.
    Hotfixing.

Note that both **master** and **major** are under heavy development. Their
code did not pass the release testing phase, though, so it may be unstable.

Additionally, all releases have their respective tags in the following form: 4.4.0,
4.4.1, etc.

### Samples

The `samples/` folder contains some examples that can be used to test your
installation. Visit [CKEditor 4 Examples](https://ckeditor.com/docs/ckeditor4/latest/examples/index.html) for plenty of samples
showcasing numerous editor features, with source code readily available to view, copy
and use in your own solution.

### Code Structure

The development code contains the following main elements:

  - Main coding folders:
    - `core/` &ndash; The core API of CKEditor 4. Alone, it does nothing, but
    it provides the entire JavaScript API that makes the magic happen.
    - `plugins/` &ndash; Contains most of the plugins maintained by the CKEditor 4 core team.
    - `skin/` &ndash; Contains the official default skin of CKEditor 4.
    - `dev/` &ndash; Contains some developer tools.
    - `tests/` &ndash; Contains the CKEditor 4 tests suite.

### Building a Release

A release-optimized version of the development code can be easily created
locally. The `dev/builder/build.sh` script can be used for that purpose:

	> ./dev/builder/build.sh

A "release ready" working copy of your development code will be built in the new
`dev/builder/release/` folder. An Internet connection is necessary to run the
builder, for its first time at least.

### Testing Environment

Read more on how to set up the environment and execute tests in the [CKEditor 4 Testing Environment](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_tests.html) guide.

### Reporting Issues

Please use the [CKEditor 4 GitHub issue page](https://github.com/ckeditor/ckeditor-dev/issues) to report bugs and feature requests.

### License

Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.

For licensing, see LICENSE.md or [https://ckeditor.com/legal/ckeditor-oss-license](https://ckeditor.com/legal/ckeditor-oss-license)
