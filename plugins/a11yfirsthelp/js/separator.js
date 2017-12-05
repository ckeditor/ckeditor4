var listSeparator = CKEDITOR.addTemplate( 'panel-list-separator',
  '<div id="{id}" role="separator" style="border-bottom: 1px solid #d1d1d1"></div>' );

CKEDITOR.ui.listBlock.prototype.addSeparator = function () {
  this._.close();
  var id = CKEDITOR.tools.getNextId();
  this._.pendingHtml.push( listSeparator.output( { id: id } ) );
};

// Pull request: Add method in plugins/richcombo/plugin.js
CKEDITOR.ui.richCombo.prototype.addSeparator = function () {
  this._.list.addSeparator();
};
