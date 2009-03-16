/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'floatpanel', {
	requires: [ 'panel' ]
});

(function() {
	var panels = {};

	function getPanel( editor, doc, parentElement, definition, level ) {
		// Generates the panel key: docId-eleId-CSSs
		var key = doc.getUniqueId() + '-' + parentElement.getUniqueId() +
						'-' + editor.skinName +
						( ( definition.css && ( '-' + definition.css ) ) || '' ) +
						( ( level && ( '-' + level ) ) || '' );

		var panel = panels[ key ];

		if ( !panel ) {
			panel = panels[ key ] = new CKEDITOR.ui.panel( doc, definition );
			panel.element = parentElement.append( CKEDITOR.dom.element.createFromHtml( panel.renderHtml( editor ), doc ) );

			panel.element.setStyles({
				display: 'none',
				position: 'absolute'
			});
		}

		return panel;
	}

	CKEDITOR.ui.floatPanel = CKEDITOR.tools.createClass({
		$: function( editor, parentElement, definition, level ) {
			definition.forceIFrame = true;

			var doc = parentElement.getDocument(),
				panel = getPanel( editor, doc, parentElement, definition, level || 0 ),
				element = panel.element,
				iframe = element.getFirst().getFirst();

			this.element = element;

			this._ = {
				// The panel that will be floating.
				panel: panel,
				parentElement: parentElement,
				definition: definition,
				document: doc,
				iframe: iframe,
				children: []
			}
		},

		proto: {
			addBlock: function( name, block ) {
				return this._.panel.addBlock( name, block );
			},

			addListBlock: function( name, multiSelect ) {
				return this._.panel.addListBlock( name, multiSelect );
			},

			getBlock: function( name ) {
				return this._.panel.getBlock( name );
			},

			showBlock: function( name, offsetParent, corner, offsetX, offsetY ) {
				var panel = this._.panel,
					block = panel.showBlock( name );

				var element = this.element,
					iframe = this._.iframe,
					position = offsetParent.getDocumentPosition( element.getDocument() );

				var left = position.x + ( offsetX || 0 ),
					top = position.y + ( offsetY || 0 );

				if ( corner == 2 || corner == 3 )
					left += offsetParent.$.offsetWidth - 1;

				if ( corner == 3 || corner == 4 )
					top += offsetParent.$.offsetHeight - 1;

				element.setStyles({
					left: left + 'px',
					top: top + 'px',
					display: ''
				});

				if ( block.autoSize ) {
					function setHeight() {
						element.getFirst().setStyle( 'height', block.element.$.scrollHeight + 'px' );
					}

					if ( !CKEDITOR.env.gecko || panel.isLoaded )
						setHeight();
					else
						panel.onLoad = setHeight;
				} else
					element.getFirst().removeStyle( 'height' );

				// Configure the IFrame blur event. Do that only once.
				if ( !this._.blurSet ) {
					// Non IE prefer the event into a window object.
					var focused = CKEDITOR.env.ie ? iframe : new CKEDITOR.dom.window( iframe.$.contentWindow );

					focused.on( 'blur', function() {
						if ( !this._.activeChild )
							this.hide();
					}, this );

					focused.on( 'focus', function() {
						this._.focused = true;
						this.hideChild();
					}, this );

					this._.blurSet = 1;
				}

				// Set the IFrame focus, so the blur event gets fired.
				setTimeout( function() {
					iframe.$.contentWindow.focus();
				}, 0 );

				if ( this.onShow )
					this.onShow.call( this );
			},

			hide: function() {
				if ( !this.onHide || this.onHide.call( this ) !== true ) {
					this.hideChild();
					this.element.setStyle( 'display', 'none' );
				}
			},

			showAsChild: function( panel, blockName, offsetParent, corner, offsetX, offsetY ) {
				this.hideChild();

				panel.onHide = CKEDITOR.tools.bind( function() {
					// Use a timeout, so we give time for this menu to get
					// potentially focused.
					CKEDITOR.tools.setTimeout( function() {
						if ( !this._.focused )
							this.hide();
					}, 0, this );
				}, this );

				this._.activeChild = panel;
				this._.focused = false;

				panel.showBlock( blockName, offsetParent, corner, offsetX, offsetY );
			},

			hideChild: function() {
				var activeChild = this._.activeChild;

				if ( activeChild ) {
					delete activeChild.onHide;
					delete this._.activeChild;
					activeChild.hide();
				}
			}
		}
	});
})();
