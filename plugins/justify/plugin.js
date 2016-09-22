/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Justify commands.
 */

( function() {
	function getAlignment( editor, element, useComputedState ) {
		useComputedState = useComputedState === undefined ? ( editor.config.useComputedState || true ) : useComputedState;
		var align;
		if ( useComputedState )
			align = element.getComputedStyle( 'text-align' );
		else {
			while ( !element.hasAttribute || !( element.hasAttribute( 'align' ) || element.getStyle( 'text-align' ) ) ) {
				var parent = element.getParent();
				if ( !parent )
					break;
				element = parent;
			}
			align = element.getStyle( 'text-align' ) || element.getAttribute( 'align' ) || '';
		}

		// Sometimes computed values doesn't tell.
		align && ( align = align.replace( /(?:-(?:moz|webkit)-)?(?:start|auto)/i, '' ) );

		!align && useComputedState && ( align = element.getComputedStyle( 'direction' ) == 'rtl' ? 'right' : 'left' );

		return align;
	}

	function alignmentIsSupported( widget, value ) {
		return !widget.features || !widget.features.align || widget.features.align[value];
	}

	function justifyCommand( editor, name, value ) {
		this.editor = editor;
		this.name = name;
		this.value = value;
		this.context = 'p';

		var classes = editor.config.justifyClasses,
			blockTag = editor.config.enterMode == CKEDITOR.ENTER_P ? 'p' : 'div';

		if ( classes ) {
			switch ( value ) {
				case 'left':
					this.cssClassName = classes[ 0 ];
					break;
				case 'center':
					this.cssClassName = classes[ 1 ];
					break;
				case 'right':
					this.cssClassName = classes[ 2 ];
					break;
				case 'justify':
					this.cssClassName = classes[ 3 ];
					break;
			}

			this.cssClassRegex = new RegExp( '(?:^|\\s+)(?:' + classes.join( '|' ) + ')(?=$|\\s)' );
			this.requiredContent = blockTag + '(' + this.cssClassName + ')';
		}
		else {
			this.requiredContent = blockTag + '{text-align}';
		}

		this.allowedContent = {
			'caption div h1 h2 h3 h4 h5 h6 p pre td th li': {
				// Do not add elements, but only text-align style if element is validated by other rule.
				propertiesOnly: true,
				styles: this.cssClassName ? null : 'text-align',
				classes: this.cssClassName || null
			}
		};

		// In enter mode BR we need to allow here for div, because when non other
		// feature allows div justify is the only plugin that uses it.
		if ( editor.config.enterMode == CKEDITOR.ENTER_BR )
			this.allowedContent.div = true;
	}

	function onDirChanged( e ) {
		var editor = e.editor;

		var range = editor.createRange();
		range.setStartBefore( e.data.node );
		range.setEndAfter( e.data.node );

		var walker = new CKEDITOR.dom.walker( range ),
			useComputedState = editor.config.useComputedState || true,
			node;

		while ( ( node = walker.next() ) ) {
			if ( node.type == CKEDITOR.NODE_ELEMENT ) {
				// A child with the defined dir is to be ignored.
				if ( !node.equals( e.data.node ) && node.getDirection() ) {
					range.setStartAfter( node );
					walker = new CKEDITOR.dom.walker( range );
					continue;
				}

				if ( CKEDITOR.plugins.widget && CKEDITOR.plugins.widget.isDomWidgetWrapper( node ) ) {
					var widget = editor.widgets.getByElement( node, true );
					var alignment = getAlignment( editor, node, useComputedState );
					var command = editor.getCommand( 'justify' + ( alignment === 'justify' ? 'block' : alignment ) );
					if ( !alignmentIsSupported( widget, command.value ) ) {
						continue;
					}
					if ( widget.setAlignment && !widget.setAlignment( editor, command ) ) {
						range.setStartAfter( node.getLast() );
						walker = new CKEDITOR.dom.walker( range );
						continue;
					}
				}

				// Switch the alignment.
				var classes = editor.config.justifyClasses;
				if ( classes ) {

					// The left align class.
					if ( node.hasClass( classes[ 0 ] ) ) {
						node.removeClass( classes[ 0 ] );
						node.addClass( classes[ 2 ] );
					}
					// The right align class.
					else if ( node.hasClass( classes[ 2 ] ) ) {
						node.removeClass( classes[ 2 ] );
						node.addClass( classes[ 0 ] );
					}
				}

				// Always switch CSS margins.
				var style = 'text-align';
				var align = node.getStyle( style );

				if ( align == 'left' )
					node.setStyle( style, 'right' );
				else if ( align == 'right' )
					node.setStyle( style, 'left' );
			}
		}
	}

	function makeWidgetDoAlignRange( command ) {
		return function( editor, range ) {
			var walker = new CKEDITOR.dom.walker( range ),
				useComputedState = editor.config.useComputedState,
				block = walker.next() || editor.elementPath().lastElement;

			useComputedState = useComputedState === undefined || useComputedState;

			if ( block.type === CKEDITOR.NODE_TEXT ) {
				block = block.getParent();
			}
			if ( CKEDITOR.plugins.widget.isDomWidgetWrapper( block ) ) {
				var style = getComputedStyle( block.$, null ).getPropertyValue( 'display' );
				if ( style !== 'block' && style !== 'table' && block.getParent().getName() !== 'body' ) { //If display is not block-like, don't try to align this element
					block = block.getParent();
				}
			}
			do {
				if ( CKEDITOR.plugins.widget.isDomWidgetWrapper( block ) ) {
					var widget = editor.widgets.getByElement( block, true );
					if ( !alignmentIsSupported( widget, command.value ) ) {
						continue;
					}
					if ( widget.setAlignment && !widget.setAlignment( editor, command ) ) {
						range.setStartAfter( block.getLast() );
						walker = new CKEDITOR.dom.walker( range );
						continue;
					}
				}
				if ( block.isReadOnly() || block.type != CKEDITOR.NODE_ELEMENT ) {
					continue;
				}
				command.doAlignBlock( editor, block, useComputedState );
			} while ( ( block = walker.next() ) );
		};
	}

	justifyCommand.prototype = {
		doAlignBlock: function( editor, block, useComputedState ) {
			block.removeAttribute( 'align' );
			block.removeStyle( 'text-align' );

			// Remove any of the alignment classes from the className.
			var className = this.cssClassName && ( block.$.className = CKEDITOR.tools.ltrim( block.$.className.replace( this.cssClassRegex, '' ) ) );

			var apply = ( this.state == CKEDITOR.TRISTATE_OFF ) && ( !useComputedState || ( getAlignment( editor, block, true ) != this.value ) );

			if ( this.cssClassName ) {
				// Append the desired class name.
				if ( apply )
					block.addClass( this.cssClassName );
				else if ( !className )
					block.removeAttribute( 'class' );
			} else if ( apply ) {
				block.setStyle( 'text-align', this.value );
			}
		},

		doAlignRange: function( editor, range ) {
			if ( CKEDITOR.plugins.widget ) {
				this.doAlignRange = makeWidgetDoAlignRange( this );
				this.doAlignRange( editor, range );
				return;
			}
			var enterMode = editor.config.enterMode,
				useComputedState = editor.config.useComputedState,
				iterator = range.createIterator(),
				block;

			useComputedState = useComputedState === undefined || useComputedState;
			iterator.enlargeBr = enterMode != CKEDITOR.ENTER_BR;

			while ( ( block = iterator.getNextParagraph( enterMode == CKEDITOR.ENTER_P ? 'p' : 'div' ) ) ) {
				if ( !block.isReadOnly() )
					this.doAlignBlock( editor, block, useComputedState );
			}
		},

		exec: function( editor ) {
			var selection = editor.getSelection();

			if ( !selection )
				return;

			var bookmarks = selection.createBookmarks(),
				ranges = selection.getRanges();

			var range;

			for ( var i = ranges.length - 1; i >= 0; i-- ) {
				range = ranges[i];
				this.doAlignRange( editor, range );
			}

			editor.focus();
			editor.forceNextSelectionCheck();
			selection.selectBookmarks( bookmarks );
		},

		refresh: function( editor, path ) {
			var firstBlock = path.block || path.blockLimit;
			var current;
			var widget = editor.widgets ? editor.widgets.focused : false;
			if ( widget ) {
				if ( !alignmentIsSupported( widget, this.value ) ) {
					this.setState( CKEDITOR.TRISTATE_DISABLED );
					return;
				}
				if ( widget.getAlignment ) {
					current = widget.getAlignment( editor, this );
				}
			}
			if ( current === undefined ) {
				firstBlock.getName() != 'body' && ( current = getAlignment( editor, firstBlock, editor.config.useComputedState ) );
			}

			this.setState( current == this.value ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF );
		}
	};

	CKEDITOR.plugins.add( 'justify', {
		// jscs:disable maximumLineLength
		lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'justifyblock,justifycenter,justifyleft,justifyright', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		init: function( editor ) {
			if ( editor.blockless )
				return;

			var left = new justifyCommand( editor, 'justifyleft', 'left' ),
				center = new justifyCommand( editor, 'justifycenter', 'center' ),
				right = new justifyCommand( editor, 'justifyright', 'right' ),
				justify = new justifyCommand( editor, 'justifyblock', 'justify' );

			editor.addCommand( 'justifyleft', left );
			editor.addCommand( 'justifycenter', center );
			editor.addCommand( 'justifyright', right );
			editor.addCommand( 'justifyblock', justify );

			if ( editor.ui.addButton ) {
				editor.ui.addButton( 'JustifyLeft', {
					label: editor.lang.justify.left,
					command: 'justifyleft',
					toolbar: 'align,10'
				} );
				editor.ui.addButton( 'JustifyCenter', {
					label: editor.lang.justify.center,
					command: 'justifycenter',
					toolbar: 'align,20'
				} );
				editor.ui.addButton( 'JustifyRight', {
					label: editor.lang.justify.right,
					command: 'justifyright',
					toolbar: 'align,30'
				} );
				editor.ui.addButton( 'JustifyBlock', {
					label: editor.lang.justify.block,
					command: 'justifyblock',
					toolbar: 'align,40'
				} );
			}

			editor.on( 'dirChanged', onDirChanged );
		}
	} );
} )();

/**
 * List of classes to use for aligning the contents. If it's `null`, no classes will be used
 * and instead the corresponding CSS values will be used.
 *
 * The array should contain 4 members, in the following order: left, center, right, justify.
 *
 *		// Use the classes 'AlignLeft', 'AlignCenter', 'AlignRight', 'AlignJustify'
 *		config.justifyClasses = [ 'AlignLeft', 'AlignCenter', 'AlignRight', 'AlignJustify' ];
 *
 * @cfg {Array} [justifyClasses=null]
 * @member CKEDITOR.config
 */
