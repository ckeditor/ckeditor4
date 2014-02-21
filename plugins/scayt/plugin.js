
CKEDITOR.plugins.add('scayt', {
	//requires : ['menubutton', 'dialog'],
	requires: 'menubutton,dialog',
	lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en-au,en-ca,en-gb,en,eo,es,et,eu,fa,fi,fo,fr-ca,fr,gl,gu,he,hi,hr,hu,is,it,ja,ka,km,ko,lt,lv,mk,mn,ms,nb,nl,no,pl,pt-br,pt,ro,ru,sk,sl,sr-latn,sr,sv,th,tr,ug,uk,vi,zh-cn,zh', // %REMOVE_LINE_CORE%
	icons: 'scayt', // %REMOVE_LINE_CORE%
	hidpi: true, // %REMOVE_LINE_CORE%
	tabToOpen : null,
	dialogName: 'scaytDialog',
	init: function(editor) {
		var self = this,
			plugin = CKEDITOR.plugins.scayt;
		
		this.bindEvents(editor);
		this.parseConfig(editor);
		this.addRule(editor);

		// source mode
		CKEDITOR.dialog.add(this.dialogName, CKEDITOR.getUrl(this.path + 'dialogs/options.js'));
		// end source mode

		this.addMenuItems(editor);
		var config = editor.config,
			lang = editor.lang.scayt;
		
		editor.ui.add('Scayt', CKEDITOR.UI_MENUBUTTON, {
			label : lang.title,
			title : lang.title,
			modes : {wysiwyg: 1},
			toolbar: 'spellchecker,20',
			onRender: function() {
				var that = this;
				var _editor = editor;
				var isLtIE10 = CKEDITOR.env.ie && CKEDITOR.env.version < 10;

				_editor.on('scaytButtonState', function(ev) {
					var _ev = ev;

					// bug in IE 8, 9 - state was not applied on scayt autostartup
					setTimeout(function() {
						if(typeof _ev.data != undefined) {
							that.setState(_ev.data);
						}
					}, isLtIE10 ? 500 : 50);
				});
			},
			onMenu : function() {
				var scaytInstance = CKEDITOR.plugins.scayt.getScayt(editor);

				editor.getMenuItem('scaytToggle').label = editor.lang.scayt[(scaytInstance ? plugin.state[editor.name] : false) ? 'disable' : 'enable'];

				// If UI tab is disabled we shouldn't show menu item
				var menuDefinition = {
					scaytToggle  : CKEDITOR.TRISTATE_OFF,
					scaytOptions : scaytInstance ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
					scaytLangs   : scaytInstance ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
					scaytDict    : scaytInstance ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
					scaytAbout   : scaytInstance ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
					WSC          : typeof editor.plugins.wsc == "object" ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
				};

				if(editor.config.scayt_uiTabs[0].toString() === '0') {
					delete menuDefinition.scaytOptions;
				}

				if(editor.config.scayt_uiTabs[1].toString() === '0') {
					delete menuDefinition.scaytLangs;
				}

				if(editor.config.scayt_uiTabs[2].toString() === '0') {
					delete menuDefinition.scaytDict;
				}
				
				return menuDefinition;
			}
		});

		// If the 'contextmenu' plugin is loaded, register the listeners.
		if(editor.contextMenu && editor.addMenuItems) {
			editor.contextMenu.addListener(function(element, selection) {
				var scaytInstance = plugin.getScayt(editor);
				var result;
				
				if(scaytInstance) {
					// TODO: implement right lang getter
					var selectionNode = scaytInstance.getSelectionNode(),
						word;

					if(selectionNode) {
						word = selectionNode.getAttribute(scaytInstance.getNodeAttribute());
					} else {
						word = selectionNode;
					}

					// SCAYT shouldn't build context menu if instance isnot created or word is without misspelling
					if(word) {
						var items = self.menuGenerator(editor, word, self);

						scaytInstance.showBanner('.' + editor.contextMenu._.definition.panel.className.split(' ').join(' .'));
						result = items;
					}
				}

				return result;
			});

			editor.contextMenu._.onHide = CKEDITOR.tools.override(editor.contextMenu._.onHide, function(org) {
				return function() {
					var scaytInstance = plugin.getScayt(editor);

					if(scaytInstance) {
						scaytInstance.hideBanner();
					}

					return org.apply(this);
				};
			});
		}
	},
	addMenuItems: function(editor) {
		var self = this,
			plugin = CKEDITOR.plugins.scayt,
			menuGroup = 'scaytButton';

		editor.addMenuGroup(menuGroup);

		var items_order = editor.config.scayt_contextMenuItemsOrder.split('|');

		if(items_order && items_order.length) {
			for(var pos = 0 ; pos < items_order.length ; pos++) {
				editor.addMenuGroup('scayt_' + items_order[pos], pos - 10);
			}
		}

		var uiMenuItems = {
			scaytToggle: {
				label : editor.lang.scayt.enable,
				group : menuGroup,
				onClick : function() {
					var scaytInstance = plugin.getScayt(editor);

					plugin.state[editor.name] = !plugin.state[editor.name];

					if(plugin.state[editor.name] === true) {
						if(!scaytInstance) {
							plugin.createScayt(editor);
						}
					} else {
						if(scaytInstance) {
							plugin.destroy(editor);
						}
					}
				}
			},
			scaytAbout: {
				label : editor.lang.scayt.about,
				group : menuGroup,
				onClick : function() {
					var scaytInstance = plugin.getScayt(editor);

					scaytInstance.tabToOpen = 'about';
					editor.openDialog(self.dialogName);
				}
			},
			scaytOptions: {
				label : editor.lang.scayt.optionsTab,
				group : menuGroup,
				onClick : function() {
					var scaytInstance = plugin.getScayt(editor);

					scaytInstance.tabToOpen = 'options';
					editor.openDialog(self.dialogName);
					//editor.openDialog(commandName);
				}
			},
			scaytLangs: {
				label : editor.lang.scayt.langs,
				group : menuGroup,
				onClick : function() {
					var scaytInstance = plugin.getScayt(editor);

					scaytInstance.tabToOpen = 'langs';
					editor.openDialog(self.dialogName);
				}
			},
			scaytDict: {
				label : editor.lang.scayt.dictionariesTab,
				group : menuGroup,
				onClick : function() {
					var scaytInstance = plugin.getScayt(editor);

					scaytInstance.tabToOpen = 'dictionaries';
					editor.openDialog(self.dialogName);
				}
			},
			WSC:	{
					label : editor.lang.wsc.toolbar,
					group : menuGroup,
					command : 'checkspell'
			}
		};

		editor.addMenuItems(uiMenuItems);
	},
	bindEvents: function(editor) {
		var self = this,
			plugin = CKEDITOR.plugins.scayt,
			inline_mode = (editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE);

		CKEDITOR.on('dialogDefinition', function(dialogDefinitionEvent) {
			var dialogDefinition = dialogDefinitionEvent.data.definition;
			
			dialogDefinition.dialog.on('cancel', function(cancelEvent) {
				return false;
			}, this, null, -1);
		});
			
		var bindInlineModeEvents = function(editor) {
			editor.once('focus', contentDomReady);
			editor.once('blur', scaytDestroy);
		};

		var contentDomReady = function() {
			// The event is fired when editable iframe node was reinited so we should restart our service
			if(plugin.state[editor.name] === true && editor.readOnly === false) {
				plugin.createScayt(editor);
			}
		};

		var scaytDestroy = function(data) {
			var scaytInstance = plugin.getScayt(editor);

			if(scaytInstance) {
				plugin.destroy(editor);
			}
			
			if(inline_mode) {
				bindInlineModeEvents(editor);
			}
		};
		
		if(inline_mode) {
			bindInlineModeEvents(editor);
		} else {
			editor.on('contentDom', contentDomReady);	
		}

		editor.on('beforeCommandExec', function(ev) {
			var scaytInstance;

			// TODO: after switching in source mode not recreate SCAYT instance, try to just rerun markuping to don't make requests to server
			if(ev.data.name in plugin.options.disablingCommandExec && editor.mode == 'wysiwyg') {
				scaytInstance = plugin.getScayt(editor);
				if(scaytInstance) {
					plugin.destroy(editor);
					editor.fire('scaytButtonState', CKEDITOR.TRISTATE_DISABLED);
				}
			} else if(ev.data.name === 'bold' || ev.data.name === 'italic' || ev.data.name === 'underline' || ev.data.name === 'strike' || ev.data.name === 'subscript' || ev.data.name === 'superscript') {
				scaytInstance = plugin.getScayt(editor);
				if(scaytInstance) {
					scaytInstance.removeMarkupInSelectionNode();
					scaytInstance.fire('startSpellCheck');
				}
			}
		});

		editor.on('beforeSetMode', function(ev) {
			var scaytInstance;
			// needed when we use:
			// CKEDITOR.instances.editor_ID.setMode("source")
			// CKEDITOR.instances.editor_ID.setMode("wysiwyg")
			// can't be implemented in editor.on('mode', function(ev) {});
			if (ev.data == 'source') {
				scaytInstance = plugin.getScayt(editor);
				if(scaytInstance) {
					plugin.destroy(editor);
					editor.fire('scaytButtonState', CKEDITOR.TRISTATE_DISABLED);
				}
			} /*else if (ev.data == 'wysiwyg') {

			}*/
		});

		editor.on('afterCommandExec', function(ev) {
			var scaytInstance;

			if(editor.mode == 'wysiwyg' && (ev.data.name == 'undo' || ev.data.name == 'redo')) {
				scaytInstance = plugin.getScayt(editor);
				if(scaytInstance) {
					setTimeout(function() {
						scaytInstance.fire('startSpellCheck');
					}, 250);
				}
			}
		});

		// handle readonly changes
		editor.on('readOnly', function(ev) {
			var scaytInstance;

			if(ev) {
				scaytInstance = plugin.getScayt(editor);

				if(ev.editor.readOnly === true) {
					if(scaytInstance) {
						scaytInstance.fire('removeMarkupInDocument', {});
					}
				} else {
					if(scaytInstance) {
						scaytInstance.fire('startSpellCheck');
					} else if(ev.editor.mode == 'wysiwyg' && plugin.state[ev.editor.name] === true) {
						plugin.createScayt(editor);
						ev.editor.fire('scaytButtonState', CKEDITOR.TRISTATE_ON);
					}
				}
			}
		});
		
		// we need to destroy SCAYT before CK editor will be completely destroyed
		editor.on('beforeDestroy', scaytDestroy);

		//#9439 after SetData method fires contentDom event and SCAYT create additional instanse
		// This way we should destroy SCAYT on setData event when contenteditable Iframe was re-created
		editor.on('setData', function() {
			var scaytInstance = plugin.getScayt(editor);

			if(scaytInstance) {
				plugin.destroy(editor);
			}
		}, this, null, 50);

		// Reload spell-checking for current word after insertion completed.
		editor.on('insertElement', function() {
			var scaytInstance = plugin.getScayt(editor);

			if(scaytInstance) {
				scaytInstance.removeMarkupInSelectionNode();
				scaytInstance.fire('startSpellCheck');
			}
		}, this, null, 50);

		editor.on('insertHtml', function() {
			var scaytInstance = plugin.getScayt(editor);

			if(scaytInstance) {
				scaytInstance.removeMarkupInSelectionNode();
				scaytInstance.fire('startSpellCheck');
			}
		}, this, null, 50);

		// The event is listening to open necessary dialog tab
		editor.on('scaytDialogShown', function(ev) {
			var dialog = ev.data,
				scaytInstance = plugin.getScayt(editor);

			dialog.selectPage(scaytInstance.tabToOpen);
		});

		editor.on('getData', function(ev) {
			var scaytInstance = plugin.getScayt(editor);

			if(scaytInstance) {
				ev.data.dataValue = scaytInstance.removeMarkupFromString(ev.data.dataValue);
			}
		});

		/*
		After each 'paste' CKEditor call insertHtml and we have subscribed for 'insertHtml' event before
		editor.on('paste', function(ev)
			{
				var scaytInstance = plugin.getScayt(editor);
				if(!scaytInstance || scaytInstance.enabled === false)
					return;

				setTimeout(function() {
					scaytInstance.removeMarkupInSelectionNode();
					scaytInstance.fire("startSpellCheck");
				}, 0);
			});*/
	},
	parseConfig: function(editor) {
		var plugin = CKEDITOR.plugins.scayt;

		// preprocess config for backward compatibility
		plugin.replaceOldOptionsNames(editor.config);

		// Checking editor's config after initialization
		if(typeof editor.config.scayt_autoStartup !== 'boolean') {
			editor.config.scayt_autoStartup = false;
		}
		plugin.state[editor.name] = editor.config.scayt_autoStartup;

		if(!editor.config.scayt_contextCommands) {
			editor.config.scayt_contextCommands = 'ignore|ignoreall|add';
		}

		if(!editor.config.scayt_contextMenuItemsOrder) {
			editor.config.scayt_contextMenuItemsOrder = 'suggest|moresuggest|control';
		}

		if(!editor.config.scayt_sLang) {
			editor.config.scayt_sLang = 'en_US';
		}
		
		if(editor.config.scayt_maxSuggestions === undefined || typeof editor.config.scayt_maxSuggestions != 'number' || editor.config.scayt_maxSuggestions < 0) {
			editor.config.scayt_maxSuggestions = 5;
		}

		if(editor.config.scayt_customDictionaryIds === undefined || typeof editor.config.scayt_customDictionaryIds !== 'string') {
			editor.config.scayt_customDictionaryIds = '';
		}

		if(editor.config.scayt_userDictionaryName === undefined || typeof editor.config.scayt_userDictionaryName !== 'string') {
			editor.config.scayt_userDictionaryName = null;
		}

		if(typeof editor.config.scayt_uiTabs === 'string' && editor.config.scayt_uiTabs.split(',').length === 3) {
			editor.config.scayt_uiTabs = editor.config.scayt_uiTabs.split(',');
		} else {
			editor.config.scayt_uiTabs = [1,1,1];
		}

		if(typeof editor.config.scayt_serviceProtocol != 'string') {
			editor.config.scayt_serviceProtocol = null;
		}

		if(typeof editor.config.scayt_serviceHost != 'string') {
			editor.config.scayt_serviceHost = null;
		}

		if(typeof editor.config.scayt_servicePort != 'string') {
			editor.config.scayt_servicePort = null;
		}

		if(typeof editor.config.scayt_servicePath != 'string') {
			editor.config.scayt_servicePath = null;
		}

		if(!editor.config.scayt_moreSuggestions) {
			editor.config.scayt_moreSuggestions = 'on';
		}

		if(typeof editor.config.scayt_customerId !== 'string') {
			editor.config.scayt_customerId = '1:WvF0D4-UtPqN1-43nkD4-NKvUm2-daQqk3-LmNiI-z7Ysb4-mwry24-T8YrS3-Q2tpq2';
		}

		if(typeof editor.config.scayt_srcUrl !== 'string') {
			var protocol = document.location.protocol;
			protocol = protocol.search(/https?:/) != -1 ? protocol : 'http:';

			editor.config.scayt_srcUrl = protocol + '//svc.webspellchecker.net/spellcheck31/lf/scayt3/ckscayt/ckscayt.js';
		}

		if(typeof CKEDITOR.config.scayt_handleCheckDirty !== 'boolean') {
			CKEDITOR.config.scayt_handleCheckDirty = true;
		}

		if(typeof CKEDITOR.config.scayt_handleUndoRedo !== 'boolean') {
			CKEDITOR.config.scayt_handleUndoRedo = true;
		}
	},	
	addRule: function(editor) {
		var dataProcessor = editor.dataProcessor,
			htmlFilter = dataProcessor && dataProcessor.htmlFilter,
			pathFilters = editor._.elementsPath && editor._.elementsPath.filters,
			dataFilter = dataProcessor && dataProcessor.dataFilter,
			removeFormatFilter = editor.addRemoveFormatFilter,
			scaytFilter = function scaytFilter(element) {
				var plugin = CKEDITOR.plugins.scayt,
					scaytInstance = plugin.getScayt(editor);
				
				if(!scaytInstance) {
					return element.getName();
				} else if(element.hasAttribute(plugin.options.data_attribute_name)) {
					return false;
				}
			},
			removeFormatFilterTemplate = function(element) {
				var plugin = CKEDITOR.plugins.scayt,
					scaytInstance = plugin.getScayt(editor),
					result = true;
				
				if(scaytInstance && element.hasAttribute(plugin.options.data_attribute_name)) {
					result = false;
				}

				return result;
			};

		if(pathFilters) {
			pathFilters.push(scaytFilter);
		}

		if(dataFilter) {
			var dataFilterRules = {
				elements: {
					span: function(element) {
						var plugin = CKEDITOR.plugins.scayt;
							
						if(element.attributes[plugin.options.data_attribute_name]) {
							delete element.name;
						}

						return element;
					}
				}
			};

			dataFilter.addRules(dataFilterRules);
		}

		if(removeFormatFilter) {
			removeFormatFilter.call(editor, removeFormatFilterTemplate);
		}
	},
	scaytMenuDefinition: function(editor) {
		var self = this,
			plugin = CKEDITOR.plugins.scayt;

		return {
			scayt_ignore: {
				label: 	editor.lang.scayt.ignore,
				group : 'scayt_control',
				order : 1,
				exec: function(editor) {
					var scaytInstance = plugin.getScayt(editor);
					scaytInstance.ignoreWord();
				}
			},
			scayt_ignoreall: {
				label : editor.lang.scayt.ignoreAll,
				group : 'scayt_control',
				order : 2,
				exec: function(editor) {
					var scaytInstance = plugin.getScayt(editor);
					scaytInstance.ignoreAllWords();
				}
			},
			scayt_add: {
				label : editor.lang.scayt.addWord,
				group : 'scayt_control',
				order : 3,
				exec : function(editor) {
					var scaytInstance = plugin.getScayt(editor);
					scaytInstance.addWordToUserDictionary();
				}
			},
			option:{
				label : editor.lang.scayt.options,
				group : 'scayt_control',
				order : 4,
				exec: function(editor) {
					var scaytInstance = plugin.getScayt(editor);

					scaytInstance.tabToOpen = 'options';
					editor.openDialog(self.dialogName);
				},
				verification: function(editor) {
					return (editor.config.scayt_uiTabs[0] == 1) ? true : false;
				}
			},
			language: {
				label : editor.lang.scayt.languagesTab,
				group : 'scayt_control',
				order : 5,
				exec: function(editor) {
					var scaytInstance = plugin.getScayt(editor);

					scaytInstance.tabToOpen = 'langs';
					editor.openDialog(self.dialogName);
				},
				verification: function(editor) {
					return (editor.config.scayt_uiTabs[1] == 1) ? true : false;
				}
			},
			dictionary: {
				label : editor.lang.scayt.dictionariesTab,
				group : 'scayt_control',
				order : 6,
				exec: function(editor) {
					var scaytInstance = plugin.getScayt(editor);

					scaytInstance.tabToOpen = 'dictionaries';
					editor.openDialog(self.dialogName);
				},
				verification: function(editor) {
					return (editor.config.scayt_uiTabs[2] == 1) ? true : false;
				}
			},
			about: {
				label : editor.lang.scayt.aboutTab,
				group : 'scayt_control',
				order : 7,
				exec: function(editor) {
					var scaytInstance = CKEDITOR.plugins.scayt.getScayt(editor);

					scaytInstance.tabToOpen = 'about';
					editor.openDialog(self.dialogName);
				}
			}
		};
	},
	buildSuggestionMenuItems: function(editor, suggestions) {
		var self = this,
			itemList = {},
			subItemList = {};
		
		if(suggestions.length > 0 && suggestions[0] !== 'no_any_suggestions') {
			for(var i = 0; i < suggestions.length; i++) {
				
				var commandName = 'scayt_suggest_' + CKEDITOR.plugins.scayt.suggestions[i].replace(' ', '_');
				editor.addCommand(commandName, self.createCommand(CKEDITOR.plugins.scayt.suggestions[i]));
				
				if(i < editor.config.scayt_maxSuggestions) {
					/* mainSuggestions */
					editor.addMenuItem(commandName, {
						label: suggestions[i],
						command: commandName,
						group: 'scayt_suggest',
						order: i + 1
					});
					itemList[commandName] = CKEDITOR.TRISTATE_OFF;
				} else {
					//moreSuggestions 
					editor.addMenuItem(commandName, {
						label: suggestions[i],
						command: commandName,
						group: 'scayt_moresuggest',
						order: i + 1
					});
					subItemList[commandName] = CKEDITOR.TRISTATE_OFF;

					if(editor.config.scayt_moreSuggestions === 'on') {
						editor.addMenuItem('scayt_moresuggest', {
							label : editor.lang.scayt.moreSuggestions,
							group : 'scayt_moresuggest',
							order : 10,
							getItems : function() {
								return subItemList;
							}
						});
					
						itemList['scayt_moresuggest'] = CKEDITOR.TRISTATE_OFF;
					}
				}
			}
		} else {
			var noSuggestionsCommand = 'no_scayt_suggest';
			itemList[noSuggestionsCommand] = CKEDITOR.TRISTATE_DISABLED;
			
			editor.addCommand(noSuggestionsCommand, {
				exec: function() {

				}
			});

			editor.addMenuItem(noSuggestionsCommand, {
				label : editor.lang.scayt['noSuggestions'] || noSuggestionsCommand,
				command: noSuggestionsCommand,
				group : 'scayt_suggest',
				order : 0
			});
		}

		return itemList;
	},
	menuGenerator: function(editor, word) {
		var self = this,
			scaytInstance = CKEDITOR.plugins.scayt.getScayt(editor),
			menuItem = this.scaytMenuDefinition(editor),
			itemList = {},
			mainSuggestions = {},
			moreSuggestions = {},
			allowedOption = editor.config.scayt_contextCommands.split('|');
		
		scaytInstance.fire('getSuggestionsList', {lang: scaytInstance.getLang(), word: word});
		itemList = this.buildSuggestionMenuItems(editor, CKEDITOR.plugins.scayt.suggestions);

		if(editor.config.scayt_contextCommands == 'off') {
			return itemList;
		}

		for(var key in menuItem) {
			if(CKEDITOR.tools.indexOf(allowedOption, key.replace('scayt_', '')) == -1 && editor.config.scayt_contextCommands != 'all') {
				continue;
			}

			itemList[key] = CKEDITOR.TRISTATE_OFF;
			// delete item from context menu if its state isn't verified as allowed
			if(typeof menuItem[key].verification === 'function' && !menuItem[key].verification(editor)) {
				// itemList[key] = (menuItem[key].verification(editor)) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;
				delete itemList[key];
			}
			
			editor.addCommand(key, {
				exec: menuItem[key].exec
			});
			
			editor.addMenuItem(key, {
				label : editor.lang.scayt[menuItem[key].label] || menuItem[key].label,
				command: key,
				group : menuItem[key].group,
				order : menuItem[key].order
			});
		}

		return itemList;
	},
	createCommand: function(suggestion) {
		return {
			exec: function(editor) {
				var scaytInstance = CKEDITOR.plugins.scayt.getScayt(editor);
				scaytInstance.replaceSelectionNode({word: suggestion});
			}
		};
	}
});

CKEDITOR.plugins.scayt = {
	state: {},
	instances : {},
	suggestions: [],
	loadingHelper: {
		loadOrder: []
	},
	isLoading: false,
	options: {
		disablingCommandExec: {
			source: true,
			newpage: true,
			templates: true
		},
		data_attribute_name: 'data-scayt-word'
	},
	backCompatibilityMap: {
		'scayt_service_protocol': 'scayt_serviceProtocol',
		'scayt_service_host'	: 'scayt_serviceHost',
		'scayt_service_port'	: 'scayt_servicePort',
		'scayt_service_path'	: 'scayt_servicePath',
		'scayt_customerid'		: 'scayt_customerId'
	},
	replaceOldOptionsNames: function(config) {
		for(var key in config) {
			if(key in this.backCompatibilityMap) {
				config[this.backCompatibilityMap[key]] = config[key];
				delete config[key];
			}
		}
	},
	createScayt : function(editor) {
		var self = this;

		this.loadScaytLibrary(editor, function(_editor) {
			var _scaytInstanceOptions = {
				lang 				: _editor.config.scayt_sLang,
				container 			: _editor.editable().$.nodeName == 'BODY' ? _editor.document.getWindow().$.frameElement : _editor.editable().$,
				customDictionary 	: _editor.config.scayt_customDictionaryIds,
				userDictionaryName 	: _editor.config.scayt_userDictionaryName,
				localization 		: _editor.langCode,
				customer_id 		: _editor.config.scayt_customerId,
				data_attribute_name : self.options.data_attribute_name
			};

			if(_editor.config.scayt_serviceProtocol) {
				_scaytInstanceOptions['service_protocol'] = _editor.config.scayt_serviceProtocol;
			}

			if(_editor.config.scayt_serviceHost) {
				_scaytInstanceOptions['service_host'] = _editor.config.scayt_serviceHost;
			}

			if(_editor.config.scayt_servicePort) {
				_scaytInstanceOptions['service_port'] = _editor.config.scayt_servicePort;
			}

			if(_editor.config.scayt_servicePath) {
				_scaytInstanceOptions['service_path'] = _editor.config.scayt_servicePath;
			}

			var _scaytInstance = new SCAYT.CKSCAYT(_scaytInstanceOptions, function() {
				// success callback
			}, function() {
				// error callback
			});

			_scaytInstance.subscribe('suggestionListSend', function(data) {
				// TODO: 1. Maybe store suggestions for specific editor 
				// TODO: 2. Fix issue with suggestion duplicates on on server
				//CKEDITOR.plugins.scayt.suggestions = data.suggestionList;
				var _wordsCollection = {},
					_suggestionList =[];
				for (var i=0; i < data.suggestionList.length; i++) {
					if (!_wordsCollection[data.suggestionList[i]]) {
						_wordsCollection[data.suggestionList[i]] = data.suggestionList[i];
						_suggestionList.push(data.suggestionList[i]);
					}
				}
				CKEDITOR.plugins.scayt.suggestions = _suggestionList;

			});

			self.instances[_editor.name] = _scaytInstance;
			_editor.fire('scaytButtonState', _editor.readOnly ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_ON);
		});
	},
	destroy: function(editor) {
		var self = this,
			scaytInstance = self.getScayt(editor);

		if(scaytInstance) {
			scaytInstance.destroy();
		}

		delete this.instances[editor.name];
		editor.fire('scaytButtonState', CKEDITOR.TRISTATE_OFF);
	},
	getScayt: function(editor) {
		return this.instances[editor.name];
	},
	loadScaytLibrary: function(editor, callback) {
		var self = this;

		if(typeof window.SCAYT === 'undefined' || typeof window.SCAYT.CKSCAYT !== 'function') {
			// add onLoad callbacks for editors while SCAYT is loading
			this.loadingHelper[editor.name] = callback;
			this.loadingHelper.loadOrder.push(editor.name);

			CKEDITOR.scriptLoader.load(editor.config.scayt_srcUrl, function(success) {
				var editorName;

				CKEDITOR.fireOnce('scaytReady');

				for(var i = 0; i < self.loadingHelper.loadOrder.length; i++) {
					editorName = self.loadingHelper.loadOrder[i];

					if(typeof self.loadingHelper[editorName] === 'function') {
						self.loadingHelper[editorName](CKEDITOR.instances[editorName]);
					}

					delete self.loadingHelper[editorName];
				}
				self.loadingHelper.loadOrder = [];
			});
		} else if(window.SCAYT && typeof window.SCAYT.CKSCAYT === 'function') {
			CKEDITOR.fireOnce('scaytReady');

			if(!self.getScayt(CKEDITOR.instances[editor.name])) {
				if(typeof callback === 'function') {
					callback(editor);
				}
			}
		}
	}
};

CKEDITOR.on('scaytReady', function() {
	// Override editor.checkDirty method avoid CK checkDirty functionality to fix SCAYT issues with incorrect checkDirty behavior.
	if(CKEDITOR.config.scayt_handleCheckDirty === true) {
		var editorCheckDirty = CKEDITOR.editor.prototype;

		editorCheckDirty.checkDirty = CKEDITOR.tools.override(editorCheckDirty.checkDirty, function(org) {
			return function() {
				var retval = null,
					plugin = CKEDITOR.plugins.scayt,
					scaytInstance = plugin.getScayt(this);

				if(!scaytInstance || plugin.state[this.name] === false) {
					retval = org.apply(this);
				} else {
					var currentData = scaytInstance.removeMarkupFromString(this.getSnapshot());//.replace(/&nbsp;/g, ' ');
					var prevData = scaytInstance.removeMarkupFromString(this._.previousValue);//.replace(/&nbsp;/g, ' ');
					
					retval = (this.status == 'ready' && currentData !== prevData);
				}
				
				return retval;
			};
		});

		editorCheckDirty.resetDirty = CKEDITOR.tools.override(editorCheckDirty.resetDirty, function(org) {
			return function() {
				var plugin = CKEDITOR.plugins.scayt,
					scaytInstance = plugin.getScayt(this);

				if(!scaytInstance || plugin.state[this.name] === false) {
					org.apply(this);
				} else {
					this._.previousValue = scaytInstance.removeMarkupFromString(this.getSnapshot());
				}
			};
		});
	}
	
	if(CKEDITOR.config.scayt_handleUndoRedo === true) {
		var undoImagePrototype = CKEDITOR.plugins.undo.Image.prototype;
		
		// add backword compatibility for CKEDITOR 4.2. method equals was repleced on other method
		var equalsContentMethodName = (typeof undoImagePrototype.equalsContent == "function") ? 'equalsContent' : 'equals';

		undoImagePrototype[equalsContentMethodName] = CKEDITOR.tools.override(undoImagePrototype[equalsContentMethodName], function(org) {
			return function(otherImage) {
				var plugin = CKEDITOR.plugins.scayt,
					scaytInstance = plugin.getScayt(this.editor),
					thisContents = this.contents,
					otherContents = otherImage.contents;
				
				// Making the comparison based on content without SCAYT word markers.
				if(scaytInstance) {
					// scayt::reset might return value undefined. (#5742)
					this.contents = scaytInstance.removeMarkupFromString(thisContents) || '';
					otherImage.contents = scaytInstance.removeMarkupFromString(otherContents) || '';
				}
				//console.log(arguments);
				var retval = org.apply(this, arguments);

				this.contents = thisContents;
				otherImage.contents = otherContents;
				
				return retval;
			};
		});
	}
});

/**
 * If enabled (set to `true`), turns on SCAYT automatically
 * after loading the editor.
 *
 *		config.scayt_autoStartup = true;
 *
 * @cfg {Boolean} [scayt_autoStartup=false]
 * @member CKEDITOR.config
 */

/**
 * Defines the number of SCAYT suggestions to show in the main context menu.
 * Possible values are:
 *
 * * `0` (zero) &ndash; No suggestions are shown in the main context menu. All
 *     entries will be listed in the "More Suggestions" sub-menu.
 * * Positive number &ndash; The maximum number of suggestions to show in the context
 *     menu. Other entries will be shown in the "More Suggestions" sub-menu.
 * * Negative number &ndash; 5 suggestions are shown in the main context menu. All other
 *     entries will be listed in the "More Suggestions" sub-menu.
 *
 * Examples:
 *
 *		// Display only three suggestions in the main context menu.
 *		config.scayt_maxSuggestions = 3;
 *
 *		// Do not show the suggestions directly.
 *		config.scayt_maxSuggestions = 0;
 *
 * @cfg {Number} [scayt_maxSuggestions=5]
 * @member CKEDITOR.config
 */

/**
 * Sets the customer ID for SCAYT. Used for hosted users only. Required for migration from free
 * to trial or paid versions.
 *
 *		// Load SCAYT using my customer ID.
 *		config.scayt_customerId  = 'your-encrypted-customer-id';
 *
 * @cfg {String} [scayt_customerId='1:WvF0D4-UtPqN1-43nkD4-NKvUm2-daQqk3-LmNiI-z7Ysb4-mwry24-T8YrS3-Q2tpq2']
 * @member CKEDITOR.config
 */

/**
 * Enables/disables the "More Suggestions" sub-menu in the context menu.
 * Possible values are `'on'` and `'off'`.
 *
 *		// Disables the "More Suggestions" sub-menu.
 *		config.scayt_moreSuggestions = 'off';
 *
 * @cfg {String} [scayt_moreSuggestions='on']
 * @member CKEDITOR.config
 */

/**
 * Customizes the display of SCAYT context menu commands ("Add Word", "Ignore", 
 * "Ignore All", "Options", "Languages", "Dictionaries" and "About"). 
 * This must be a string with one or more of the following
 * words separated by a pipe character (`'|'`):
 *
 * * `off` &ndash; disables all options.
 * * `all` &ndash; enables all options.
 * * `ignore` &ndash; enables the "Ignore" option.
 * * `ignoreall` &ndash; enables the "Ignore All" option.
 * * `add` &ndash; enables the "Add Word" option.
 * * `option` &ndash; enables "Options" menu item.
 * * `language` &ndash; enables "Languages" menu item.
 * * `dictionary` &ndash; enables "Dictionaries" menu item.
 * * `about` &ndash; enables "About" menu item.
 *
 * Note, that availability of 'Options', 'Languages' and 'Dictionaries' items 
 * depends on scayt_uiTabs option also.
 * Example:
 *
 *		// Show only "Add Word" and "Ignore All" in the context menu.
 *		config.scayt_contextCommands = 'add|ignoreall';
 *
 * @cfg {String} [scayt_contextCommands='ignore|ignoreall|add']
 * @member CKEDITOR.config
 */

/**
 * Sets the default spell checking language for SCAYT. Possible values are:
 * `'en_US'`, `'en_GB'`, `'pt_BR'`, `'da_DK'`,
 * `'nl_NL'`, `'en_CA'`, `'fi_FI'`, `'fr_FR'`,
 * `'fr_CA'`, `'de_DE'`, `'el_GR'`, `'it_IT'`,
 * `'nb_NO'`, `'pt_PT'`, `'es_ES'`, `'sv_SE'`.
 *
 *		// Sets SCAYT to German.
 *		config.scayt_sLang = 'de_DE';
 *
 * @cfg {String} [scayt_sLang='en_US']
 * @member CKEDITOR.config
 */

/**
 * Sets the visibility of particular tabs in the SCAYT dialog window and toolbar
 * button. This setting must contain a `1` (enabled) or `0`
 * (disabled) value for each of the following entries, in this precise order,
 * separated by a comma (`','`): `'Options'`, `'Languages'`, and `'Dictionary'`.
 *
 *		// Hides the "Languages" tab.
 *		config.scayt_uiTabs = '1,0,1';
 *
 * @cfg {String} [scayt_uiTabs='1,1,1']
 * @member CKEDITOR.config
 */

/**
 * Allows to specify protocol for WSC service (ssrv.cgi) full path.
 *
 *		// Defines protocol for WSC service (ssrv.cgi) full path.
 *		config.scayt_serviceProtocol='https';
 *
 * @cfg {String} [scayt_serviceProtocol='http']
 * @member CKEDITOR.config
 */

/**
 * Allows to specify host for WSC service (ssrv.cgi) full path.
 *
 *		// Defines host for WSC service (ssrv.cgi) full path.
 *		config.scayt_serviceHost='my-host';
 *
 * @cfg {String} [scayt_serviceHost='svc.webspellchecker.net']
 * @member CKEDITOR.config
 */

/**
 * Allows to specify port for WSC service (ssrv.cgi) full path.
 *
 *		// Defines port for WSC service (ssrv.cgi) full path.
 *		config.scayt_servicePort='2330';
 *
 * @cfg {String} [scayt_servicePort='80']
 * @member CKEDITOR.config
 */

/**
 * Allows to specify path for WSC service (ssrv.cgi) full path.
 *
 *		// Defines host for WSC service (ssrv.cgi) full path.
 *		config.scayt_servicePath='my-path/ssrv.cgi';
 *
 * @cfg {String} [scayt_servicePath='spellcheck31/script/ssrv.cgi']
 * @member CKEDITOR.config
 */

/**
 * Sets the URL to SCAYT core. Required to switch to the licensed version of SCAYT application.
 *
 * Further details available at [http://wiki.webspellchecker.net/doku.php?id=migration:hosredfreetolicensedck](http://wiki.webspellchecker.net/doku.php?id=migration:hosredfreetolicensedck)
 *
 *		config.scayt_srcUrl = "http://my-host/spellcheck/lf/scayt/scayt.js";
 *
 * @cfg {String} [scayt_srcUrl='//svc.webspellchecker.net/spellcheck31/lf/scayt3/ckscayt/ckscayt.js']
 * @member CKEDITOR.config
 */

/**
 * Links SCAYT to custom dictionaries. This is a string containing dictionary IDs
 * separared by commas (`','`). Available only for the licensed version.
 *
 * Further details at [http://wiki.webspellchecker.net/doku.php?id=installationandconfiguration:customdictionaries:licensed](http://wiki.webspellchecker.net/doku.php?id=installationandconfiguration:customdictionaries:licensed)
 *
 *		config.scayt_customDictionaryIds = '3021,3456,3478';
 *
 * @cfg {String} [scayt_customDictionaryIds='']
 * @member CKEDITOR.config
 */

/**
 * Makes it possible to activate a custom dictionary in SCAYT. The user
 * dictionary name must be used. Available only for the licensed version.
 *
 *		config.scayt_userDictionaryName = 'MyDictionary';
 *
 * @cfg {String} [scayt_userDictionaryName='']
 * @member CKEDITOR.config
 */

/**
 * Defines the order SCAYT context menu items by groups.
 * This must be a string with one or more of the following
 * words separated by a pipe character (`'|'`):
 *
 * * `suggest` &ndash; main suggestion word list,
 * * `moresuggest` &ndash; more suggestions word list,
 * * `control` &ndash; SCAYT commands, such as "Ignore" and "Add Word".
 *
 * Example:
 *
 *		config.scayt_contextMenuItemsOrder = 'moresuggest|control|suggest';
 *
 * @cfg {String} [scayt_contextMenuItemsOrder='suggest|moresuggest|control']
 * @member CKEDITOR.config
 */

/**
 * If set to `true` &ndash; overrides checkDirty functionality of CK 
 * to fix SCAYT issues with incorrect checkDirty behavior. If set to `false`, 
 * provides better performance on big preloaded text.
 *
 *		config.scayt_handleCheckDirty = 'false';
 *
 * @cfg {String} [scayt_handleCheckDirty='true']
 * @member CKEDITOR.config
 */

/**
 * If set to `true` &ndash; overrides undo\redo functionality of CK 
 * to fix SCAYT issues with incorrect undo\redo behavior. If set to `false`, 
 * provides better performance on undo\redo text.
 *
 *		config.scayt_handleUndoRedo = 'false';
 *
 * @cfg {String} [scayt_handleUndoRedo='true']
 * @member CKEDITOR.config
 */