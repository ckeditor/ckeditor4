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
