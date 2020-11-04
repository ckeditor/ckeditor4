/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

 /**
  * @fileoverview Defines the {@link CKEDITOR.tools.style.Color} normalizer class
  * 		that parse color string code other formats.
  */

  CKEDITOR.tools.style.Color = CKEDITOR.tools.createClass( {
		$: function (colorCode) {
			this._originalCode = colorCode;
		},

		_: {
			_originalCode: ''
		}
	  }
  );
