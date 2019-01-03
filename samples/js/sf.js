/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
/* exported SF */

'use strict';

var SF = ( function() {
	var SF = {};

	SF.attachListener = function( elem, evtName, callback ) {
		if ( elem.addEventListener ) {
			elem.addEventListener( evtName, callback, false );
		} else if ( elem.attachEvent ) {
			elem.attachEvent( 'on' + evtName , function() {
				callback.apply( elem, arguments );
			} );
		} else {
			throw new Error( 'Could not attach event.' );
		}
	};

	SF.indexOf = ( function() {
		var indexOf = Array.prototype.indexOf;

		if ( indexOf === 'function' ) {
			return function( arr, elem ) {
				return indexOf.call( arr, elem );
			};
		} else {
			return function( arr, elem ) {
				var max = arr.length;

				for ( var i = 0; i < max; i++ ) {
					if ( arr[ i ] === elem ) {
						return i;
					}
				}

				return -1;
			};
		}

	}() );

	SF.accept = function( node, visitor ) {
		var children;

		// Handling node as a node and array
		if ( node.children ) {
			children = node.children;

			visitor( node );
		} else if ( typeof node.length === 'number' ) {
			children = node;
		}

		var i = children ? ( children.length || 0 ) : 0;
		while ( i-- ) {
			SF.accept( children[ i ], visitor );
		}
	};

	SF.getByClass = ( function(  ) {
		var getByClass = document.getElementsByClassName;
		if ( typeof getByClass === 'function' ) {
			return function( root, className ) {
				if ( typeof root === 'string' ) {
					className = root;
					root = document;
				}

				return getByClass.call( root, className );
			};
		}

		return function( root, className ) {
			if ( typeof root === 'string' ) {
				className = root;
				root = document.getElementsByTagName( 'html' )[ 0 ];
			}
			var results = [];

			SF.accept( root, function( elem ) {
				if ( SF.classList.contains( elem, className ) ) {
					results.push( elem );
				}
			} );

			return results;
		};
	}() );

	SF.classList = {};

	SF.classList.add = function( elem, className ) {
		var classes = parseClasses( elem );
		classes.push( className );

		elem.attributes.setNamedItem( createClassAttr( classes ) );
	};

	SF.classList.remove = function( elem, className ) {
		var classes = parseClasses( elem, className ),
			foundAt = SF.indexOf( classes, className );

		if ( foundAt === -1 ) {
			return;
		}

		classes.splice( foundAt, 1 );
		elem.attributes.setNamedItem( createClassAttr( classes ) );
	};

	SF.classList.contains = function( elem, className ) {
		return findIndex( elem, className ) !== -1;
	};

	SF.classList.toggle = function( elem, className ) {
		this.contains( elem, className ) ? this.remove( elem, className ) : this.add( elem, className );
	};

	function findIndex( elem, className ) {
		return SF.indexOf( parseClasses( elem ), className );
	}

	function parseClasses( elem ) {
		var classAttr = elem.attributes ? elem.attributes.getNamedItem( 'class' ) : null;

		return classAttr ? classAttr.value.split( ' ' ) : [];
	}

	function createClassAttr( classesArray ) {
		var attr = document.createAttribute( 'class' );

		attr.value = classesArray.join( ' ' );

		return attr;
	}

	return SF;
}() );

/* global SF, picoModal */

'use strict';

( function() {
	// Purges all styles in passed object.
	function purgeStyles( styles ) {
		for ( var i in styles ) {
			delete styles[ i ];
		}
	}

	SF.modal = function( config ) {
		// Modal should use the same style set as the rest of the page (.content component).
		config.modalClass = 'modal content';
		config.closeClass = 'modal-close';

		// Purge all pre-defined pico styles. Use the lessfile instead.
		config.modalStyles = purgeStyles;

		// Close button styles are customized via lessfile.
		config.closeStyles = purgeStyles;

		var userDefinedAfterCreate = config.afterCreate,
			userDefinedAfterClose = config.afterClose;

		// Close modal on ESC key.
		function onKeyDown( event ) {
			if ( event.keyCode == 27 ) {
				modal.close();
			}
		}

		// Use afterCreate as a config option rather than function chain.
		config.afterCreate = function( modal ) {
			userDefinedAfterCreate && userDefinedAfterCreate( modal );

			window.addEventListener( 'keydown', onKeyDown );
		};

		// Use afterClose as a config option rather than function chain.
		config.afterClose = function( modal ) {
			userDefinedAfterClose && userDefinedAfterClose( modal );

			window.removeEventListener( 'keydown', onKeyDown );
		};

		var modal = new picoModal( config )
			.afterCreate( config.afterCreate )
			.afterClose( config.afterClose );

		return modal;
	};
} )();
'use strict';

( function() {
	// All .tree-a elements in DOM.
	var expanders = SF.getByClass( 'toggler' );

	var i = expanders.length;
	while ( i-- ) {
		var expander = expanders[ i ];

		SF.attachListener( expander, 'click', function() {
			var containsIcon = SF.classList.contains( this, 'icon-toggler-expanded' ) || SF.classList.contains( this, 'icon-toggler-collapsed' ),
				related = document.getElementById( this.getAttribute( 'data-for' ) );

			SF.classList.toggle( this, 'collapsed' );

			if ( SF.classList.contains( this, 'collapsed' ) ) {
				SF.classList.add( related, 'collapsed' );
				if ( containsIcon ) {
					SF.classList.remove( this, 'icon-toggler-expanded' );
					SF.classList.add( this, 'icon-toggler-collapsed' );
				}
			} else {
				SF.classList.remove( related, 'collapsed' );
				if ( containsIcon ) {
					SF.classList.remove( this, 'icon-toggler-collapsed' );
					SF.classList.add( this, 'icon-toggler-expanded' );
				}
			}
		} );
	}
} )();
/* global SF */

'use strict';

( function() {
	// All .tree-a elements in DOM.
	var trees = SF.getByClass( 'tree-a' );

	for ( var i = trees.length; i--; ) {
		var tree = trees[ i ];

		SF.attachListener( tree, 'click', function( evt ) {
			var target = evt.target || evt.srcElement;

			// Collapse or expand item groups.
			if ( target.nodeName === 'H2' && !SF.classList.contains( target, 'tree-a-no-sub' ) ) {
				SF.classList.toggle( target, 'tree-a-active' );
			}
		} );
	}
} )();
// jshint ignore:start
// jscs:disable
/**
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * A self-contained modal library
 */
(function(window, document) {
    "use strict";

    /** Returns whether a value is a dom node */
    function isNode(value) {
        if ( typeof Node === "object" ) {
            return value instanceof Node;
        }
        else {
            return value &&
                typeof value === "object" &&
                typeof value.nodeType === "number";
        }
    }

    /** Returns whether a value is a string */
    function isString(value) {
        return typeof value === "string";
    }

    /**
     * Generates observable objects that can be watched and triggered
     */
    function observable() {
        var callbacks = [];
        return {
            watch: callbacks.push.bind(callbacks),
            trigger: function( modal ) {

                var unprevented = true;
                var event = {
                    preventDefault: function preventDefault () {
                        unprevented = false;
                    }
                };

                for (var i = 0; i < callbacks.length; i++) {
                    callbacks[i](modal, event);
                }

                return unprevented;
            }
        };
    }


    /**
     * A small interface for creating and managing a dom element
     */
    function Elem( elem ) {
        this.elem = elem;
    }

    /**
     * Creates a new div
     */
    Elem.div = function ( parent ) {
        var elem = document.createElement('div');
        (parent || document.body).appendChild(elem);
        return new Elem(elem);
    };

    Elem.prototype = {

        /** Creates a child of this node */
        child: function () {
            return Elem.div(this.elem);
        },

        /** Applies a set of styles to an element */
        stylize: function(styles) {
            styles = styles || {};

            if ( typeof styles.opacity !== "undefined" ) {
                styles.filter =
                    "alpha(opacity=" + (styles.opacity * 100) + ")";
            }

            for (var prop in styles) {
                if (styles.hasOwnProperty(prop)) {
                    this.elem.style[prop] = styles[prop];
                }
            }

            return this;
        },

        /** Adds a class name */
        clazz: function (clazz) {
            this.elem.className += " " + clazz;
            return this;
        },

        /** Sets the HTML */
        html: function (content) {
            if ( isNode(content) ) {
                this.elem.appendChild( content );
            }
            else {
                this.elem.innerHTML = content;
            }
            return this;
        },

        /** Adds a click handler to this element */
        onClick: function(callback) {
            this.elem.addEventListener('click', callback);
            return this;
        },

        /** Removes this element from the DOM */
        destroy: function() {
            document.body.removeChild(this.elem);
        },

        /** Hides this element */
        hide: function() {
            this.elem.style.display = "none";
        },

        /** Shows this element */
        show: function() {
            this.elem.style.display = "block";
        },

        /** Sets an attribute on this element */
        attr: function ( name, value ) {
            this.elem.setAttribute(name, value);
            return this;
        },

        /** Executes a callback on all the ancestors of an element */
        anyAncestor: function ( predicate ) {
            var elem = this.elem;
            while ( elem ) {
                if ( predicate( new Elem(elem) ) ) {
                    return true;
                }
                else {
                    elem = elem.parentNode;
                }
            }
            return false;
        }
    };


    /** Generates the grey-out effect */
    function buildOverlay( getOption, close ) {
        return Elem.div()
            .clazz("pico-overlay")
            .clazz( getOption("overlayClass", "") )
            .stylize({
                display: "block",
                position: "fixed",
                top: "0px",
                left: "0px",
                height: "100%",
                width: "100%",
                zIndex: 10000
            })
            .stylize(getOption('overlayStyles', {
                opacity: 0.5,
                background: "#000"
            }))
            .onClick(function () {
                if ( getOption('overlayClose', true) ) {
                    close();
                }
            });
    }

    /** Builds the content of a modal */
    function buildModal( getOption, close ) {
        var width = getOption('width', 'auto');
        if ( typeof width === "number" ) {
            width = "" + width + "px";
        }

        var elem = Elem.div()
            .clazz("pico-content")
            .clazz( getOption("modalClass", "") )
            .stylize({
                display: 'block',
                position: 'fixed',
                zIndex: 10001,
                left: "50%",
                top: "50px",
                width: width,
                '-ms-transform': 'translateX(-50%)',
                '-moz-transform': 'translateX(-50%)',
                '-webkit-transform': 'translateX(-50%)',
                '-o-transform': 'translateX(-50%)',
                'transform': 'translateX(-50%)'
            })
            .stylize(getOption('modalStyles', {
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "5px"
            }))
            .html( getOption('content') )
            .attr("role", "dialog")
            .onClick(function (event) {
                var isCloseClick = new Elem(event.target)
                    .anyAncestor(function (elem) {
                        return /\bpico-close\b/.test(elem.elem.className);
                    });
                if ( isCloseClick ) {
                    close();
                }
            });

        return elem;
    }

    /** Builds the close button */
    function buildClose ( elem, getOption ) {
        if ( getOption('closeButton', true) ) {
            return elem.child()
                .html( getOption('closeHtml', "&#xD7;") )
                .clazz("pico-close")
                .clazz( getOption("closeClass") )
                .stylize( getOption('closeStyles', {
                    borderRadius: "2px",
                    cursor: "pointer",
                    height: "15px",
                    width: "15px",
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    fontSize: "16px",
                    textAlign: "center",
                    lineHeight: "15px",
                    background: "#CCC"
                }) );
        }
    }

    /** Builds a method that calls a method and returns an element */
    function buildElemAccessor( builder ) {
        return function () {
            return builder().elem;
        };
    }


    /**
     * Displays a modal
     */
    function picoModal(options) {

        if ( isString(options) || isNode(options) ) {
            options = { content: options };
        }

        var afterCreateEvent = observable();
        var beforeShowEvent = observable();
        var afterShowEvent = observable();
        var beforeCloseEvent = observable();
        var afterCloseEvent = observable();

        /**
         * Returns a named option if it has been explicitly defined. Otherwise,
         * it returns the given default value
         */
        function getOption ( opt, defaultValue ) {
            var value = options[opt];
            if ( typeof value === "function" ) {
                value = value( defaultValue );
            }
            return value === undefined ? defaultValue : value;
        }

        /** Hides this modal */
        function forceClose () {
            shadowElem().hide();
            modalElem().hide();
            afterCloseEvent.trigger(iface);
        }

        /** Gracefully hides this modal */
        function close () {
            if ( beforeCloseEvent.trigger(iface) ) {
                forceClose();
            }
        }

        /** Wraps a method so it returns the modal interface */
        function returnIface ( callback ) {
            return function () {
                callback.apply(this, arguments);
                return iface;
            };
        }


        // The constructed dom nodes
        var built;

        /** Builds a method that calls a method and returns an element */
        function build ( name ) {
            if ( !built ) {
                var modal = buildModal(getOption, close);
                built = {
                    modal: modal,
                    overlay: buildOverlay(getOption, close),
                    close: buildClose(modal, getOption)
                };
                afterCreateEvent.trigger(iface);
            }
            return built[name];
        }

        var modalElem = build.bind(window, 'modal');
        var shadowElem = build.bind(window, 'overlay');
        var closeElem = build.bind(window, 'close');


        var iface = {

            /** Returns the wrapping modal element */
            modalElem: buildElemAccessor(modalElem),

            /** Returns the close button element */
            closeElem: buildElemAccessor(closeElem),

            /** Returns the overlay element */
            overlayElem: buildElemAccessor(shadowElem),

            /** Shows this modal */
            show: function () {
                if ( beforeShowEvent.trigger(iface) ) {
                    shadowElem().show();
                    closeElem();
                    modalElem().show();
                    afterShowEvent.trigger(iface);
                }
                return this;
            },

            /** Hides this modal */
            close: returnIface(close),

            /**
             * Force closes this modal. This will not call beforeClose
             * events and will just immediately hide the modal
             */
            forceClose: returnIface(forceClose),

            /** Destroys this modal */
            destroy: function () {
                modalElem = modalElem().destroy();
                shadowElem = shadowElem().destroy();
                closeElem = undefined;
            },

            /**
             * Updates the options for this modal. This will only let you
             * change options that are re-evaluted regularly, such as
             * `overlayClose`.
             */
            options: function ( opts ) {
                options = opts;
            },

            /** Executes after the DOM nodes are created */
            afterCreate: returnIface(afterCreateEvent.watch),

            /** Executes a callback before this modal is closed */
            beforeShow: returnIface(beforeShowEvent.watch),

            /** Executes a callback after this modal is shown */
            afterShow: returnIface(afterShowEvent.watch),

            /** Executes a callback before this modal is closed */
            beforeClose: returnIface(beforeCloseEvent.watch),

            /** Executes a callback after this modal is closed */
            afterClose: returnIface(afterCloseEvent.watch)
        };

        return iface;
    }

    if ( typeof window.define === "function" && window.define.amd ) {
        window.define(function () {
            return picoModal;
        });
    }
    else {
        window.picoModal = picoModal;
    }

}(window, document));

// jscs:enable
// jshint ignore:end
