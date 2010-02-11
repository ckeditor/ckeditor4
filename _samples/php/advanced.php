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
// Include CKEditor class.
include("../../ckeditor.php");

// Create class instance.
$CKEditor = new CKEditor();

// Do not print the code directly to the browser, return it instead
$CKEditor->returnOutput = true;

// Path to CKEditor directory, ideally instead of relative dir, use an absolute path:
//   $CKEditor->basePath = '/ckeditor/'
// If not set, CKEditor will try to detect the correct path.
$CKEditor->basePath = '../../';

// Set global configuration (will be used by all instances of CKEditor).
$CKEditor->config['width'] = 600;

// Change default textarea attributes
$CKEditor->textareaAttributes = array("cols" => 80, "rows" => 10);

// The initial value to be displayed in the editor.
$initialValue = '<p>This is some <strong>sample text</strong>. You are using <a href="http://ckeditor.com/">CKEditor</a>.</p>';

// Create first instance.
$code = $CKEditor->editor("editor1", $initialValue);

echo $code;
?>
			<p>
				<label>Editor 2:</label><br/>
			</p>
<?php
// Configuration that will be used only by the second editor.
$config['toolbar'] = array(
	array( 'Source', '-', 'Bold', 'Italic', 'Underline', 'Strike' ),
	array( 'Image', 'Link', 'Unlink', 'Anchor' )
);

$config['skin'] = 'v2';

// Create second instance.
echo $CKEditor->editor("editor2", $initialValue, $config);
?>
			<p>
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
