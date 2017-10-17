/* bender-tags: editor,pastefromwordimage */
/* bender-ckeditor-plugins: pastefromwordimage */

( function() {
	'use strict';

	// jscs:disable maximumLineLength
	var expectedValue = '<p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAOwgAADsIBFShKgAAAAOdJREFUSEvtljEWgjAQRA0HsLG19P4nsrS18QK6efFBMpMsS1hS+KQDNn+YAbIbntfb5XE/lcf7BRdMp+GMZQIPvLSPPnNAphDYia5qLAI6ne0b678CrWrm2iNNazUBC33Wqz6iEKIA39uEVjSigBc9yTBtMn3h5iK2jgJ94SgPUAi40AHiHBFbGSjgkk9ykKMGOjB/itsK/w5W81oi8uo2sCP92DtwSQkgwyPaaaLSvo5umfWIOnw055JWL+V9sfVP6SPPqMFL97G6H0BB3g9w+O1IX6HLrUkm7Lwijko0hRsd8FqBfwBKE0DK1O0llgAAAABJRU5ErkJggg==" /></p>',
	// jscs:enable maximumLineLength
		pasteData = {
			dataValue: '<p class="MsoNormal"><img src="file://ckeditor.com" /></p>',
			dataTransfer: {
				// jscs:disable maximumLineLength
				'text/rtf': '{\\*\\shppict{\\pict{\\*\\picprop\\shplid1025{\\sp{\\sn shapeType}{\\sv 75}}{\\sp{\\sn fFlipH}{\\sv 0}}\n{\\sp{\\sn fFlipV}{\\sv 0}}{\\sp{\\sn fLockRotation}{\\sv 0}}{\\sp{\\sn fLockAspectRatio}{\\sv 1}}{\\sp{\\sn fLockPosition}{\\sv 0}}{\\sp{\\sn fLockAgainstSelect}{\\sv 0}}\n{\\sp{\\sn fLockCropping}{\\sv 0}}{\\sp{\\sn fLockVerticies}{\\sv 0}}{\\sp{\\sn fLockAgainstGrouping}{\\sv 0}}{\\sp{\\sn pictureGray}{\\sv 0}}{\\sp{\\sn pictureBiLevel}{\\sv 0}}{\\sp{\\sn fFilled}{\\sv 0}}\n{\\sp{\\sn fLine}{\\sv 0}}{\\sp{\\sn wzName}{\\sv Obraz 4}}{\\sp{\\sn dhgt}{\\sv 251658240}}{\\sp{\\sn fHidden}{\\sv 0}}{\\sp{\\sn fLayoutInCell}{\\sv 1}}}\\picscalex100\\picscaley100\\piccropl0\\piccropr0\\piccropt0\\piccropb0\n\\picw847\\pich847\\picwgoal480\\pichgoal480\\pngblip\\bliptag2061619317{\\*\\blipuid 7ae1d0752d4cda86191c994ebf0d4b8b}89504e470d0a1a0a0000000d4948445200000020000000200802000000fc18eda3000000017352474200aece1ce9000000097048597300000ec200000ec20115\n284a80000000e749444154484bed963116823010440d07b0b1b5f4fe27b2b4b5f102ba79f14132932c4b5852f8a403367f9801b21b9ed7dbe5713f95c7fb0517\n4ca7e18c65020fbcb48f3e7340a610d889ae6a2c023a9ded1bebbf02ad6ae6da234d6b35010b7dd6ab3ea210a200dfdb845634a280173dc9306d327de1e622b6\n8e027de1280f5008b8d001e21c115b1928e0924f7290a3063a307f8adb0aff0e56f35a22f2ea36b023fdd83b70490920c323da69a2d2be8e6e99f5883a7c34e7\n92562fe57db1f54fe923cfa8c14bf7b1ba1f4041de0f70f8ed485fa1cbad4926ecbc228e4a34851b1df05a817f004a1340cad4ed25960000000049454e44ae426082}}'
				// jscs:enable maximumLineLength
			}
		};

	bender.editor = true;

	bender.test( {
		'test pastefromwordimage event triggered': function() {
			var editor = this.editor;

			editor.once( 'pasteFromWordImage', function() {
				resume( function() {
					assert.pass();
				} );
			} );

			editor.fire( 'afterPasteFromWord', pasteData );

			wait();
		},

		'test embed picture': function() {
			if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
				assert.ignore();
			}
			bender.editorBot.create( {
				name: 'test1'
			}, function( bot ) {

				var editor = bot.editor,
					nativeDataTransfer = bender.tools.mockNativeDataTransfer(),
					dataTransfer,
					eventData = {};

				nativeDataTransfer.setData( 'text/html', pasteData.dataValue );
				nativeDataTransfer.setData( 'text/rtf', pasteData.dataTransfer[ 'text/rtf' ] );
				dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeDataTransfer );
				eventData.dataTransfer = dataTransfer;
				eventData.dataValue = pasteData.dataValue;
				eventData.type = 'auto';
				eventData.method = 'paste';

				editor.once( 'pasteFromWordImage', function() {
					setTimeout( function() {
						resume( function() {
							assert.beautified.html( expectedValue, editor.getData(), {
								fixStyles: true,
								sortAttributes: true
							} );
						} );
					}, 5 );
				} );

				editor.fire( 'paste', eventData );
				wait();
			} );
		},

		'test cancel embed picture': function() {
			if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
				assert.ignore();
			}
			bender.editorBot.create( {
				name: 'test2'
			}, function( bot ) {

				var editor = bot.editor,
					nativeDataTransfer = bender.tools.mockNativeDataTransfer(),
					dataTransfer,
					eventData = {};

				nativeDataTransfer.setData( 'text/html', pasteData.dataValue );
				nativeDataTransfer.setData( 'text/rtf', pasteData.dataTransfer[ 'text/rtf' ] );
				dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeDataTransfer );
				eventData.dataTransfer = dataTransfer;
				eventData.dataValue = pasteData.dataValue;
				eventData.type = 'auto';
				eventData.method = 'paste';

				editor.once( 'pasteFromWordImage', function( evt ) {
					setTimeout( function() {
						resume( function() {
							assert.beautified.html( '<p><img src="file://ckeditor.com"></p>', editor.getData(), {
								fixStyles: true,
								sortAttributes: true
							} );
						} );
					}, 5 );
					evt.cancel();
				} );

				editor.fire( 'paste', eventData );
				wait();
			} );
		}
	} );
} )();
