/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

( function() {
  CKEDITOR.dialog.add( 'link', function( editor ) {
    var plugin = CKEDITOR.plugins.link,
      initialLinkText;

    function createRangeForLink( editor, link ) {
      var range = editor.createRange();

      range.setStartBefore( link );
      range.setEndAfter( link );

      return range;
    }

    function insertLinksIntoSelection( editor, data ) {
      var attributes = plugin.getLinkAttributes( editor, data ),
        ranges = editor.getSelection().getRanges(),
        style = new CKEDITOR.style( {
          element: 'a',
          attributes: attributes.set
        } ),
        rangesToSelect = [],
        range,
        text,
        nestedLinks,
        i,
        j;

      style.type = CKEDITOR.STYLE_INLINE; // need to override... dunno why.

      for ( i = 0; i < ranges.length; i++ ) {
        range = ranges[ i ];

        // Use link URL as text with a collapsed cursor.
        if ( range.collapsed ) {
          // Short mailto link text view (https://dev.ckeditor.com/ticket/5736).
          text = new CKEDITOR.dom.text( data.linkText || ( data.type == 'email' ?
            data.email.address : attributes.set[ 'data-cke-saved-href' ] ), editor.document );
          range.insertNode( text );
          range.selectNodeContents( text );
        } else if ( initialLinkText !== data.linkText ) {
          text = new CKEDITOR.dom.text( data.linkText, editor.document );

          // Shrink range to preserve block element.
          range.shrink( CKEDITOR.SHRINK_TEXT );

          // Use extractHtmlFromRange to remove markup within the selection. Also this method is a little
          // smarter than range#deleteContents as it plays better e.g. with table cells.
          editor.editable().extractHtmlFromRange( range );

          range.insertNode( text );
        }

        // Editable links nested within current range should be removed, so that the link is applied to whole selection.
        nestedLinks = range._find( 'a' );

        for ( j = 0; j < nestedLinks.length; j++ ) {
          nestedLinks[ j ].remove( true );
        }


        // Apply style.
        style.applyToRange( range, editor );

        rangesToSelect.push( range );
      }

      editor.getSelection().selectRanges( rangesToSelect );
    }

    function editLinksInSelection( editor, selectedElements, data ) {
      var attributes = plugin.getLinkAttributes( editor, data ),
        ranges = [],
        element,
        href,
        textView,
        newText,
        i;

      for ( i = 0; i < selectedElements.length; i++ ) {
        // We're only editing an existing link, so just overwrite the attributes.
        element = selectedElements[ i ];
        href = element.data( 'cke-saved-href' );
        textView = element.getHtml();

        element.setAttributes( attributes.set );
        element.removeAttributes( attributes.removed );


        if ( data.linkText && initialLinkText != data.linkText ) {
          // Display text has been changed.
          newText = data.linkText;
        } else if ( href == textView || data.type == 'email' && textView.indexOf( '@' ) != -1 ) {
          // Update text view when user changes protocol (https://dev.ckeditor.com/ticket/4612).
          // Short mailto link text view (https://dev.ckeditor.com/ticket/5736).
          newText = data.type == 'email' ? data.email.address : attributes.set[ 'data-cke-saved-href' ];
        }

        if ( newText ) {
          element.setText( newText );
        }

        ranges.push( createRangeForLink( editor, element ) );
      }

      // We changed the content, so need to select it again.
      editor.getSelection().selectRanges( ranges );
    }

    // Handles the event when the "Target" selection box is changed.
    var targetChanged = function() {
        var dialog = this.getDialog(),
          popupFeatures = dialog.getContentElement( 'target', 'popupFeatures' ),
          targetName = dialog.getContentElement( 'target', 'linkTargetName' ),
          value = this.getValue();

        if ( !popupFeatures || !targetName )
          return;

        popupFeatures = popupFeatures.getElement();
        popupFeatures.hide();
        targetName.setValue( '' );

        switch ( value ) {
          case 'frame':
            targetName.setLabel( editor.lang.a11ylink.targetFrameName );
            targetName.getElement().show();
            break;
          case 'popup':
            popupFeatures.show();
            targetName.setLabel( editor.lang.a11ylink.targetPopupName );
            targetName.getElement().show();
            break;
          default:
            targetName.setValue( value );
            targetName.getElement().hide();
            break;
        }

      };

    // Handles the event when the "Type" selection box is changed.
    var linkTypeChanged = function() {
        var dialog = this.getDialog(),
          partIds = [ 'urlOptions', 'anchorOptions', 'emailOptions' ],
          typeValue = this.getValue(),
          uploadTab = dialog.definition.getContents( 'upload' ),
          uploadInitiallyHidden = uploadTab && uploadTab.hidden;

        if ( typeValue == 'url' ) {
          if ( editor.config.linkShowTargetTab )
            dialog.showPage( 'target' );
          if ( !uploadInitiallyHidden )
            dialog.showPage( 'upload' );
        } else {
          dialog.hidePage( 'target' );
          if ( !uploadInitiallyHidden )
            dialog.hidePage( 'upload' );
        }

        for ( var i = 0; i < partIds.length; i++ ) {
          var element = dialog.getContentElement( 'info', partIds[ i ] );
          if ( !element )
            continue;

          element = element.getElement().getParent().getParent();
          if ( partIds[ i ] == typeValue + 'Options' )
            element.show();
          else
            element.hide();
        }

        dialog.layout();
      };

    var setupParams = function( page, data ) {
        if ( data[ page ] )
          this.setValue( data[ page ][ this.id ] || '' );
      };

    var setupPopupParams = function( data ) {
        return setupParams.call( this, 'target', data );
      };

    var setupAdvParams = function( data ) {
        return setupParams.call( this, 'advanced', data );
      };

    var commitParams = function( page, data ) {
        if ( !data[ page ] )
          data[ page ] = {};

        data[ page ][ this.id ] = this.getValue() || '';
      };

    var commitPopupParams = function( data ) {
        return commitParams.call( this, 'target', data );
      };

    var commitAdvParams = function( data ) {
        return commitParams.call( this, 'advanced', data );
      };

    var normalizeDisplayText = function(displayTextValue) {
      var str = displayTextValue.trim().toLowerCase().replace(/^\s*|\s(?=\s)|\s*$/g, "").replace(/^https?\:\/\//i, "");
      var str = str.replace(/[.,!?]+$/, ''); // remove common sentence endings ".,!?"
      return str;
    };

    var normalizeText = function(textValue) {
      return textValue.trim().toLowerCase().replace(/^\s*|\s(?=\s)|\s*$/g, "");
    };

    var commonLang = editor.lang.common,
      linkLang = editor.lang.a11ylink,
      anchors;

    return {
      title: linkLang.title,
      minWidth: ( CKEDITOR.skinName || editor.config.skin ) == 'moono-lisa' ? 450 : 350,
      minHeight: 220,
      contents: [ {
        id: 'info',
        label: linkLang.info,
        title: linkLang.info,
        elements: [
        {
          type: 'vbox',
          align: 'bottom',
          id: 'linkDisplayTextOptions',
          children: [
            {
              type: 'hbox',
              widths: [ '85%', '15%' ],
              children: [
                {
                  type: 'text',
                  id: 'linkDisplayText',
                  label: linkLang.displayText,
                  title: linkLang.displayTextTitle,
                  setup: function() {
                    this.enable();

                    this.setValue( editor.getSelection().getSelectedText() );

                    // Keep inner text so that it can be compared in commit function. By obtaining value from getData()
                    // we get value stripped from new line chars which is important when comparing the value later on.
                    initialLinkText = this.getValue();
                  },
                  validate: function() {

                    var linkTypeValue = this.getDialog().getContentElement( 'info', 'linkType' ).getValue();

                    var isLinkTypeUrl    = linkTypeValue === 'url';
                    var isLinkTypeEmail  = linkTypeValue === 'email';
                    var isLinkTypeAnchor = linkTypeValue === 'anchor';

                    var displayTextValue      = this.getValue();
                    var displayTextNormalized = normalizeDisplayText(displayTextValue);
                    var isDisplayTextEmpty    = displayTextNormalized.length === 0;
                    var isDisplayTextAURL     =  displayTextValue.toLowerCase().indexOf('http') === 0;

                    var urlValue       = this.getDialog().getContentElement( 'info', 'url' ).getValue();
                    var urlNormalized  = normalizeText(urlValue);
                    var isUrlEmpty     = urlNormalized.length === 0;

                    var emailValue       = this.getDialog().getContentElement( 'info', 'emailAddress' ).getValue();
                    var emailNormalized  = normalizeText(emailValue);
                    var isEmailEmpty     = emailNormalized.length === 0;

                    var nameValue       = this.getDialog().getContentElement( 'info', 'anchorName' ).getValue();
                    var nameNormalized  = normalizeText(nameValue);
                    var isNameEqualToDisplayText = nameNormalized === displayTextNormalized;

                    var idValue       = this.getDialog().getContentElement( 'info', 'anchorId' ).getValue();
                    var idNormalized  = normalizeText(idValue);
                    var isIdEqualToDisplayText = idNormalized === displayTextNormalized;

                    if (isLinkTypeUrl) {
                        // Test for empty Display Text
                        if (isDisplayTextEmpty) {
                          alert(linkLang.msgEmptyDisplayText);
                          return false;
                        }

                        // Testing for using the URL as the link text
                        if(displayTextNormalized === urlNormalized || isDisplayTextAURL) {
                          return confirm(linkLang.msgUrlDisplayText);
                        }
                    }

                    if (isLinkTypeAnchor) {
                      var anchors = plugin.getEditorAnchors( editor );

                      if (isDisplayTextEmpty) {
                          alert(linkLang.msgEmptyDisplayText);
                          return false;
                      }

                      if (isNameEqualToDisplayText || isNameEqualToDisplayText) {
                        return confirm(linkLang.msgNameEqualToDisplayText);
                      }

                      if (!anchors || anchors.length === 0) {
                        alert(linkLang.msgNoAnchors);
                      }

                    }

                    if (isLinkTypeEmail) {

                        // Test for empty Display Text
                        if (isDisplayTextEmpty) {
                          alert(linkLang.msgEmptyDisplayText);
                          return false;
                        }

                        // Testing for using the URL as the link text
                        if(emailNormalized === displayTextNormalized) {
                          return confirm(linkLang.msgEmailDisplayText);
                        }

                    }

                    // Testing for common cases of invalid link text
                    for (var i = 0; i < linkLang.a11yFirstInvalidDisplayText.length; i++) {
                      if (displayTextNormalized === linkLang.a11yFirstInvalidDisplayText[i]) {
                        alert(linkLang.msgInvalidDisplayText.replace('%s', displayTextValue));
                        return false;
                      }
                    }

                    // Testing for link text starting with "Link" or "Link to"
                    for (var i = 0; i < linkLang.a11yFirstInvalidStartText.length; i++) {
                      if (displayTextNormalized.indexOf(linkLang.a11yFirstInvalidStartText[i]) === 0) {
                        alert(linkLang.msgInvalidStartText.replace('%s', linkLang.a11yFirstInvalidStartText[i]));
                        return false;
                      }
                    }

                    return true;
                  },
                  commit: function( data ) {
                    data.linkText = this.isEnabled() ? this.getValue() : '';
                  }
                },
                {
                  id: 'a11yfirstHelpLink',
                  type: 'button',
                  label: linkLang.a11yfirstHelp,
                  title: linkLang.a11yfirstHelpTitle,
                  onClick: function() {
                    var helpPlugin = CKEDITOR.plugins.get( 'a11yfirsthelp' );
                    if (helpPlugin) {
                      editor.a11yfirst.helpOption = 'LinkHelp';
                      editor.execCommand('a11yFirstHelpDialog');
                    }
                    else {
                      alert(linkLang.helpNotFound)
                    }
                  }
                }
              ]
            }
          ]
        },
        {
          id: 'linkTypeFieldset',
          type: 'fieldset',
          label: linkLang.type,
          children: [
            {
              id: 'linkType',
              type: 'radio',
              'default': 'url',
              items: [
                [ linkLang.toUrl, 'url' ],
                [ linkLang.toEmail, 'email' ],
                [ linkLang.toAnchor, 'anchor' ]
              ],
              onChange: linkTypeChanged,
              setup: function( data ) {
                this.getElement().addClass('a11yfirst_no_label');

                this.setValue( data.type || 'url' );
              },
              commit: function( data ) {
                data.type = this.getValue();
              }
            }
          ]
        },
        {
          type: 'vbox',
          id: 'urlOptions',
          children: [ {
            type: 'hbox',
            widths: [ '25%', '75%' ],
            children: [ {
              id: 'protocol',
              type: 'select',
              label: commonLang.protocol,
              'default': 'http://',
              items: [
                // Force 'ltr' for protocol names in BIDI. (https://dev.ckeditor.com/ticket/5433)
                [ 'http://\u200E', 'http://' ],
                [ 'https://\u200E', 'https://' ],
                [ 'ftp://\u200E', 'ftp://' ],
                [ 'news://\u200E', 'news://' ],
                [ linkLang.other, '' ]
              ],
              setup: function( data ) {
                if ( data.url )
                  this.setValue( data.url.protocol || '' );
              },
              commit: function( data ) {
                if ( !data.url )
                  data.url = {};

                data.url.protocol = this.getValue();
              }
            },
            {
              type: 'text',
              id: 'url',
              label: commonLang.url,
              required: true,
              onLoad: function() {
                this.allowOnChange = true;
              },
              onKeyUp: function() {
                this.allowOnChange = false;
                var protocolCmb = this.getDialog().getContentElement( 'info', 'protocol' ),
                  url = this.getValue(),
                  urlOnChangeProtocol = /^(http|https|ftp|news):\/\/(?=.)/i,
                  urlOnChangeTestOther = /^((javascript:)|[#\/\.\?])/i;

                var protocol = urlOnChangeProtocol.exec( url );
                if ( protocol ) {
                  this.setValue( url.substr( protocol[ 0 ].length ) );
                  protocolCmb.setValue( protocol[ 0 ].toLowerCase() );
                } else if ( urlOnChangeTestOther.test( url ) ) {
                  protocolCmb.setValue( '' );
                }

                this.allowOnChange = true;
              },
              onChange: function() {
                if ( this.allowOnChange ) // Dont't call on dialog load.
                this.onKeyUp();
              },
              validate: function() {
                var dialog = this.getDialog();

                if ( dialog.getContentElement( 'info', 'linkType' ) && dialog.getValueOf( 'info', 'linkType' ) != 'url' )
                  return true;

                if ( !editor.config.linkJavaScriptLinksAllowed && ( /javascript\:/ ).test( this.getValue() ) ) {
                  alert( commonLang.invalidValue ); // jshint ignore:line
                  return false;
                }

                if ( this.getDialog().fakeObj ) // Edit Anchor.
                return true;

                var func = CKEDITOR.dialog.validate.notEmpty( linkLang.noUrl );
                return func.apply( this );
              },
              setup: function( data ) {
                this.allowOnChange = false;
                if ( data.url ) {
                  this.setValue( data.url.url );
                }

                this.allowOnChange = true;

              },
              commit: function( data ) {
                // IE will not trigger the onChange event if the mouse has been used
                // to carry all the operations https://dev.ckeditor.com/ticket/4724
                this.onChange();

                if ( !data.url )
                  data.url = {};

                data.url.url = this.getValue();
                this.allowOnChange = false;
              }
            } ],
            setup: function() {
              if ( !this.getDialog().getContentElement( 'info', 'linkType' ) )
                this.getElement().show();
            }
          },
          {
            type: 'button',
            id: 'browse',
            hidden: 'true',
            filebrowser: 'info:url',
            label: commonLang.browseServer
          } ]
        },
        {
          type: 'vbox',
          id: 'anchorOptions',
          width: 260,
          align: 'center',
          padding: 0,
          children: [ {
            type: 'fieldset',
            id: 'selectAnchorText',
            label: linkLang.selectAnchor,
            setup: function() {
              anchors = plugin.getEditorAnchors( editor );

              this.getElement()[ anchors && anchors.length ? 'show' : 'hide' ]();
            },
            children: [ {
              type: 'hbox',
              id: 'selectAnchor',
              children: [ {
                type: 'select',
                id: 'anchorName',
                'default': '',
                label: linkLang.anchorName,
                style: 'width: 100%;',
                items: [
                  [ '' ]
                ],
                setup: function( data ) {
                  this.clear();
                  this.add( '' );

                  if ( anchors ) {
                    for ( var i = 0; i < anchors.length; i++ ) {
                      if ( anchors[ i ].name )
                        this.add( anchors[ i ].name );
                    }
                  }

                  if ( data.anchor )
                    this.setValue( data.anchor.name );

                  var linkType = this.getDialog().getContentElement( 'info', 'linkType' );
                  if ( linkType && linkType.getValue() == 'email' )
                    this.focus();
                },
                commit: function( data ) {
                  if ( !data.anchor )
                    data.anchor = {};

                  data.anchor.name = this.getValue();
                },
                validate: function() {
                  var anchorNameValue = this.getValue();
                  var anchorIdValue   = this.getDialog().getContentElement( 'info', 'anchorId' ).getValue();

                  if (anchors.length && (anchorNameValue === '' && anchorIdValue === '')) {
                    return confirm(linkLang.msgNoAnchorSelected);
                  }
                }
              },
              {
                type: 'select',
                id: 'anchorId',
                'default': '',
                label: linkLang.anchorId,
                style: 'width: 100%;',
                items: [
                  [ '' ]
                ],
                setup: function( data ) {
                  this.clear();
                  this.add( '' );

                  if ( anchors ) {
                    for ( var i = 0; i < anchors.length; i++ ) {
                      if ( anchors[ i ].id )
                        this.add( anchors[ i ].id );
                    }
                  }

                  if ( data.anchor )
                    this.setValue( data.anchor.id );
                },
                commit: function( data ) {
                  if ( !data.anchor )
                    data.anchor = {};

                  data.anchor.id = this.getValue();
                }
              } ],
              setup: function() {
                this.getElement()[ anchors && anchors.length ? 'show' : 'hide' ]();
              }
            } ]
          },
          {
            type: 'html',
            id: 'noAnchors',
            style: 'text-align: center;',
            html: '<div role="note" tabIndex="-1">' + CKEDITOR.tools.htmlEncode( linkLang.noAnchors ) + '</div>',
            // Focus the first element defined in above html.
            focus: true,
            setup: function() {
              this.getElement()[ anchors && anchors.length ? 'hide' : 'show' ]();
            }
          } ],
          setup: function() {
            if ( !this.getDialog().getContentElement( 'info', 'linkType' ) )
              this.getElement().hide();
          }
        },
        {
          type: 'vbox',
          id: 'emailOptions',
          padding: 1,
          children: [ {
            type: 'text',
            id: 'emailAddress',
            label: linkLang.emailAddress,
            required: true,
            onKeyUp: function() {
              var emailIsDisplayText = this.getDialog().getContentElement( 'info', 'emailIsDisplayText' );
              var displayText        = this.getDialog().getContentElement( 'info', 'linkDisplayText' ).getValue();
              updateEmailIsDisplayText(emailIsDisplayText, displayText, this.getValue());
            },
            validate: function() {
              var dialog = this.getDialog();

              if ( !dialog.getContentElement( 'info', 'linkType' ) ||
                 ( dialog.getValueOf( 'info', 'linkType' ) != 'email' ) ||
                 ( dialog.getValueOf( 'info', 'linkDisplayText' ) === '' )) {  // added by Jon Gunderson to allow display text to vaildate message to appear first
                return true;
              }

              var func = CKEDITOR.dialog.validate.notEmpty( linkLang.noEmail );
              return func.apply( this );
            },
            setup: function( data ) {
              if ( data.email )
                this.setValue( data.email.address );

              var linkType = this.getDialog().getContentElement( 'info', 'linkType' );
              if ( linkType && linkType.getValue() == 'email' )
                this.select();
            },
            commit: function( data ) {
              if ( !data.email )
                data.email = {};

              data.email.address = this.getValue();
            }
          },
          {
            type: 'text',
            id: 'emailSubject',
            label: linkLang.emailSubject,
            setup: function( data ) {
              if ( data.email )
                this.setValue( data.email.subject );
            },
            commit: function( data ) {
              if ( !data.email )
                data.email = {};

              data.email.subject = this.getValue();
            }
          },
          {
            type: 'textarea',
            id: 'emailBody',
            label: linkLang.emailBody,
            rows: 3,
            'default': '',
            setup: function( data ) {
              if ( data.email )
                this.setValue( data.email.body );
            },
            commit: function( data ) {
              if ( !data.email )
                data.email = {};

              data.email.body = this.getValue();
            }
          }
         ],
          setup: function() {
            if ( !this.getDialog().getContentElement( 'info', 'linkType' ) )
              this.getElement().hide();
          }
        } ]
      },
      {
        id: 'target',
        requiredContent: 'a[target]', // This is not fully correct, because some target option requires JS.
        label: linkLang.target,
        title: linkLang.target,
        elements: [ {
          type: 'hbox',
          widths: [ '50%', '50%' ],
          children: [ {
            type: 'select',
            id: 'linkTargetType',
            label: commonLang.target,
            'default': 'notSet',
            style: 'width : 100%;',
            'items': [
              [ commonLang.notSet, 'notSet' ],
              [ linkLang.targetFrame, 'frame' ],
              [ linkLang.targetPopup, 'popup' ],
              [ commonLang.targetNew, '_blank' ],
              [ commonLang.targetTop, '_top' ],
              [ commonLang.targetSelf, '_self' ],
              [ commonLang.targetParent, '_parent' ]
            ],
            onChange: targetChanged,
            setup: function( data ) {
              if ( data.target )
                this.setValue( data.target.type || 'notSet' );
              targetChanged.call( this );
            },
            commit: function( data ) {
              if ( !data.target )
                data.target = {};

              data.target.type = this.getValue();
            }
          },
          {
            type: 'text',
            id: 'linkTargetName',
            label: linkLang.targetFrameName,
            'default': '',
            setup: function( data ) {
              if ( data.target )
                this.setValue( data.target.name );
            },
            commit: function( data ) {
              if ( !data.target )
                data.target = {};

              data.target.name = this.getValue().replace( /([^\x00-\x7F]|\s)/gi, '' );
            }
          } ]
        },
        {
          type: 'vbox',
          width: '100%',
          align: 'center',
          padding: 2,
          id: 'popupFeatures',
          children: [ {
            type: 'fieldset',
            label: linkLang.popupFeatures,
            children: [ {
              type: 'hbox',
              children: [ {
                type: 'checkbox',
                id: 'resizable',
                label: linkLang.popupResizable,
                setup: setupPopupParams,
                commit: commitPopupParams
              },
              {
                type: 'checkbox',
                id: 'status',
                label: linkLang.popupStatusBar,
                setup: setupPopupParams,
                commit: commitPopupParams

              } ]
            },
            {
              type: 'hbox',
              children: [ {
                type: 'checkbox',
                id: 'location',
                label: linkLang.popupLocationBar,
                setup: setupPopupParams,
                commit: commitPopupParams

              },
              {
                type: 'checkbox',
                id: 'toolbar',
                label: linkLang.popupToolbar,
                setup: setupPopupParams,
                commit: commitPopupParams

              } ]
            },
            {
              type: 'hbox',
              children: [ {
                type: 'checkbox',
                id: 'menubar',
                label: linkLang.popupMenuBar,
                setup: setupPopupParams,
                commit: commitPopupParams

              },
              {
                type: 'checkbox',
                id: 'fullscreen',
                label: linkLang.popupFullScreen,
                setup: setupPopupParams,
                commit: commitPopupParams

              } ]
            },
            {
              type: 'hbox',
              children: [ {
                type: 'checkbox',
                id: 'scrollbars',
                label: linkLang.popupScrollBars,
                setup: setupPopupParams,
                commit: commitPopupParams

              },
              {
                type: 'checkbox',
                id: 'dependent',
                label: linkLang.popupDependent,
                setup: setupPopupParams,
                commit: commitPopupParams

              } ]
            },
            {
              type: 'hbox',
              children: [ {
                type: 'text',
                widths: [ '50%', '50%' ],
                labelLayout: 'horizontal',
                label: commonLang.width,
                id: 'width',
                setup: setupPopupParams,
                commit: commitPopupParams

              },
              {
                type: 'text',
                labelLayout: 'horizontal',
                widths: [ '50%', '50%' ],
                label: linkLang.popupLeft,
                id: 'left',
                setup: setupPopupParams,
                commit: commitPopupParams

              } ]
            },
            {
              type: 'hbox',
              children: [ {
                type: 'text',
                labelLayout: 'horizontal',
                widths: [ '50%', '50%' ],
                label: commonLang.height,
                id: 'height',
                setup: setupPopupParams,
                commit: commitPopupParams

              },
              {
                type: 'text',
                labelLayout: 'horizontal',
                label: linkLang.popupTop,
                widths: [ '50%', '50%' ],
                id: 'top',
                setup: setupPopupParams,
                commit: commitPopupParams

              } ]
            } ]
          } ]
        } ]
      },
      {
        id: 'upload',
        label: linkLang.upload,
        title: linkLang.upload,
        hidden: true,
        filebrowser: 'uploadButton',
        elements: [ {
          type: 'file',
          id: 'upload',
          label: commonLang.upload,
          style: 'height:40px',
          size: 29
        },
        {
          type: 'fileButton',
          id: 'uploadButton',
          label: commonLang.uploadSubmit,
          filebrowser: 'info:url',
          'for': [ 'upload', 'upload' ]
        } ]
      },
      {
        id: 'advanced',
        label: linkLang.advanced,
        title: linkLang.advanced,
        elements: [ {
          type: 'vbox',
          padding: 1,
          children: [ {
            type: 'hbox',
            widths: [ '45%', '35%', '20%' ],
            children: [ {
              type: 'text',
              id: 'advId',
              requiredContent: 'a[id]',
              label: linkLang.id,
              setup: setupAdvParams,
              commit: commitAdvParams
            },
            {
              type: 'select',
              id: 'advLangDir',
              requiredContent: 'a[dir]',
              label: linkLang.langDir,
              'default': '',
              style: 'width:110px',
              items: [
                [ commonLang.notSet, '' ],
                [ linkLang.langDirLTR, 'ltr' ],
                [ linkLang.langDirRTL, 'rtl' ]
              ],
              setup: setupAdvParams,
              commit: commitAdvParams
            },
            {
              type: 'text',
              id: 'advAccessKey',
              requiredContent: 'a[accesskey]',
              width: '80px',
              label: linkLang.acccessKey,
              maxLength: 1,
              setup: setupAdvParams,
              commit: commitAdvParams

            } ]
          },
          {
            type: 'hbox',
            widths: [ '45%', '35%', '20%' ],
            children: [ {
              type: 'text',
              label: linkLang.name,
              id: 'advName',
              requiredContent: 'a[name]',
              setup: setupAdvParams,
              commit: commitAdvParams

            },
            {
              type: 'text',
              label: linkLang.langCode,
              id: 'advLangCode',
              requiredContent: 'a[lang]',
              width: '110px',
              'default': '',
              setup: setupAdvParams,
              commit: commitAdvParams

            },
            {
              type: 'text',
              label: linkLang.tabIndex,
              id: 'advTabIndex',
              requiredContent: 'a[tabindex]',
              width: '80px',
              maxLength: 5,
              setup: setupAdvParams,
              commit: commitAdvParams

            } ]
          } ]
        },
        {
          type: 'vbox',
          padding: 1,
          children: [ {
            type: 'hbox',
            widths: [ '45%', '55%' ],
            children: [ {
              type: 'text',
              label: linkLang.advisoryTitle,
              requiredContent: 'a[title]',
              'default': '',
              id: 'advTitle',
              setup: setupAdvParams,
              commit: commitAdvParams

            },
            {
              type: 'text',
              label: linkLang.advisoryContentType,
              requiredContent: 'a[type]',
              'default': '',
              id: 'advContentType',
              setup: setupAdvParams,
              commit: commitAdvParams

            } ]
          },
          {
            type: 'hbox',
            widths: [ '45%', '55%' ],
            children: [ {
              type: 'text',
              label: linkLang.cssClasses,
              requiredContent: 'a(cke-xyz)', // Random text like 'xyz' will check if all are allowed.
              'default': '',
              id: 'advCSSClasses',
              setup: setupAdvParams,
              commit: commitAdvParams

            },
            {
              type: 'text',
              label: linkLang.charset,
              requiredContent: 'a[charset]',
              'default': '',
              id: 'advCharset',
              setup: setupAdvParams,
              commit: commitAdvParams

            } ]
          },
          {
            type: 'hbox',
            widths: [ '45%', '55%' ],
            children: [ {
              type: 'text',
              label: linkLang.rel,
              requiredContent: 'a[rel]',
              'default': '',
              id: 'advRel',
              setup: setupAdvParams,
              commit: commitAdvParams
            },
            {
              type: 'text',
              label: linkLang.styles,
              requiredContent: 'a{cke-xyz}', // Random text like 'xyz' will check if all are allowed.
              'default': '',
              id: 'advStyles',
              validate: CKEDITOR.dialog.validate.inlineStyle( editor.lang.common.invalidInlineStyle ),
              setup: setupAdvParams,
              commit: commitAdvParams
            } ]
          },
          {
            type: 'hbox',
            widths: [ '45%', '55%' ],
            children: [ {
              type: 'checkbox',
              id: 'download',
              requiredContent: 'a[download]',
              label: linkLang.download,
              setup: function( data ) {
                if ( data.download !== undefined )
                  this.setValue( 'checked', 'checked' );
              },
              commit: function( data ) {
                if ( this.getValue() ) {
                  data.download = this.getValue();
                }
              }
            } ]
          } ]
        } ]
      } ],
      onShow: function() {
        var editor = this.getParentEditor(),
          selection = editor.getSelection(),
          displayTextField = this.getContentElement( 'info', 'linkDisplayText' ).getElement().getParent().getParent(),
          elements = plugin.getSelectedLink( editor, true ),
          firstLink = elements[ 0 ] || null;

        // Fill in all the relevant fields if there's already one link selected.
        if ( firstLink && firstLink.hasAttribute( 'href' ) ) {
          // Don't change selection if some element is already selected.
          // For example - don't destroy fake selection.
          if ( !selection.getSelectedElement() && !selection.isInTable() ) {
            selection.selectElement( firstLink );
          }
        }

        var data = plugin.parseLinkAttributes( editor, firstLink );

        // Here we'll decide whether or not we want to show Display Text field.
        if ( elements.length <= 1 && plugin.showDisplayTextForElement( firstLink, editor ) ) {
          displayTextField.show();
        } else {
          displayTextField.hide();
        }

        // Record down the selected element in the dialog.
        this._.selectedElements = elements;

        this.setupContent( data );
      },
      onOk: function() {
        var data = {};

        // Collect data from fields.
        this.commitContent( data );

        if ( !this._.selectedElements.length ) {
          insertLinksIntoSelection( editor, data );
        } else {
          editLinksInSelection( editor, this._.selectedElements, data );

          delete this._.selectedElements;
        }
      },
      onLoad: function() {
        if ( !editor.config.linkShowAdvancedTab )
          this.hidePage( 'advanced' ); //Hide Advanded tab.

        if ( !editor.config.linkShowTargetTab )
          this.hidePage( 'target' ); //Hide Target tab.

        this.getElement().addClass( 'a11ylink_dialog' );
      },
      // Inital focus on 'linkDisplayText' field if link is of type URL.
      onFocus: function() {
        var linkType = this.getContentElement( 'info', 'linkType' ),
          linkDisplayTextField;

        if ( linkType && linkType.getValue() == 'url' ) {
          linkDisplayTextField = this.getContentElement( 'info', 'linkDisplayText' );
          linkDisplayTextField.select();
        }
      }
    };
  } );
} )();
// jscs:disable maximumLineLength
/**
 * The e-mail address anti-spam protection option. The protection will be
 * applied when creating or modifying e-mail links through the editor interface.
 *
 * Two methods of protection can be chosen:
 *
 * 1. The e-mail parts (name, domain, and any other query string) are
 *     assembled into a function call pattern. Such function must be
 *     provided by the developer in the pages that will use the contents.
 * 2. Only the e-mail address is obfuscated into a special string that
 *     has no meaning for humans or spam bots, but which is properly
 *     rendered and accepted by the browser.
 *
 * Both approaches require JavaScript to be enabled.
 *
 *    // href="mailto:tester@ckeditor.com?subject=subject&body=body"
 *    config.emailProtection = '';
 *
 *    // href="<a href=\"javascript:void(location.href=\'mailto:\'+String.fromCharCode(116,101,115,116,101,114,64,99,107,101,100,105,116,111,114,46,99,111,109)+\'?subject=subject&body=body\')\">e-mail</a>"
 *    config.emailProtection = 'encode';
 *
 *    // href="javascript:mt('tester','ckeditor.com','subject','body')"
 *    config.emailProtection = 'mt(NAME,DOMAIN,SUBJECT,BODY)';
 *
 * @since 3.1
 * @cfg {String} [emailProtection='' (empty string = disabled)]
 * @member CKEDITOR.config
 */
