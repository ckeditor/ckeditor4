API Changes in CKEditor 4
========


Overview
---

Changes described in this file are supposed to be definitive.
Changes not included here are instead pending analysis and v3 porting.

Change Entries
---

`CKEDITOR.event::fire` now returns `"false"` if the event has been canceled
(in v3 it returns `"true"`).

The listener function sent to `CKEDITOR.event::on` can now return the boolean
`"false"` to cancel the event.

---

`CKEDITOR.config.corePlugins` is not any more needed, the "core plugins" in v3
are now really part of the core, with their provided API namespaces remained:

* plugins/selection/plugin.js => core/selection.js, the "select all" feature
originally provided by the selection plugin is now a standalone "selectall" plugin.
* plugins/styles/plugin.js => core/style.js
* plugins/styles/styles/default.js => core/styles.js
* plugins/domiterator/plugin.js => core/dom/iterator.js
* plugins/htmldataprocessor/plugin.js => core/htmldataprocessor.js

---

The editor will now support **only one single skin** per page (all editors will use
the same skin).

Because of the above, the following skin related properties have been moved global or deleted:

* `CKEDITOR.skins` => `CKEDITOR.skin`
* `CKEDITOR.skins.add` => **deprecated**
* `CKEDITOR.skins.load( editor, partName, callback )` => `CKEDITOR.skin.loadPart( partName, callback )`
* `CKEDITOR.editor::skinName` => `CKEDITOR.skin.name`
* `CKEDITOR.editor::skinPath` => `CKEDITOR.skin.getPath( 'editor' )`
* `CKEDITOR.editor::skinClass` => **deprecated**

The skin definition file (skin.js) has been simplified in the following sense:

* No longer specify the stylesheet file for skin part, now editor will expect CSS
 file name same as the part name, e.g. "dialog" part will be requiring the dialog.css file in skin directory.
* No longer define theme related properties, e.g. dialog margins, combo grouping.

The "theme" concept is removed, the DOM structure of editor is now defined by creators or plugins individually,
thus the `CKEDITOR.themes` namespace is removed.

The shared space feature provided by v3 theme is now **deprecated**, in favor of the new inline creator.

---

`CKEDITOR.editor::setMode` and `CKEDITOR.editor::getMode` are feature provided by the themedui creator only,
which is not available in instance created by the inline creator, where `CKEDITOR.editor::mode` property will be always "wysiwyg".

`CKEDITOR.config.editingBlock` has been removed, being the "editingBlock" renewed as "editable".

---

`CKEDITOR.focusManager` is now managing the overall "active" state of the entire editor
instead of just the editing block, so all editor UI parts (toolbar, dialog, panel)
that receive DOM focus will turn `CKEDITOR.focusManager::hasFocus` true.

Because of above, now `CKEDITOR.editable::hasFocus` should be used instead for `CKEDITOR.focusManager::hasFocus`,
to check the focus state of editing block.

The `CKEDITOR.focusManager::forceBlur` method has been removed.

---

`CKEDITOR.config.toolbar_Basic` and `CKEDITOR.config.toolbar_Full` are now removed,
custom toolbar layout can be managed easier with `CKEDITOR.config.toolbarGroups`.

---

The "additional CSS" feature provided by `CKEDITOR.editor::addCss` is now moved
to a global `CKEDITOR.addCss`, with specified style rules applies **document wide**.

Thus the proper way for a plugin to style it's editable content is to call `CKEDITOR.addCss`
inside of the plugin's `onLoad` function, rather than it's `init` function in v3.

---

`CKEDITOR.env.version` now reflects the "document mode" in **IE** browsers,
**deprecated** the following properties:

* `CKEDITOR.ie6Compat`
* `CKEDITOR.ie7Compat`
* `CKEDITOR.ie8Compat`
* `CKEDITOR.ie9Compat`

If we'd check for old IEs before IE9, instead of checking for each the above properties in v3

  	if ( CKEDITOR.ie6Compat || CKEDITOR.ie7Compat || CKEDITOR.ie8Compat )

We should check in the following simpler way in v4:

	if ( CKEDITOR.env.version < 9 )

---

On plugin language files, the usual CKEDITOR.plugins.setLang call now enforces
a namespace in the format editor.lang.pluginName, which contains the provided
language entries.

So, in v3 we had:

	CKEDITOR.plugins.setLang( 'myplugin', 'en',
	{
		myplugin :
		{
			title : 'My Plugin'
		}
	});

In v4 it should be changed to:

	CKEDITOR.plugins.setLang( 'myplugin', 'en',
	{
		title : 'My Plugin'
	});

In this way the entry will be available at editor.lang.myplugin.title.

---

Constructor `CKEDITOR.editor` now receives two additional optional params (besides of the configuration object),
to simplify creator implementation:

 	CKEDITOR.editor( config,
 	/** @type {CKEDITOR.dom.element} */ element,
 	/** @type {Number} */ elementMode );

---

CKEDITOR creators ( `CKEDITOR.replace`, `CKEDITOR.replace` and `CKEDITOR.appendTo` )
are not anymore available within ckeditor_basic.js, which are now provided by core/creators/themedui.js.


---

The `iconOffset` property, used in button definitions, must now point to the
exact offset position of the image in the icon file, instead of its logical order.

For example, in v3 its value could be set to "2". Now, in that same case,
it should be set to "-32" (2 x -16).

---

The default value for `CKEDITOR.config.toolbarCanCollapse` has been changed to "false".

---

The default value for `CKEDITOR.config.docType` is now `"<!DOCTYPE html>"`,
the HTML5 doctype.

---

Method `CKEDITOR.editor::getThemeSpace` has been moved to `CKEDITOR.editor::space`.

Event `CKEDITOR.editor#themeSpace` event has been replaced with "CKEDITOR.editor#uiSpace".

---

Method `CKEDITOR.htmlParser.fragment.fromHtml( fragmentHtml, fixForBody, /** @type {CKEDITOR.htmlParser.element}*/ contextNode )`
has changed signature to `CKEDITOR.htmlParser.fragment.fromHtml( fragmentHtml, /** @type {CKEDITOR.htmlParser.element|String}*/ parent, fixForBody )`.

---

In event `CKEDITOR.editor#paste`, `evt.data.html` and `evt.data.text` properties are not any more available.
They have been replaced by `evt.data.dataValue` and `evt.data.type` to help identify the data type.

---

`CKEDITOR.replaceByClassEnabled` option is not anymore available. Now it's enough
 to set `CKEDITOR.replaceClass` to empty/null to disable the auto-replace.

---

`CKEDITOR.dtd.$captionBlock` is now removed, to check if one element can be appear inside of table caption, use instead the dtd check:

 assert.isTrue( !!CKEDITOR.dtd.caption[ element.getName() ] );







