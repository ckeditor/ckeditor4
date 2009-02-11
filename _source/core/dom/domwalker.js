/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	var fireDomWalkerEvent = function( transistionType, fromNode, toNode ) {
			var eventData = { from: fromNode, to: toNode, type: transistionType };
			this.fire( transistionType, eventData );
			this._.actionEvents.push( eventData );
		};

	CKEDITOR.dom.domWalker = function( node ) {
		if ( arguments.length < 1 )
			return;

		this._ = { currentNode: node, actionEvents: [], stopFlag: false };
		CKEDITOR.event.implementOn( this );
	};

	CKEDITOR.dom.domWalker.prototype = {
		next: (function() {
			var dfsStepForward = function() {
					var current = this._.currentNode,
						next;

					if ( !current )
						return null;

					if ( current.getChildCount() > 0 ) {
						next = current.getChild( 0 );
						fireDomWalkerEvent.call( this, 'down', current, next );
						return next;
					} else if ( current.getNext() ) {
						next = current.getNext();
						fireDomWalkerEvent.call( this, 'sibling', current, next );
						return next;
					} else {
						var ancestor = current.getParent();
						fireDomWalkerEvent.call( this, 'up', current, ancestor );

						while ( ancestor ) {
							if ( ancestor.getNext() ) {
								next = ancestor.getNext();
								fireDomWalkerEvent.call( this, 'sibling', ancestor, next );
								return next;
							} else {
								next = ancestor.getParent();
								fireDomWalkerEvent.call( this, 'up', ancestor, next );
								ancestor = next;
							}
						}
					}
					return null;
				};

			return function() {
				this._.actionEvents = [];
				return {
					node: ( this._.currentNode = dfsStepForward.apply( this ) ),
					events: this._.actionEvents
				};
			};
		})(),

		back: (function() {
			var dfsStepBackward = function() {
					var current = this._.currentNode,
						next;

					if ( !current )
						return null;

					if ( current.getPrevious() ) {
						var lastChild = current.getPrevious();
						fireDomWalkerEvent.call( this, 'sibling', current, lastChild );
						while ( lastChild.getChildCount() > 0 ) {
							next = lastChild.getChild( lastChild.getChildCount() - 1 );
							fireDomWalkerEvent.call( this, 'down', lastChild, next );
							lastChild = next;
						}
						return lastChild;
					} else {
						next = current.getParent();
						fireDomWalkerEvent.call( this, 'up', current, next );
						return next;
					}
					return null;
				};

			return function() {
				this._.actionEvents = [];
				return {
					node: ( this._.currentNode = dfsStepBackward.apply( this ) ),
					events: this._.actionEvents
				};
			};
		})(),

		forward: function( guardFunc ) {
			var retval;
			this._.stopFlag = false;

			// The default behavior is to stop once the end of document is reached.
			guardFunc = guardFunc || function( evt ) {};

			this.on( 'sibling', guardFunc );
			this.on( 'up', guardFunc );
			this.on( 'down', guardFunc );
			while ( ( !retval || retval.node ) && !this._.stopFlag ) {
				retval = this.next();
				this.fire( 'step', retval );
			}
			this.removeListener( 'sibling', guardFunc );
			this.removeListener( 'up', guardFunc );
			this.removeListener( 'down', guardFunc );
			return retval;
		},

		reverse: function( guardFunc ) {
			var retval;
			this._.stopFlag = false;

			// The default behavior is top stop once the start of document is reached.
			guardFunc = guardFunc || function( evt ) {};

			this.on( 'sibling', guardFunc );
			this.on( 'up', guardFunc );
			this.on( 'down', guardFunc );
			while ( ( !retval || retval.node ) && !this._.stopFlag ) {
				retval = this.back();
				this.fire( 'step', retval );
			}
			this.removeListener( 'sibling', guardFunc );
			this.removeListener( 'up', guardFunc );
			this.removeListener( 'down', guardFunc );
			return retval;
		},

		stop: function() {
			this._.stopFlag = true;
			return this;
		},

		stopped: function() {
			return this._.stopFlag;
		},

		setNode: function( node ) {
			this._.currentNode = node;
			return this;
		}
	};

	/*
	 * Anything whose display computed style is block, list-item, table,
	 * table-row-group, table-header-group, table-footer-group, table-row,
	 * table-column-group, table-column, table-cell, table-caption, or whose node
	 * name is hr, br (when enterMode is br only) is a block boundary.
	 */
	var blockBoundaryDisplayMatch = { block:1,'list-item':1,table:1,'table-row-group':1,'table-header-group':1,'table-footer-group':1,'table-row':1,'table-column-group':1,'table-column':1,'table-cell':1,'table-caption':1 },
		blockBoundaryNodeNameMatch = { hr:1 };

	CKEDITOR.dom.element.prototype.isBlockBoundary = function( customNodeNames ) {
		var nodeNameMatches = CKEDITOR.tools.extend( {}, blockBoundaryNodeNameMatch, customNodeNames || {} );

		return blockBoundaryDisplayMatch[ this.getComputedStyle( 'display' ) ] || nodeNameMatches[ this.getName() ];
	};

	CKEDITOR.dom.domWalker.blockBoundary = function( customNodeNames ) {
		return function( evt ) {
			var to = evt.data.to,
				from = evt.data.from;
			if ( to && to.type == CKEDITOR.NODE_ELEMENT ) {
				if ( to.isBlockBoundary( customNodeNames ) ) {
					evt.stop();
					this.stop();
					return;
				}
			}
			if ( ( evt.data.type == 'up' || evt.data.type == 'sibling' ) && from && from.type == CKEDITOR.NODE_ELEMENT ) {
				if ( from.isBlockBoundary( customNodeNames ) ) {
					evt.stop();
					this.stop();
				}
			}
		};
	};

	CKEDITOR.dom.domWalker.listItemBoundary = function() {
		return CKEDITOR.dom.domWalker.blockBoundary( { br:1 } );
	};
})();
