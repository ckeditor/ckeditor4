<?php
/*************************************************************************************
 * cssgen.php
 * ----------
 * Author: Nigel McNie (nigel@geshi.org)
 * Copyright: (c) 2004 Nigel McNie
 * Release Version: 1.0.8.6
 * Date Started: 2004/05/20
 *
 * Application to generate custom CSS files for GeSHi (based on an idea by Andreas
 * Gohr)
 *
 *************************************************************************************
 *
 *     This file is part of GeSHi.
 *
 *   GeSHi is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation; either version 2 of the License, or
 *   (at your option) any later version.
 *
 *   GeSHi is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with GeSHi; if not, write to the Free Software
 *   Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 *
 ************************************************************************************/

set_magic_quotes_runtime(0);
//
// Functions
//

function make_header ( $title )
{
    echo '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <title>GeSHi CSS Generator :: ' . $title . ' </title>
    <style type="text/css" media="screen">
    <!--
        html {
            font-family: Verdana, Arial, sans-serif;
            font-size: 80%;
            background-color: #d0d0d0;
        }
        body {
            margin: 10px;
            padding: 5px;
            border: 1px solid #f0f0f0;
            background-color: #f6f6f6;
        }
        h1 {
            border-bottom: 2px solid #e0e0e0;
            font-weight: normal;
            font-size: 150%;
            color: #c0c0c0;
        }
        input, textarea {
            border: 1px solid #d0d0d0;
        }
        th {
            text-align: right;
            font-weight: normal;
        }
        pre {
            font-size: 110%;
            color: #202020;
        }
        #footer {
            color: #b0b0b0;
            text-align: center;
            font-size: 90%;
            margin: 0 auto;
            border-top: 1px solid #e0e0e0;
        }
        #footer a {
            color: #c0c0c0;
        }
    -->
    </style>
    <script type="text/javascript">
    function select (state)
    {
        var cboxes = document.getElementsByTagName(\'input\');
        for (var i = 0; i < cboxes.length; i++) {
            if (cboxes[i].type == "checkbox") {
                if (state == "true") {
                    cboxes[i].checked = true;
                } elseif (state == "false") {
                    cboxes[i].checked = false;
                } elseif (state == "invert") {
                    cboxes[i].checked = !cboxes[i].checked;
                }
            }
        }
    }
    </script>
</head>
<body>
<h1>' . $title . '</h1>
';
}

function make_footer ()
{
    echo '<div id="footer"><a href="http://qbnz.com/highlighter/">GeSHi</a> &copy; Nigel McNie, 2004, released under the GPL</div></body>
</html>';
}


function get_var ( $var_name )
{
    if ( isset($_GET[$var_name]) )
    {
        return str_replace("\'", "'", $_GET[$var_name]);
    }
    elseif ( isset($_POST[$var_name]) )
    {
        return str_replace("\'", "'", $_POST[$var_name]);
    }
    return null;
}



//
// Unset everything
//
foreach ( $_REQUEST as $var )
{
    unset($$var);
}
foreach ( array(
    '_POST' => 'HTTP_POST_VARS',
    '_GET' => 'HTTP_GET_VARS',
    '_COOKIE' => 'HTTP_COOKIE_VARS',
    '_SERVER' => 'HTTP_SERVER_VARS',
    '_ENV' => 'HTTP_ENV_VARS',
    '_FILES' => 'HTTP_POST_FILES')  as $array => $other )
{
    if ( !isset($$array) )
    {
        $$array = $$other;
    }
    unset($$other);
}


// Get what step we're up to
$step = get_var('step');

if ( !$step || $step == 1 )
{
    $errors = 0;
    make_header('Step 1');
    echo "Welcome to the GeSHi CSS generator.<br /><pre>Searching for GeSHi...          ";

    // Find GeSHi
    $geshi_path = get_var('geshi-path');
    $geshi_lang_path = get_var('geshi-lang-path');

    if(strstr($geshi_path, '..')) {
        unset($geshi_path);
    }
    if(strstr($geshi_lang_path, '..')) {
        unset($geshi_lang_path);
    }

    if ( !$geshi_path )
    {
        $geshi_path = '../geshi.php';
    }
    if ( !$geshi_lang_path )
    {
        $geshi_lang_path = '../geshi/';
    }

    if ( is_file($geshi_path) && is_readable($geshi_path) )
    {
        // Get file contents and see if GeSHi is in here
        $file = @file($geshi_path);
        $contents = '';
        foreach ( $file as $line )
        {
            $contents .= $line;
        }
        if ( strpos($contents, '<?php
/**
 * GeSHi - Generic Syntax Highlighter') !== false )
         {
            echo '<span style="color: green;">Found at ' . realpath($geshi_path) . '</span>';
        }
        else
        {
            ++$errors;
            $no_geshi_dot_php_error = true;
            echo '<span style="color: red;">Not found</span>';
        }
    }
    else
    {
        ++$errors;
        $no_geshi_dot_php_error = true;
        echo '<span style="color: red;">Not found</span>';
    }

    // Find language files
    echo "\nSearching for language files... ";
    if ( is_readable($geshi_lang_path . 'css-gen.cfg') )
    {

        echo '<span style="color: green;">Found at ' . realpath($geshi_lang_path) . '</span>';
    }
    else
    {
        ++$errors;
        $no_lang_dir_error = true;
        echo '<span style="color: red;">Not found</span>';
    }
    echo "</pre>\n";

    if ( $errors > 0 )
    {
        // We're gonna have to ask for the paths...
        echo 'Unfortunately CSSGen could not detect the following paths. Please input them and press &quot;submit&quot; to try again.';
        echo "
<form action=\"cssgen.php\" method=\"post\">";
        if ( $no_geshi_dot_php_error )
        {
            echo "
<br />geshi.php: <input type=\"text\" name=\"geshi-path\" value=\"" . realpath('../geshi.php') . "\" size=\"50\" />";
        }
        else
        {
            echo '<input type="hidden" name="geshi-path" value="' . htmlspecialchars($geshi_path) . '" />';
        }
        if ( $no_lang_dir_error )
        {
            echo "
<br />language files directory: <input type=\"text\" name=\"geshi-lang-path\" value=\"" . realpath('../geshi/') . "/\" size=\"50\" /> (should have a trailing slash)";
        }
        else
        {
            echo '<input type="hidden" name="geshi-lang-path" value="' . $geshi_lang_path . '" />';
        }

        echo "
<br /><input type=\"submit\" value=\"Search\" /></form>";
    }
    else
    {
        // no errors - echo continue form
        echo 'Everything seems to be detected successfully. Use the button to continue.
<br /><br /><form action="cssgen.php?step=2" method="post">
<input type="hidden" name="geshi-path" value="' . realpath($geshi_path) . '" /><input type="hidden" name="geshi-lang-path" value="' . realpath($geshi_lang_path) . '" />
<input type="submit" value="Step 2" />';
    }

    make_footer();
}
// Step 2
elseif ( $step == 2 )
{
    make_header('Step 2');

    $geshi_path = get_var('geshi-path');
    $geshi_lang_path = get_var('geshi-lang-path');

    $dh = opendir($geshi_lang_path);
    $lang_files = array();
    $file = readdir($dh);
    while ( $file !== false )
    {
        if ( $file == '.' || $file == '..' || $file == 'CVS' || $file == 'css-gen.cfg' )
        {
            $file = readdir($dh);
            continue;
        }
        if(!strstr(file_get_contents($dh . DIRECTORY_SEPARATOR . $file), '$language_data')) {
            $file = readdir($dh);
            continue;
        }
        $lang_files[] = $file;
        $file = readdir($dh);
    }
    closedir($dh);
    sort($lang_files);

    // Now installed languages are in $lang_files

    echo '<form action="cssgen.php?step=3" method="post" id="step2">
What languages are you wanting to make this stylesheet for?<br /><br />
Detected languages:<br />';

    foreach ( $lang_files as $lang )
    {
        $lang = substr($lang, 0, strpos($lang, '.'));
        if ($lang) {
            echo "<input type=\"checkbox\" name=\"langs[$lang]\" checked=\"checked\" />&nbsp;$lang<br />\n";
        }
    }

    echo "Select: <a href=\"javascript:select('true')\">All</a>, <a href=\"javascript:select('false')\">None</a>, <a href=\"javascript:select('invert')\">Invert</a><br />\n";

    echo 'If you\'d like any other languages not detected here to be supported, please enter
them here, one per line:<br /><textarea rows="4" cols="20" name="extra-langs"></textarea><br />
';

    echo '<br />Styles:
<table>
    <tr><th>Style for the overall code block:</th><td><input type="text" name="overall" value="border: 1px dotted #a0a0a0; font-family: \'Courier New\', Courier, monospace; background-color: #f0f0f0; color: #0000bb;" /></td></tr>
    <tr><th>Default Styles</th><td><input type="text" name="default-styles" value="font-weight:normal;background:transparent;color:#000; padding-left: 5px;" /></td></tr>
    <tr><th>Keywords I (if, do, while etc)</th><td><input type="text" name="keywords-1" value="color: #a1a100;" /></td></tr>
    <tr><th>Keywords II (null, true, false etc)</th><td><input type="text" name="keywords-2" value="color: #000; font-weight: bold;" /></td></tr>
    <tr><th>Inbuilt Functions (echo, print etc)</th><td><input type="text" name="keywords-3" value="color: #000066;" /></td></tr>
    <tr><th>Data Types (int, boolean etc)</th><td><input type="text" name="keywords-4" value="color: #f63333;" /></td></tr>

    <tr><th>Comments (//, <!--  --> etc)</th><td><input type="text" name="comments" value="color: #808080;" /></td></tr>
    <tr><th>Escaped Characters (\n, \t etc)</th><td><input type="text" name="escaped-chars" value="color: #000033; font-weight: bold;" /></td></tr>
    <tr><th>Brackets ( ([{}]) etc)</th><td><input type="text" name="brackets" value="color: #66cc66;" /></td></tr>
    <tr><th>Strings ("foo" etc)</th><td><input type="text" name="strings" value="color: #ff0000;" /></td></tr>
    <tr><th>Numbers (1, -54, 2.5 etc)</th><td><input type="text" name="numbers" value="color: #ff33ff;" /></td></tr>
    <tr><th>Methods (Foo.bar() etc)</th><td><input type="text" name="methods" value="color: #006600;" /></td></tr>
</table>';

    echo '<input type="hidden" name="geshi-path" value="' . realpath($geshi_path) . '" /><input type="hidden" name="geshi-lang-path" value="' . realpath($geshi_lang_path) . '" />
<input type="submit" value="Step 3" /></form>';

    make_footer();
}
// Step 3
elseif ( $step == 3 )
{
    make_header('Step 3');
    echo '<p>Here is your completed stylesheet. Note that it may not be perfect - no regular expression styles are included for one thing,
you\'ll have to add those yourself (php and xml are just two languages that use them), and line numbers are not included, however
it includes most of the basic information.</p>';

    // Make the stylesheet
    $part_selector_1 = '';
    $part_selector_2 = '';
    $part_selector_3 = '';

    $langs = get_var('langs');
    $extra_langs = trim(get_var('extra-langs'));
    if ( $extra_langs != '' )
    {
        $l = explode("\r\n", $extra_langs);
        foreach ( $l as $lng )
        {
            $langs[$lng] = true;
        }
    }


    foreach ( $langs as $lang => $dummy )
    {
        $part_selector_1 .= ".$lang {PART}, ";
        $part_selector_2 .= ".$lang {PART1}, .$lang {PART2}, ";
        $part_selector_3 .= ".$lang {PART1}, .$lang {PART2}, .$lang {PART3}, ";
    }
    $part_selector_1 = substr($part_selector_1, 0, -2);
    $part_selector_2 = substr($part_selector_2, 0, -2);
    $part_selector_3 = substr($part_selector_3, 0, -2);


    $default_styles = get_var('default-styles');
    $ol_selector = str_replace('{PART}', 'ol', $part_selector_1);
    $overall_styles = get_var('overall');
    $overall_selector = str_replace('{PART}', '', $part_selector_1);

    $stylesheet = "/* GeSHi (c) Nigel McNie 2004 (http://qbnz.com/highlighter) */";

    if ( $overall != '' )
    {
        $stylesheet .= "\n$overall_selector {{$overall_styles}}";
    }
    if ( $default_styles != '' )
    {
        $default_selector = str_replace(array('{PART1}', '{PART2}'), array('.de1', '.de2'), $part_selector_2);
        $stylesheet .= "\n$default_selector {{$default_styles}}";
    }

    // Do keywords
    $keywords_1 = get_var('keywords-1');
    $keyword_selector_1 = str_replace('{PART}', '.kw1', $part_selector_1);
    if ( $keywords_1 != '' )
    {
        $stylesheet .= "\n$keyword_selector_1 {{$keywords_1}}";
    }

    $keywords_2 = get_var('keywords-2');
    $keyword_selector_2 = str_replace('{PART}', '.kw2', $part_selector_1);
    if ( $keywords_2 != '' )
    {
        $stylesheet .= "\n$keyword_selector_2 {{$keywords_2}}";
    }

    $keywords_3 = get_var('keywords-3');
    $keyword_selector_3 = str_replace('{PART}', '.kw3', $part_selector_1);
    if ( $keywords_3 != '' )
    {
        $stylesheet .= "\n$keyword_selector_3 {{$keywords_3}}";
    }

    $keywords_4 = get_var('keywords-4');
    $keyword_selector_4 = str_replace('{PART}', '.kw4', $part_selector_1);
    if ( $keywords_4 != '' )
    {
        $stylesheet .= "\n$keyword_selector_4 {{$keywords_4}}";
    }

    // Do other lexics
    $comments = get_var('comments');
    $comment_selector = str_replace(array('{PART1}', '{PART2}', '{PART3}'), array('.co1', '.co2', '.coMULTI'), $part_selector_3);
    if ( $comments != '' )
    {
        $stylesheet .= "\n$comment_selector {{$comments}}";
    }

    $esc = get_var('escaped-chars');
    $esc_selector = str_replace('{PART}', '.es0', $part_selector_1);
    if ( $esc != '' )
    {
        $stylesheet .= "\n$esc_selector {{$esc}}";
    }

    $brackets = get_var('brackets');
    $brk_selector = str_replace('{PART}', '.br0', $part_selector_1);
    if ( $brackets != '' )
    {
        $stylesheet .= "\n$brk_selector {{$brackets}}";
    }

    $strings = get_var('strings');
    $string_selector = str_replace('{PART}', '.st0', $part_selector_1);
    if ( $strings != '' )
    {
        $stylesheet .= "\n$string_selector {{$strings}}";
    }

    $numbers = get_var('numbers');
    $num_selector = str_replace('{PART}', '.nu0', $part_selector_1);
    if ( $numbers != '' )
    {
        $stylesheet .= "\n$num_selector {{$numbers}}";
    }

    $methods = get_var('methods');
    $method_selector = str_replace('{PART}', '.me0', $part_selector_1);
    if ( $methods != '' )
    {
        $stylesheet .= "\n$method_selector {{$methods}}";
    }

    echo "<pre>$stylesheet</pre>";

    make_footer();
}

?>
