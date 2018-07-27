# CKEditor 4

[![GitHub tag](https://img.shields.io/github/tag/ckeditor/ckeditor-dev.svg)](https://github.com/ckeditor/ckeditor-dev)
[![Dependencies](https://img.shields.io/david/ckeditor/ckeditor-dev.svg)](https://david-dm.org/ckeditor/ckeditor-dev)
[![Dev dependencies](https://img.shields.io/david/dev/ckeditor/ckeditor-dev.svg)](https://david-dm.org/ckeditor/ckeditor-dev?type=dev)

[![Join newsletter](https://img.shields.io/badge/join-newsletter-00cc99.svg)](http://eepurl.com/c3zRPr)
[![Twitter URL](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/ckeditor)

A highly configurable browser-based WYSIWYG editor with a borad browser compatibility.

-- screenshot --

## Getting Started

```
npm install --save ckeditor
```

And use it in your website:

```html
<div id="editor">
    <p>This is the editor content.</p>
</div>
<script src="./node_modules/ckeditor/ckeditor.js"></script>
<script>
    CKEDITOR.replace( 'editor' );
</script>
```

Note that you can also load editor using [CDN](https://cdn.ckeditor.com/#ckeditor4).

## Features

* Over 500 plugins in the [Addons Repository](https://ckeditor.com/cke4/addons).
* Pasting from Microsoft Word / Excel.
* Powerful clipboard integration.
* Content quality control with Advanced Content Filter.
* Extensible widget system.
* Improved table selection.
* Accessibility conforming to WCAG / Section 508

## Presets

By default npm package comes in a "standard-all" preset, you can read more on presets it CKEditor 4 presets article.

## Further Resources

* [CKEditor 4 demo](https://ckeditor.com/ckeditor-4/)
* [Documentation](https://docs.ckeditor.com/ckeditor4/latest/)
* [API documentation](https://docs.ckeditor.com/ckeditor4/latest/api/index.html)
* [Configuration reference](https://docs.ckeditor.com/ckeditor4/latest/api/CKEDITOR_config.html)
* [SDK including more samples](https://sdk.ckeditor.com/)

## Browser Support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- |
| IE8, IE9, IE10, IE11, Edge| last version| last version| last version| last version

Find more in the [Browser Compatibility guide](https://docs.ckeditor.com/ckeditor4/latest/guide/dev_browsers.html#officially-supported-browsers).

## Contribute

If you'd like to help the project, follow [our Contribution instructions](https://github.com/ckeditor/ckeditor-dev/blob/master/.github/CONTRIBUTING.md).

## License

Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.

For licensing, see LICENSE.md or <https://ckeditor.com/legal/ckeditor-oss-license>

## Keywords

_`package.json` keywords_