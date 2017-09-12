/**
* Copyright (c) 2017 University of Illinois - Nicholas Hoyt and Jon Gunderson. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.plugins.add( 'a11yfirst', {
  init: function ( editor ) {
    // Pull request: Add template and method in plugins/listblock/plugin.js
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
  },

  overrideButtonSetState: function () {
    // Pull request: Remove else clause from setState in plugins/button/plugin.js
    CKEDITOR.ui.button.prototype.setState = function ( state ) {
      if ( this._.state == state )
        return false;

      this._.state = state;

      var element = CKEDITOR.document.getById( this._.id );

      if ( element ) {
        element.setState( state, 'cke_button' );

        state == CKEDITOR.TRISTATE_DISABLED ?
          element.setAttribute( 'aria-disabled', true ) :
          element.removeAttribute( 'aria-disabled' );

        if ( !this.hasArrow ) {
          // Note: aria-pressed attribute should not be added to menuButton instances. (#11331)
          state == CKEDITOR.TRISTATE_ON ?
            element.setAttribute( 'aria-pressed', true ) :
            element.removeAttribute( 'aria-pressed' );
        }
        // Do not update button label by appending (Selected)
        /*
        else {
          var newLabel = state == CKEDITOR.TRISTATE_ON ?
            this._.editor.lang.button.selectedLabel.replace( /%1/g, this.label ) : this.label;
          CKEDITOR.document.getById( this._.id + '_label' ).setText( newLabel );
        }
        */

        return true;
      }
      else {
        return false;
      }
    };
  }
});
