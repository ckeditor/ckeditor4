/* exported imageBaseFeaturesTools */
/* global pasteFiles */

( function() {
	'use strict';

	window.imageBaseFeaturesTools = {
		/*
		 * Main assertion for pasting files.
		 *
		 * @param {CKEDITOR.editor} editor
		 * @param {Object} options
		 * @param {Function} options.callback Function to be called after the paste event.
		 * Params:
		 *
		 * * `CKEDITOR.plugins.widget[]` widgets - Array of widgets in a given editor.
		 * * `CKEDITOR.eventInfo` evt - Paste event.
		 * * `CKEDITOR.eventInfo/undefined` uploadEvt - Upload event, available ony if `options.fullLoad` was set
		 *	to `true` and at least one widget was found.
		 * @param {File[]} [options.files=[]] Files to be dropped.
		 * @param {String} [options.dataValue=null] HTML data to be put into the clipboard if any.
		 * @param {Boolean} [options.fullLoad=false] If `true` assertion will wait for `uploadDone` of `uploadFailed`
		 * event of the first widget.
		 */
		assertPasteFiles: function( editor, options ) {
			var files = options.files || [],
				callback = options.callback;

			editor.once( 'paste', function( evt ) {
				// Unfortunately at the time being we need to do additional timeout here, as
				// the paste event gets cancelled.
				// We have to add additional ms to wait for Firefox to finish asynchronous events (#1619).
				setTimeout( function() {
					var widgets = bender.tools.objToArray( editor.widgets.instances ),
						listeners = [];

					function wrappedCallback( uploadEvt ) {
						// In case we listen for `upload*` events only first event should be handled (to not cause multiple
						// resume calls).
						if ( listeners.length ) {
							listeners = CKEDITOR.tools.array.filter( listeners, function( curListener ) {
								curListener.removeListener();
								return false;
							} );
						}

						resume( function() {
							callback( bender.tools.objToArray( editor.widgets.instances ), evt, uploadEvt );
						} );
					}

					if ( options.fullLoad && widgets.length ) {
						for ( var i = widgets.length - 1; i >= 0; i-- ) {
							listeners.push( widgets[ i ].once( 'uploadDone', wrappedCallback, null, null, 999 ) );
							listeners.push( widgets[ i ].once( 'uploadFailed', wrappedCallback, null, null, 999 ) );
						}
					} else {
						wrappedCallback();
					}
				}, 30 );
			}, null, null, -1 );

			// pasteFiles is defined in clipboard plugin helper.
			pasteFiles( editor, files, options.dataValue, {
				type: 'auto',
				method: 'paste'
			} );

			wait();
		},

		progress: {
			/*
			 * Returns a type that implements a progress indicator that puts a white overflow
			 * on a image, and removes it indicating the progress.
			 *
			 * @param {CKEDITOR.editor} editor
			 * @param {Function} ProgressReporter Base type for progress indicator {@link CKEDITOR.plugins.imageBase.progressReporter}.
			 * @returns {Function}
			 */
			getProgressOverlapType: function( editor, ProgressReporter ) {
				if ( this._cache.ProgressOverlap ) {
					return this._cache.ProgressOverlap;
				}

				function ProgressOverlap() {
					ProgressReporter.call( this );

					this.wrapper.addClass( 'cke_progress_overlap' );
				}

				ProgressOverlap.prototype = new ProgressReporter();

				ProgressOverlap.prototype.updated = function( progress ) {
					this.wrapper.setStyle( 'height', 100 - Math.round( progress * 100 ) + '%' );
				};

				this._cache.ProgressOverlap = ProgressOverlap;

				return ProgressOverlap;
			},

			/*
			 * Returns a type that implements a progress indicator that puts a
			 * circle-shaped progress bar.
			 *
			 * @param {CKEDITOR.editor} editor
			 * @param {Function} ProgressReporter Base type for progress indicator {@link CKEDITOR.plugins.imageBase.progressReporter}.
			 * @returns {Function}
			 */
			getProgressCircleType: function( editor, ProgressReporter ) {
				if ( this._cache.ProgressCircle ) {
					return this._cache.ProgressCircle;
				}

				// Radius of the progress circle.
				var CIRCLE_PROGRESS_SIZE = 20,
					// Circle width in pixels.
					CIRCLE_THICKNESS = 10,
					DASH_ARRAY = Math.PI * ( CIRCLE_PROGRESS_SIZE * 2 ),
					// Scale factor, so that the enlarge animation will not be clipped.
					scaleFactor = 2;

				function ProgressCircle() {
					var svgSize = ( CIRCLE_PROGRESS_SIZE * 2 ) + CIRCLE_THICKNESS,
						offset = CIRCLE_THICKNESS * 0.5 + CIRCLE_PROGRESS_SIZE,
						htmlTemplate = new CKEDITOR.template( '<div class="cont" data-pct="0">' +
							'	<svg id="svg" style="height: {svgSize}px; width: {svgSize}px;" viewPort="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
							'		<circle r="{CIRCLE_PROGRESS_SIZE}" cx="{offset}" cy="{offset}" fill="transparent"' +
							'			stroke-dasharray="{DASH_ARRAY}" stroke-dashoffset="0"' +
							'			style="stroke-width: {CIRCLE_THICKNESS}px"></circle>' +
							'		<circle r="{CIRCLE_PROGRESS_SIZE}" cx="{offset}" cy="{offset}" fill="transparent"' +
							'			stroke-dasharray="{DASH_ARRAY}" stroke-dashoffset="{DASH_ARRAY}"' +
							'			style="stroke-width: {CIRCLE_THICKNESS}px" class="bar"></circle>' +
							'	</svg>' +
							'</div>' );

					ProgressReporter.call( this );

					this.wrapper.addClass( 'cke_progress_circle' );

					this.circle = CKEDITOR.dom.element.createFromHtml(
						htmlTemplate.output( {
							svgSize: svgSize * scaleFactor,
							CIRCLE_PROGRESS_SIZE: CIRCLE_PROGRESS_SIZE,
							CIRCLE_THICKNESS: CIRCLE_THICKNESS,
							DASH_ARRAY: DASH_ARRAY,
							offset: Math.round( offset ) * scaleFactor
						} )
					);

					this.wrapper.append( this.circle );

					this.bar = this.wrapper.findOne( '.bar' );
					this.background = this.wrapper.findOne( 'circle' );
				}

				ProgressCircle.prototype = new ProgressReporter();

				ProgressCircle.prototype.updated = function( progress ) {
					var percentage = Math.round( progress * 100 ),
						bar = this.circle.findOne( '.bar' ),
						radius = bar.getAttribute( 'r' ),
						c = Math.PI * ( radius * 2 );

					bar.setStyle( 'stroke-dashoffset', ( ( 100 - percentage ) / 100 ) * c );
					this.circle.data( 'pct', percentage );
				};

				ProgressCircle.prototype.done = function() {
					// Make sure full circle is colored.
					this.updated( 1 );
					this.background.hide();

					this._fadeOut( 'done' );
				};

				ProgressCircle.prototype.failed = function() {
					this._fadeOut( 'failed' );
				};

				ProgressCircle.prototype.aborted = function() {
					this._fadeOut( 'aborted' );
				};

				ProgressCircle.prototype._fadeOut = function( additionalClass ) {
					this.wrapper.once( 'animationend', function() {
						this.remove();
					}, null, null, this );

					this.wrapper.addClass( additionalClass );
					this.wrapper.addClass( 'cke_fade_out' );
				};

				this._cache.ProgressCircle = ProgressCircle;

				return ProgressCircle;
			},

			/*
			 * Cache for the returned types.
			 */
			_cache: {}
		}
	};
} )();
