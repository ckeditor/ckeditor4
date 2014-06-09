/*
Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.dialog.add( 'scaytDialog', function( editor ) {
	var scayt_instance =  editor.scayt;

	var aboutTabDefinition = '<p><img src="' + scayt_instance.getLogo() + '" /></p>' +
				'<p>' + scayt_instance.getLocal('version') + scayt_instance.getVersion() + '</p>' +
				'<p>' + scayt_instance.getLocal('text_copyrights') + '</p>';

	var doc = CKEDITOR.document;

	var optionGenerator = function() {
		var scayt_instance_ = editor.scayt,
			applicationConfig = scayt_instance.getApplicationConfig(),
			optionArrayUiCheckboxes = [],
			optionLocalizationList = {
				"ignore-all-caps-words" 		: "label_allCaps",
				"ignore-domain-names" 			: "label_ignoreDomainNames",
				"ignore-words-with-mixed-cases" : "label_mixedCase",
				"ignore-words-with-numbers" 	: "label_mixedWithDigits"
			};

		for(var option in applicationConfig) {

			var checkboxConfig = {
				type: "checkbox"
			};

			checkboxConfig.id  = option;
			checkboxConfig.label  = scayt_instance.getLocal(optionLocalizationList[option]);

			optionArrayUiCheckboxes.push(checkboxConfig);
		}

		return optionArrayUiCheckboxes;
	};

	var languageModelState = {
		isChanged : function() {
			return (this.newLang === null || this.currentLang === this.newLang) ? false : true;
		},
		currentLang: scayt_instance.getLang(),
		newLang: null,
		reset: function() {
			this.currentLang = scayt_instance.getLang();
			this.newLang = null;
		},
		id: 'lang'
	};

	var generateDialogTabs = function(tabsList, editor) {
		var tabs = [],
			uiTabs = editor.config.scayt_uiTabs;

		if(!uiTabs) {
			return tabsList;
		} else {
			for(var i in uiTabs) {
				(uiTabs[i] == 1) && tabs.push(tabsList[i]);
			}

			tabs.push(tabsList[tabsList.length - 1]);
		}

		return tabs;
	};

	var dialogTabs = [{
		id : 'options',
		label : scayt_instance.getLocal('tab_options'),
		onShow: function() {
			// console.log("tab show");
		},
		elements : [
			{
				type: 'vbox',
				id: 'scaytOptions',
				children: optionGenerator(),
				onShow: function() {
					var optionsTab = this.getChild(),
						scayt_instance =  editor.scayt;
					for(var i = 0; i < this.getChild().length; i++) {
						this.getChild()[i].setValue(scayt_instance.getApplicationConfig()[this.getChild()[i].id]);
					}

				}
			}

		]
	},
	{
		id : 'langs',
		label : scayt_instance.getLocal('tab_languages'),
		elements : [
			{
				id: "leftLangColumn",
				type: 'vbox',
				align: 'left',
				widths: ['100'],
				children: [
					{
						type: 'html',
						id: 'langBox',
						style: 'overflow: hidden; white-space: normal;',
						html: '<form><div style="float:left;width:45%;margin-left:5px;" id="left-col-' + editor.name + '"></div><div style="float:left;width:45%;margin-left:15px;" id="right-col-' + editor.name + '"></div></form>',
						onShow: function() {
							var scayt_instance =  editor.scayt;
							var lang = scayt_instance.getLang(),
								prefix_id = "scaytLang_",
								radio = doc.getById(prefix_id + lang);

							radio.$.checked = true;
						}
					}
				]

			}
		]
	},
	{
		id : 'dictionaries',
		label : scayt_instance.getLocal('tab_dictionaries'),
		elements : [
			{
				type: 'vbox',
				id: 'rightCol_col__left',
				children: [
					{
						type: 'html',
						id: 'dictionaryNote',
						html: ''
					},
					{
						type: 'text',
						id: 'dictionaryName',
						label: scayt_instance.getLocal('label_fieldNameDic') || 'Dictionary name',
						onShow: function(data) {
							var dialog = data.sender,
								scayt_instance = editor.scayt;

							// IE7 specific fix
							setTimeout(function() {
								// clear dictionaryNote field
								dialog.getContentElement("dictionaries", "dictionaryNote").getElement().setText('');

								// restore/clear dictionaryName field
								if(scayt_instance.getUserDictionaryName() != null && scayt_instance.getUserDictionaryName() != '') {
									dialog.getContentElement("dictionaries", "dictionaryName").setValue(scayt_instance.getUserDictionaryName());
								}
							}, 0);
						}
					},
					{
						type: 'hbox',
						id: 'notExistDic',
						align: 'left',
						style: 'width:auto;',
						widths: [ '50%', '50%' ],
						children: [
							{
								type: 'button',
								id: 'createDic',
								label: scayt_instance.getLocal('btn_createDic'),
								title: scayt_instance.getLocal('btn_createDic'),
								onClick: function() {
									var dialog = this.getDialog(),
										self = dialogDefinition,
										scayt_instance = editor.scayt,
										name = dialog.getContentElement("dictionaries", "dictionaryName").getValue();

									scayt_instance.createUserDictionary(name, function(response) {
										if(!response.error) {
											self.toggleDictionaryButtons.call(dialog, true);
										}
										response.dialog = dialog;
										response.command = "create";
										response.name = name;
										editor.fire("scaytUserDictionaryAction", response);
									}, function(error) {
										error.dialog = dialog;
										error.command = "create";
										error.name = name;
										editor.fire("scaytUserDictionaryActionError", error);
									});
								}
							},
							{
								type: 'button',
								id: 'restoreDic',
								label: scayt_instance.getLocal('btn_restoreDic'),
								title: scayt_instance.getLocal('btn_restoreDic'),
								onClick: function() {
									var dialog = this.getDialog(),
										scayt_instance = editor.scayt,
										self = dialogDefinition,
										name = dialog.getContentElement("dictionaries", "dictionaryName").getValue();

									scayt_instance.restoreUserDictionary(name, function(response) {
										response.dialog = dialog;
										if(!response.error) {
											self.toggleDictionaryButtons.call(dialog, true);
										}
										response.command = "restore";
										response.name = name;
										editor.fire("scaytUserDictionaryAction", response);
									}, function(error) {
										error.dialog = dialog;
										error.command = "restore";
										error.name = name;
										editor.fire("scaytUserDictionaryActionError", error);
									});
								}
							}
						]
					},
					{
						type: 'hbox',
						id: 'existDic',
						align: 'left',
						style: 'width:auto;',
						widths: [ '50%', '50%' ],
						children: [
							{
								type: 'button',
								id: 'removeDic',
								label: scayt_instance.getLocal('btn_deleteDic'),
								title: scayt_instance.getLocal('btn_deleteDic'),
								onClick: function() {
									var dialog = this.getDialog(),
										scayt_instance = editor.scayt,
										self = dialogDefinition,
										dictionaryNameField = dialog.getContentElement("dictionaries", "dictionaryName"),
										name = dictionaryNameField.getValue();

									scayt_instance.removeUserDictionary(name, function(response) {
										dictionaryNameField.setValue("");
										if(!response.error) {
											self.toggleDictionaryButtons.call(dialog, false);
										}
										response.dialog = dialog;
										response.command = "remove";
										response.name = name;
										editor.fire("scaytUserDictionaryAction", response);
									}, function(error) {
										error.dialog = dialog;
										error.command = "remove";
										error.name = name;
										editor.fire("scaytUserDictionaryActionError", error);
									});
								}
							},
							{
								type: 'button',
								id: 'renameDic',
								label: scayt_instance.getLocal('btn_renameDic'),
								title: scayt_instance.getLocal('btn_renameDic'),
								onClick: function() {
									var dialog = this.getDialog(),
										scayt_instance = editor.scayt,
										name = dialog.getContentElement("dictionaries", "dictionaryName").getValue();

									scayt_instance.renameUserDictionary(name, function(response) {
										response.dialog = dialog;
										response.command = "rename";
										response.name = name;
										editor.fire("scaytUserDictionaryAction", response);
									}, function(error) {
										error.dialog = dialog;
										error.command = "rename";
										error.name = name;
										editor.fire("scaytUserDictionaryActionError", error);
									});
								}
							}
						]
					},
					{
						type: 'html',
						id: 'dicInfo',
						html: '<div id="dic_info_editor1" style="margin:5px auto; width:95%;white-space:normal;">' + scayt_instance.getLocal('text_descriptionDic')  + '</div>'
					}
				]
			}
		]
	},
	{
		id : 'about',
		label : scayt_instance.getLocal('tab_about'),
		elements : [
			{
				type : 'html',
				id : 'about',
				style : 'margin: 5px 5px;',
				html : '<div><div id="scayt_about_">' +
						aboutTabDefinition +
						'</div></div>'
			}
		]
	}];

	editor.on("scaytUserDictionaryAction", function(event) {
		var dialog = event.data.dialog,
			dictionaryNote = dialog.getContentElement("dictionaries", "dictionaryNote").getElement(),
			scayt_instance =  event.editor.scayt,
			messageTemplate;

		if(event.data.error === undefined) {

			// success message
			messageTemplate = scayt_instance.getLocal("message_success_" + event.data.command + "Dic");
			messageTemplate = messageTemplate.replace('%s', event.data.name);
			dictionaryNote.setText(messageTemplate);
			SCAYT.$(dictionaryNote.$).css({color: 'blue'});
		} else {

			// error message
			if(event.data.name === '') {

				// empty dictionary name
				dictionaryNote.setText(scayt_instance.getLocal('message_info_emptyDic'));
			} else {
				messageTemplate = scayt_instance.getLocal("message_error_" + event.data.command + "Dic");
				messageTemplate = messageTemplate.replace('%s', event.data.name);
				dictionaryNote.setText(messageTemplate);
			}
			SCAYT.$(dictionaryNote.$).css({color: 'red'});

			if(scayt_instance.getUserDictionaryName() != null && scayt_instance.getUserDictionaryName() != '') {
				dialog.getContentElement("dictionaries", "dictionaryName").setValue(scayt_instance.getUserDictionaryName());
			} else {
				dialog.getContentElement("dictionaries", "dictionaryName").setValue("");
			}
		}
	});

	editor.on("scaytUserDictionaryActionError", function(event) {
		var dialog = event.data.dialog,
			dictionaryNote = dialog.getContentElement("dictionaries", "dictionaryNote").getElement(),
			scayt_instance =  event.editor.scayt,
			messageTemplate;

		if(event.data.name === '') {

			// empty dictionary name
			dictionaryNote.setText(scayt_instance.getLocal('message_info_emptyDic'));
		} else {
			messageTemplate = scayt_instance.getLocal("message_error_" + event.data.command + "Dic");
			messageTemplate = messageTemplate.replace('%s', event.data.name);
			dictionaryNote.setText(messageTemplate);
		}
		SCAYT.$(dictionaryNote.$).css({color: 'red'});


		if(scayt_instance.getUserDictionaryName() != null && scayt_instance.getUserDictionaryName() != '') {
			dialog.getContentElement("dictionaries", "dictionaryName").setValue(scayt_instance.getUserDictionaryName());
		} else {
			dialog.getContentElement("dictionaries", "dictionaryName").setValue("");
		}

	});

	var plugin = CKEDITOR.plugins.scayt;

	var dialogDefinition = {
		title:          scayt_instance.getLocal('text_title'),
		resizable:      CKEDITOR.DIALOG_RESIZE_BOTH,
		minWidth: 		340,
		minHeight: 		260,
		onLoad: function() {
			if(editor.config.scayt_uiTabs[1] == 0) {
				return;
			}

			var dialog = this,
				self = dialogDefinition,
				langBoxes = self.getLangBoxes.call(dialog);

			langBoxes.getParent().setStyle("white-space", "normal");

			//dialog.data = editor.fire( 'scaytDialog', {} );
			self.renderLangList(langBoxes);

			var scayt_instance = editor.scayt;

			this.definition.minWidth = this.getSize().width;
			this.resize(this.definition.minWidth, this.definition.minHeight);
		},
		onCancel: function() {
			languageModelState.reset();
		},
		onHide: function() {
			editor.unlockSelection();
		},
		onShow: function() {
			editor.fire("scaytDialogShown", this);

			if(editor.config.scayt_uiTabs[2] == 0) {
				return;
			}

			var scayt_instance = editor.scayt,
				self = dialogDefinition,
				dialog = this,
				dictionaryNameField = dialog.getContentElement("dictionaries", "dictionaryName"),
				existance = dialog.getContentElement("dictionaries", "existDic").getElement().getParent(),
				notExistance = dialog.getContentElement("dictionaries", "notExistDic").getElement().getParent();

			existance.hide();
			notExistance.hide();

			if(scayt_instance.getUserDictionaryName() != null && scayt_instance.getUserDictionaryName() != '') {
				dialog.getContentElement("dictionaries", "dictionaryName").setValue(scayt_instance.getUserDictionaryName());
				existance.show();
			} else {
				dictionaryNameField.setValue("");
				notExistance.show();
			}
		},
		onOk: function() {
			var dialog = this,
				self = dialogDefinition,
				scayt_instance =  editor.scayt,
				scaytOptions = dialog.getContentElement("options", "scaytOptions"),
				changedOptions = self.getChangedOption.call(dialog);

			scayt_instance.commitOption({ changedOptions: changedOptions });
		},
		toggleDictionaryButtons: function(exist) {
			var existance = this.getContentElement("dictionaries", "existDic").getElement().getParent(),
				notExistance = this.getContentElement("dictionaries", "notExistDic").getElement().getParent();

			if(exist) {
				existance.show();
				notExistance.hide();
			} else {
				existance.hide();
				notExistance.show();
			}

		},
		getChangedOption: function() {
			var changedOption = {};

			if(editor.config.scayt_uiTabs[0] == 1) {
				var dialog = this,
					scaytOptions = dialog.getContentElement("options", "scaytOptions").getChild();

				for(var i = 0; i < scaytOptions.length; i++) {
					if(scaytOptions[i].isChanged()) {
						changedOption[scaytOptions[i].id] = scaytOptions[i].getValue();
					}
				}
			}

			if(languageModelState.isChanged()) {
				changedOption[languageModelState.id] = editor.config.scayt_sLang = languageModelState.currentLang = languageModelState.newLang;
			}

			return changedOption;
		},
		buildRadioInputs: function(key, value) {
			var divContainer = new CKEDITOR.dom.element( 'div' ),
				doc = CKEDITOR.document,
				div = doc.createElement( 'div' ),
				id = "scaytLang_" + value,
				radio = CKEDITOR.dom.element.createFromHtml( '<input id="' +
					id + '" type="radio" ' +
					' value="' + value + '" name="scayt_lang" />' ),

				radioLabel = new CKEDITOR.dom.element( 'label' ),
				scayt_instance = editor.scayt;

			divContainer.setStyles({
				"white-space": "normal",
				'position': 'relative'
			});


			radio.on( 'click', function(data) {
				languageModelState.newLang = data.sender.getValue();
			});

			radioLabel.appendText(key);
			radioLabel.setAttribute("for", id);

			divContainer.append(radio);
			divContainer.append(radioLabel);

			if(value === scayt_instance.getLang()) {
					radio.setAttribute("checked", true);
				radio.setAttribute('defaultChecked', 'defaultChecked');
			}

			return divContainer;
		},
		renderLangList: function(langBoxes) {
			var dialog = this,
				leftCol = langBoxes.find('#left-col-' + editor.name).getItem(0),
				rightCol = langBoxes.find('#right-col-' + editor.name).getItem(0),
				langList = scayt_instance.getLangList(),
				mergedLangList = {},
				sortable = [],
				counter = 0,
				half, lang;

			for(lang in langList.ltr) {
				mergedLangList[lang] = langList.ltr[lang];
			}

			for(lang in langList.rtl) {
				mergedLangList[lang] = langList.rtl[lang];
			}

			// sort alphabetically lang list
			for(lang in mergedLangList) {
				sortable.push([lang, mergedLangList[lang]]);
			}
			sortable.sort(function(a, b) {
				var result = 0;
				if(a[1] > b[1]) {
					result = 1;
				} else if(a[1] < b[1]) {
					result = -1;
				}
				return result;
			});
			mergedLangList = {};
			for(var i = 0; i < sortable.length; i++) {
				mergedLangList[sortable[i][0]] = sortable[i][1];
			}

			half = Math.round(sortable.length / 2);

			for(lang in mergedLangList) {
				counter++;
				dialog.buildRadioInputs(mergedLangList[lang], lang).appendTo(counter <= half ? leftCol : rightCol);
			}
		},
		getLangBoxes: function() {
			var dialog = this,
				langboxes = dialog.getContentElement("langs", "langBox").getElement();

			return langboxes;
		},
		contents: generateDialogTabs(dialogTabs, editor)
	};

	return dialogDefinition;
});