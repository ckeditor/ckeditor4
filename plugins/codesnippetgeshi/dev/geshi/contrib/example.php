<?php
/**
 * GeSHi example script
 *
 * Just point your browser at this script (with geshi.php in the parent directory,
 * and the language files in subdirectory "../geshi/")
 *
 * @author  Nigel McNie
 * @version $Id: example.php 2510 2012-06-27 15:57:55Z reedy_boy $
 */
header('Content-Type: text/html; charset=utf-8');

error_reporting(E_ALL);

// Rudimentary checking of where GeSHi is. In a default install it will be in ../, but
// it could be in the current directory if the include_path is set. There's nowhere else
// we can reasonably guess.
if (is_readable('../geshi.php')) {
    $path = '../';
} elseif (is_readable('geshi.php')) {
    $path = './';
} else {
    die('Could not find geshi.php - make sure it is in your include path!');
}
require $path . 'geshi.php';

$fill_source = false;
if (isset($_POST['submit'])) {
    if (get_magic_quotes_gpc()) {
        $_POST['source'] = stripslashes($_POST['source']);
    }
    if (!strlen(trim($_POST['source']))) {
        $_POST['language'] = preg_replace('#[^a-zA-Z0-9\-_]#', '', $_POST['language']);
        $_POST['source'] = implode('', @file($path . 'geshi/' . $_POST['language'] . '.php'));
        $_POST['language'] = 'php';
    } else {
        $fill_source = true;
    }

    // Here's a free demo of how GeSHi works.

    // First the initialisation: source code to highlight and the language to use. Make sure
    // you sanitise correctly if you use $_POST of course - this very script has had a security
    // advisory against it in the past because of this. Please try not to use this script on a
    // live site.
    $geshi = new GeSHi($_POST['source'], $_POST['language']);

    // Use the PRE_VALID header. This means less output source since we don't have to output &nbsp;
    // everywhere. Of course it also means you can't set the tab width.
    // HEADER_PRE_VALID puts the <pre> tag inside the list items (<li>) thus producing valid HTML markup.
    // HEADER_PRE puts the <pre> tag around the list (<ol>) which is invalid in HTML 4 and XHTML 1
    // HEADER_DIV puts a <div> tag arount the list (valid!) but needs to replace whitespaces with &nbsp
    //            thus producing much larger overhead. You can set the tab width though.
    $geshi->set_header_type(GESHI_HEADER_PRE_VALID);

    // Enable CSS classes. You can use get_stylesheet() to output a stylesheet for your code. Using
    // CSS classes results in much less output source.
    $geshi->enable_classes();

    // Enable line numbers. We want fancy line numbers, and we want every 5th line number to be fancy
    $geshi->enable_line_numbers(GESHI_FANCY_LINE_NUMBERS, 5);

    // Set the style for the PRE around the code. The line numbers are contained within this box (not
    // XHTML compliant btw, but if you are liberally minded about these things then you'll appreciate
    // the reduced source output).
    $geshi->set_overall_style('font: normal normal 90% monospace; color: #000066; border: 1px solid #d0d0d0; background-color: #f0f0f0;', false);

    // Set the style for line numbers. In order to get style for line numbers working, the <li> element
    // is being styled. This means that the code on the line will also be styled, and most of the time
    // you don't want this. So the set_code_style reverts styles for the line (by using a <div> on the line).
    // So the source output looks like this:
    //
    // <pre style="[set_overall_style styles]"><ol>
    // <li style="[set_line_style styles]"><div style="[set_code_style styles]>...</div></li>
    // ...
    // </ol></pre>
    $geshi->set_line_style('color: #003030;', 'font-weight: bold; color: #006060;', true);
    $geshi->set_code_style('color: #000020;', true);

    // Styles for hyperlinks in the code. GESHI_LINK for default styles, GESHI_HOVER for hover style etc...
    // note that classes must be enabled for this to work.
    $geshi->set_link_styles(GESHI_LINK, 'color: #000060;');
    $geshi->set_link_styles(GESHI_HOVER, 'background-color: #f0f000;');

    // Use the header/footer functionality. This puts a div with content within the PRE element, so it is
    // affected by the styles set by set_overall_style. So if the PRE has a border then the header/footer will
    // appear inside it.
    $geshi->set_header_content('<SPEED> <TIME> GeSHi &copy; 2004-2007, Nigel McNie, 2007-2008 Benny Baumann. View source of example.php for example of using GeSHi');
    $geshi->set_header_content_style('font-family: sans-serif; color: #808080; font-size: 70%; font-weight: bold; background-color: #f0f0ff; border-bottom: 1px solid #d0d0d0; padding: 2px;');

    // You can use <TIME> and <VERSION> as placeholders
    $geshi->set_footer_content('Parsed in <TIME> seconds at <SPEED>, using GeSHi <VERSION>');
    $geshi->set_footer_content_style('font-family: sans-serif; color: #808080; font-size: 70%; font-weight: bold; background-color: #f0f0ff; border-top: 1px solid #d0d0d0; padding: 2px;');
} else {
    // make sure we don't preselect any language
    $_POST['language'] = null;
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <title>GeSHi examples</title>
    <style type="text/css">
    <!--
    <?php
    if (isset($_POST['submit'])) {
        // Output the stylesheet. Note it doesn't output the <style> tag
        echo $geshi->get_stylesheet(true);
    }
    ?>
    html {
        background-color: #f0f0f0;
    }
    body {
        font-family: Verdana, Arial, sans-serif;
        margin: 10px;
        border: 2px solid #e0e0e0;
        background-color: #fcfcfc;
        padding: 5px;
    }
    h2 {
        margin: .1em 0 .2em .5em;
        border-bottom: 1px solid #b0b0b0;
        color: #b0b0b0;
        font-weight: normal;
        font-size: 150%;
    }
    h3 {
        margin: .1em 0 .2em .5em;
        color: #b0b0b0;
        font-weight: normal;
        font-size: 120%;
    }
    #footer {
        text-align: center;
        font-size: 80%;
        color: #a9a9a9;
    }
    #footer a {
        color: #9999ff;
    }
    textarea {
        border: 1px solid #b0b0b0;
        font-size: 90%;
        color: #333;
        margin-left: 20px;
    }
    select, input {
        margin-left: 20px;
    }
    p {
        font-size: 90%;
        margin-left: .5em;
    }
    -->
    </style>
</head>
<body>
<h2>GeSHi Example Script</h2>
<p>To use this script, make sure that <strong>geshi.php</strong> is in the parent directory or in your
include_path, and that the language files are in a subdirectory of GeSHi's directory called <strong>geshi/</strong>.</p>
<p>Enter your source and a language to highlight the source in and submit, or just choose a language to
have that language file highlighted in PHP.</p>
<?php
if (isset($_POST['submit'])) {
    // The fun part :)
    echo $geshi->parse_code();
    echo '<hr />';
}
?>
<form action="<?php echo basename($_SERVER['PHP_SELF']); ?>" method="post">
<h3>Source to highlight</h3>
<p>
<textarea rows="10" cols="60" name="source" id="source"><?php echo $fill_source ? htmlspecialchars($_POST['source']) : '' ?></textarea>
</p>
<h3>Choose a language</h3>
<p>
<select name="language" id="language">
<?php
if (!($dir = @opendir(dirname(__FILE__) . '/geshi'))) {
    if (!($dir = @opendir(dirname(__FILE__) . '/../geshi'))) {
        echo '<option>No languages available!</option>';
    }
}
$languages = array();
while ($file = readdir($dir)) {
    if ( $file[0] == '.' || strpos($file, '.', 1) === false) {
        continue;
    }
    $lang = substr($file, 0,  strpos($file, '.'));
    $languages[] = $lang;
}
closedir($dir);
sort($languages);
foreach ($languages as $lang) {
    if (isset($_POST['language']) && $_POST['language'] == $lang) {
        $selected = 'selected="selected"';
    } else {
        $selected = '';
    }
    echo '<option value="' . $lang . '" '. $selected .'>' . $lang . "</option>\n";
}

?>
</select>
</p>
<p>
<input type="submit" name="submit" value="Highlight Source" />
<input type="submit" name="clear" onclick="document.getElementById('source').value='';document.getElementById('language').value='';return false" value="clear" />
</p>
</form>
<div id="footer">GeSHi &copy; Nigel McNie, 2004, released under the GNU GPL<br />
For a better demonstration, check out the <a href="http://qbnz.com/highlighter/demo.php">online demo</a>
</div>
</body>
</html>
