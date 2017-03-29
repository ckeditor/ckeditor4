/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.add( 'a11yfirst', {
  init: function ( editor ) {
    var listSeparator = CKEDITOR.addTemplate( 'panel-list-separator',
      '<div id="{id}" role="separator" style="border-bottom: 1px solid #d1d1d1"></div>' );

    CKEDITOR.ui.listBlock.prototype.addSeparator = function () {
      this._.close();
      var id = CKEDITOR.tools.getNextId();
      this._.pendingHtml.push( listSeparator.output( { id: id } ) );
    };

    CKEDITOR.ui.richCombo.prototype.addSeparator = function () {
      this._.list.addSeparator();
    };
  }
});
