/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* global console */

( function() {
	var apiUrl = 'https://cke4.ckeditor.com/ckeditor4-secure-version/versions.json',
		upgradeLink = 'https://ckeditor.com/ckeditor-4-support/',
		versionRegex = /^4\.(\d+)\.(\d+)(-lts)?(?: \(?.+?\)?)?$/,
		isDrupal = 'Drupal' in window,
		consoleErrorDisplayed = false,
		versionInfo = {
			current: parseVersion( CKEDITOR.version )
		};

	if ( isDrupal || !versionInfo.current ) {
		return;
	}

	CKEDITOR.config.versionCheck = versionInfo.current.isLts ? false : true;

	CKEDITOR.on( 'instanceReady', function( evt ) {
		var editor = evt.editor;

		if ( !editor.config.versionCheck ) {
			return;
		}

		editor.on( 'dialogShow', function( evt ) {
			var dialog = evt.data;

			if ( dialog._.name !== 'about' ) {
				return;
			}

			performVersionCheck( function() {
				addInfoToAboutDialog( editor, dialog );
			} );
		} );

		performVersionCheck( function() {
			notifyAboutInsecureVersion( editor );
		} );
	} );

	function performVersionCheck( callback ) {
		if ( versionInfo.secure && versionInfo.latest ) {
			return callback();
		}

		try {
			var request = new XMLHttpRequest(),
				requestUrl = apiUrl + '?v=' + encodeURIComponent( versionInfo.current.original );

			request.onreadystatechange = function() {
				if ( request.readyState === 4 && request.status === 200 ) {
					var response = JSON.parse( request.responseText );

					versionInfo.latest = parseVersion( response.latestVersion );
					versionInfo.secure = parseVersion( response.secureVersion );
					versionInfo.isLatest = isLatestVersion();
					versionInfo.isSecure = isSecureVersion();

					callback();
				}
			};

			request.open( 'GET', requestUrl );
			request.responseType = 'text';
			request.send();
		} catch ( e ) {
		}
	}

	function notifyAboutInsecureVersion( editor ) {
		if ( versionInfo.isSecure ) {
			return;
		}

		var notificationMessage =  editor.lang.versionCheck.notificationMessage.replace( '%current', versionInfo.current.original ).
				replace( '%latest', versionInfo.latest.original ).
				replace( /%link/g, upgradeLink ),
			isNotificationAvailable = 'notification' in editor.plugins;

		showConsoleError( editor );

		if ( isNotificationAvailable ) {
			editor.showNotification( notificationMessage, 'warning' );
		}
	}

	function showConsoleError( editor ) {
		if ( !window.console || !window.console.error ) {
			return;
		}

		if ( consoleErrorDisplayed ) {
			return;
		}

		consoleErrorDisplayed = true;

		var consoleMessage =  editor.lang.versionCheck.consoleMessage.replace( '%current', versionInfo.current.original ).
			replace( '%latest', versionInfo.latest.original ).
			replace( /%link/g, upgradeLink );

		console.error( consoleMessage );
	}

	function addInfoToAboutDialog( editor, dialog ) {
		var container = dialog.getElement().findOne( '.cke_about_version-check' ),
			message = getAboutMessage( editor );

		container.setHtml( '' );

		if ( editor.config.versionCheck ) {
			container.setStyle( 'color', versionInfo.isSecure ? '' : '#C83939' );
			container.setHtml( message );
		}
	}

	function getAboutMessage( editor ) {
		var lang = editor.lang.versionCheck,
			msg = '';

		if ( !versionInfo.isLatest ) {
			msg = lang.aboutDialogUpgradeMessage;
		}

		if ( !versionInfo.isSecure ) {
			msg = lang.aboutDialogInsecureMessage;
		}

		return msg.replace( '%current', versionInfo.current.original ).
				replace( '%latest', versionInfo.latest.original ).
				replace( /%link/g, upgradeLink );
	}

	function isLatestVersion() {
		return versionInfo.current.minor === versionInfo.latest.minor &&
			versionInfo.current.patch === versionInfo.latest.patch;
	}

	function isSecureVersion() {
		if ( versionInfo.current.minor > versionInfo.secure.minor ) {
			return true;
		}

		if ( versionInfo.current.minor === versionInfo.secure.minor &&
			versionInfo.current.patch >= versionInfo.secure.patch ) {
			return true;
		}

		return false;
	}

	function parseVersion( version ) {
		var parts = version.match( versionRegex );

		if ( !parts ) {
			return null;
		}

		return {
			original: version,
			major: 4,
			minor: Number( parts[ 1 ] ),
			patch: Number( parts[ 2 ] ),
			isLts: !!parts[ 3 ]
		};
	}

	/**
	 * The version check feature adds a notification system to the editor that informs
	 * users if the editor version is secure. It is highly recommended to stay up to
	 * date with the editor version to ensure that the editor is secure and provides
	 * the best editing experience to users.
	 *
	 * If the current version is below the latest published secure version,
	 * a user will be prompted about the available update. This feature is integrated
	 * with the [Notification](https://ckeditor.com/cke4/addon/notification) plugin,
	 * the [About](https://ckeditor.com/cke4/addon/about) dialog,
	 * and developer console logs.
	 *
	 * You can manually disable this feature by setting the option to `false`,
	 * but we strongly recommend upgrading the editor instead.
	 *
	 * - For CKEditor 4.22.* and below, this option is enabled by default.
	 * - For CKEditor 4 LTS (4.23.0 and above), this option is disabled by default.
	 *
	 * @cfg {Boolean} [versionCheck]
	 * @since 4.22.0
	 * @member CKEDITOR.config
	 */
} )();
