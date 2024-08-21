/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
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
				requestUrl = apiUrl + '?v=' + encodeURIComponent( versionInfo.current.name );

			request.onreadystatechange = function() {
				if ( request.readyState === 4 && request.status === 200 ) {
					try {
						var response = JSON.parse( request.responseText );

						versionInfo.latest = parseVersion( response.latestVersion );
						versionInfo.secure = parseVersion( response.secureVersion );
						versionInfo.isLatest = isLatestVersion();
						versionInfo.isSecure = isSecureVersion();

						callback();
					} catch ( e ) {}
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

		var notificationMessage =  editor.lang.versionCheck.notificationMessage.replace( '%current', versionInfo.current.name ).
				replace( '%latest', versionInfo.latest.name ).
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

		var consoleMessage =  editor.lang.versionCheck.consoleMessage.replace( '%current', versionInfo.current.name ).
			replace( '%latest', versionInfo.latest.name ).
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

		return msg.replace( '%current', versionInfo.current.name ).
				replace( '%latest', versionInfo.latest.name ).
				replace( /%link/g, upgradeLink );
	}

	function isLatestVersion() {
		return isEqualOrHigherVersion( versionInfo.current, versionInfo.latest );
	}

	function isSecureVersion() {
		return isEqualOrHigherVersion( versionInfo.current, versionInfo.secure );
	}

	function isEqualOrHigherVersion( left, right ) {
		if ( left.minor > right.minor ) {
			return true;
		}

		if ( left.minor === right.minor &&
			left.patch >= right.patch ) {
			return true;
		}

		return false;
	}

	function parseVersion( version ) {
		var parts = version.match( versionRegex );

		if ( !parts ) {
			return null;
		}

		var minor = parseInt( parts[ 1 ] ),
			patch = parseInt( parts[ 2 ] ),
			isIts = !!parts[ 3 ],
			name = '4.' + minor + '.' + patch + ( isIts ? '-lts' : '' );

		return {
			name: name,
			major: 4,
			minor: minor,
			patch: patch,
			isLts: isIts
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
	 * Starting July 1st, 2024, we have enabled security notifications for editor instances accessed through https://cdn.ckeditor.com/.
	 * To learn more about these changes, please read this article: https://ckeditor.com/blog/important-update-for-ckeditor-4-users.
	 * You can control security notifications for CDN-based editors using the `config.versionCheck` option.
	 *
	 * @cfg {Boolean} [versionCheck]
	 * @since 4.22.0
	 * @member CKEDITOR.config
	 */
} )();
