<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
-->
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Sample - CKEditor</title>
	<meta content="text/html; charset=utf-8" http-equiv="content-type"/>
	<link href="../sample.css" rel="stylesheet" type="text/css"/>
</head>
<body>
	<h1>
		CKEditor Sample
	</h1>
	<!-- This <div> holds alert messages to be display in the sample page. -->
	<div id="alerts">
		<noscript>
			<p>
				<strong>CKEditor requires JavaScript to run</strong>. In a browser with no JavaScript
				support, like yours, you should still see the contents (HTML data) and you should
				be able to edit it normally, without a rich editor interface.
			</p>
		</noscript>
	</div>
	<!-- This <fieldset> holds the HTML that you will usually find in your pages. -->
	<fieldset title="Output">
		<legend>Output</legend>
		<form action="../sample_posteddata.php" method="post">
			<p>
				<label>Editor 1:</label><br/>
			</p>
<?php

/**
 * Adds global event, will hide "Target" tab in Link dialog in all instances.
 */
function CKEditorHideLinkTargetTab(&$CKEditor) {

	$function = 'function (ev) {
		// Take the dialog name and its definition from the event data
		var dialogName = ev.data.name;
		var dialogDefinition = ev.data.definition;

		// Check if the definition is from the Link dialog.
		if ( dialogName == "link" )
			dialogDefinition.removeContents("target")
	}';

	$CKEditor->addGlobalEventHandler('dialogDefinition', $function);
}

/**
 * Adds global event, will notify about opened dialog.
 */
function CKEditorNotifyAboutOpenedDialog(&$CKEditor) {
	$function = 'function (evt) {
		alert("Loading dialog: " + evt.data.name);
	}';

	$CKEditor->addGlobalEventHandler('dialogDefinition', $function);
}

// Include CKEditor class.
include("../../ckeditor.php");

// Create class instance.
$CKEditor = new CKEditor();

// Set configuration option for all editors.
$CKEditor->config['width'] = 750;

// Path to CKEditor directory, ideally instead of relative dir, use an absolute path:
//   $CKEditor->basePath = '/ckeditor/'
// If not set, CKEditor will try to detect the correct path.
$CKEditor->basePath = '../../';

// The initial value to be displayed in the editor.
$initialValue = '<p>This is some <strong>sample text</strong>. You are using <a href="http://ckeditor.com/">CKEditor</a>.</p>';

// Event that will be handled only by the first editor.
$CKEditor->addEventHandler('instanceReady', 'function (evt) {
	alert("Loaded editor: " + evt.editor.name);
}');

// Create first instance.
$CKEditor->editor("editor1", $initialValue);

// Clear event handlers, instances that will be created later will not have
// the 'instanceReady' listener defined a couple of lines above.
$CKEditor->clearEventHandlers();
?>
			<p>
				<label>Editor 2:</label><br/>
			</p>
<?php
// Configuration that will be used only by the second editor.
$config['width'] = '600';
$config['toolbar'] = 'Basic';

// Add some global event handlers (for all editors).
CKEditorHideLinkTargetTab($CKEditor);
CKEditorNotifyAboutOpenedDialog($CKEditor);

// Event that will be handled only by the second editor.
// Instead of calling addEventHandler(), events may be passed as an argument.
$events['instanceReady'] = 'function (evt) {
	alert("Loaded second editor: " + evt.editor.name);
}';

// Create second instance.
$CKEditor->editor("editor2", $initialValue, $config, $events);
?>
				<input type="submit" value="Submit"/>
			</p>
		</form>
	</fieldset>
	<div id="footer">
		<hr />
		<p>
			CKEditor - The text editor for Internet - <a href="http://ckeditor.com/">http://ckeditor.com</a>
		</p>
		<p id="copy">
			Copyright &copy; 2003-2010, <a href="http://cksource.com/">CKSource</a> - Frederico
			Knabben. All rights reserved.
		</p>
	</div>
</body>
</html>
