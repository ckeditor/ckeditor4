<?php
/**
 * GeSHi example script
 *
 * Just point your browser at this script (with geshi.php in the parent directory,
 * and the language files in subdirectory "../geshi/")
 *
 *This script
 *
 * @author  Nigel McNie, Benny Baumann (BenBE@geshi.org), Andreas 'Segaja' Schleifer (webmaster at segaja dot de)
 * @version $Id: langwiz.php 2510 2012-06-27 15:57:55Z reedy_boy $
 */
header('Content-Type: text/html; charset=utf-8');

set_time_limit(0);
error_reporting(E_ALL);
$time_start = explode(' ', microtime());

//Handle crappy PHP magic:
if (get_magic_quotes_gpc()) {
    function stripslashes_deep($value) {
        $value = is_array($value) ?
                    array_map('stripslashes_deep', $value) :
                    stripslashes($value);

        return $value;
    }

    $_POST = array_map('stripslashes_deep', $_POST);
    $_GET = array_map('stripslashes_deep', $_GET);
    $_COOKIE = array_map('stripslashes_deep', $_COOKIE);
    $_REQUEST = array_map('stripslashes_deep', $_REQUEST);
}

function htmlspecialchars_deep($value) {
    return is_array($value) ? array_map('htmlspecialchars_deep', $value) : htmlspecialchars($value);
}

define ('TYPE_NOTICE', 0);
define ('TYPE_WARNING', 1);
define ('TYPE_ERROR', 2);

$error_abort = false;
$error_cache = array();
function output_error_cache(){
    global $error_cache, $error_abort;

    if(count($error_cache)) {
        echo "<span style=\"color: #F00; font-weight: bold;\">Failed</span><br />";
        echo "<ol>\n";
        foreach($error_cache as $error_msg) {
            echo "<li>";
            switch($error_msg['t']) {
                case TYPE_NOTICE:
                    echo "<span style=\"color: #080; font-weight: bold;\">NOTICE:</span>";
                    break;
                case TYPE_WARNING:
                    echo "<span style=\"color: #CC0; font-weight: bold;\">WARNING:</span>";
                    break;
                case TYPE_ERROR:
                    echo "<span style=\"color: #F00; font-weight: bold;\">ERROR:</span>";
                    break;
            }
            echo " " . $error_msg['m'] . "</li>";
        }
        echo "</ol>\n";
    } else {
        echo "<span style=\"color: #080; font-weight: bold;\">OK</span><br />";
    }
    echo "\n";

    $error_cache = array();
}

function report_error($type, $message) {
    global $error_cache, $error_abort;

    $error_cache[] = array('t' => $type, 'm' => $message);
    if(TYPE_ERROR == $type) {
        $error_abort = true;
    }
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <title>GeSHi Language File Generator Script</title>
    <style type="text/css">
    <!--
    html {
        background-color: #f0f0f0;
    }
    body {
        font-family: Verdana, Arial, sans-serif;
        margin: 10px;
        border: 2px solid #e0e0e0;
        background-color: #fcfcfc;
        padding: 5px;
        font-size: 10pt;
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
        margin-left: 2px;
        border: 1px solid #808080;
    }
    p {
        font-size: 90%;
        margin-left: .5em;
    }
    fieldset {
        border: 1px dotted gray;
        background-color: #f0f0f0;
        margin-bottom: .5em;
    }
    legend {
        font-weight: bold;
        background-color: #f9f9f9;
        border: 1px solid #a0a0a0;
        border-width: 1px 2px 2px 1px;
    }
    fieldset table > tbody > tr > td {
        width: 20%;
    }
    fieldset table > tbody > tr > td+td {
        width: 80%;
    }

    fieldset table > tbody > tr > td+td > input {
        width: 98%;
    }
    -->
    </style>
</head>
<body>
<h2>GeSHi Language File Generator Script</h2>
<p>To use this script, make sure that <strong>geshi.php</strong> is in the
parent directory or in your include_path, and that the language files are in a
subdirectory of GeSHi's directory called <strong>geshi/</strong>.</p>
<p>If not already done, select a language file below that will be used as
base for the language file to generate or create a blank one. Following this
you can do whatever you like to edit your language file. But note that not all
features are made available through this script.</p>

<p>Checking GeSHi installation ... <?php
// Rudimentary checking of where GeSHi is. In a default install it will be in ../, but
// it could be in the current directory if the include_path is set. There's nowhere else
// we can reasonably guess.
if (is_readable('../geshi.php')) {
    $path = '../';
} elseif (is_readable('geshi.php')) {
    $path = './';
} else {
    report_error(TYPE_ERROR, 'Could not find geshi.php - make sure it is in your include path!');
}

if(!$error_abort) {
    require $path . 'geshi.php';

    if(!class_exists('GeSHi')) {
        report_error(TYPE_ERROR, 'The GeSHi class was not found, although it seemed we loaded the correct file!');
    }
}

if(!$error_abort) {
    if(!defined('GESHI_LANG_ROOT')) {
        report_error(TYPE_ERROR, 'There\'s no information present on where to find the language files!');
    } elseif(!is_dir(GESHI_LANG_ROOT)) {
        report_error(TYPE_ERROR, 'The path "'.GESHI_LANG_ROOT.'" given, does not ressemble a directory!');
    } elseif(!is_readable(GESHI_LANG_ROOT)) {
        report_error(TYPE_ERROR, 'The path "'.GESHI_LANG_ROOT.'" is not readable to this script!');
    }
}

if(!$error_abort) {
    if (!($dir = @opendir(GESHI_LANG_ROOT))) {
        report_error(TYPE_ERROR, 'Error requesting listing for available language files!');
    }

    $languages = array();

    if(!$error_abort) {
        while ($file = readdir($dir)) {
            if (!$file || $file[0] == '.' || strpos($file, '.') === false) {
                continue;
            }
            $lang = substr($file, 0,  strpos($file, '.'));
            $languages[] = $lang;
        }
        closedir($dir);
    }

    $languages = array_unique($languages);
    sort($languages);

    if(!count($languages)) {
        report_error(TYPE_WARNING, 'Unable to locate any usable language files in "'.GESHI_LANG_ROOT.'"!');
    }
}

output_error_cache();

// --- empty variables for values of $_POST - begin ---
$post_var_names = array('li', 'ai', 'ld');

$li = array(
    'file' => 'example',
    'name' => 'Example'
    );

$ai = array(
    'name' => 'Benny Baumann',
    'email' => 'BenBE@geshi.org',
    'web' => 'http://qbnz.com/highlighter/'
    );

$ld = array(
    'cmt' => array(
        'sl' => array(
            1 => array(
                'start' => '//',
                'style' => 'font-style: italic; color: #666666;'
                ),
            2 => array(
                'start' => '#',
                'style' => 'font-style: italic; color: #666666;'
                )
            ),
        'ml' => array(
            1 => array(
                'start' => '/*',
                'end' => '*/',
                'style' => 'font-style: italic; color: #666666;'
                ),
            2 => array(
                'start' => '/**',
                'end' => '*/',
                'style' => 'font-style: italic; color: #006600;'
                )
            ),
        'rxc' => array(
            1 => array(
                'rx' => '/Hello RegExp/',
                'style' => 'font-style: italic; color: #666666;'
                )
            )
        ),
    'str' => array(
        'qm' => array(
            1 => array(
                'delim' => "'",
                'style' => 'color: #0000FF;'
                ),
            2 => array(
              'delim' => "&quot;",
                'style' => 'color: #0000FF;'
                )
            ),
        'ec' => array(
            'char' => '\\',
            'style' => 'font-weight: bold; color: #000080;'
            ),
        'erx' => array(
            1 => array(
                'rx' => '/\{\\\\$\w+\}/',
                'style' => 'font-weight: bold; color: #008080;'
                ),
            2 => array(
                'rx'=> '/\{\\\\$\w+\}/',
                'style' => 'font-weight: bold; color: #008080;'
                )
            )
        ),
    'kw_case' => 'GESHI_CAPS_NO_CHANGE',
    'kw' => array(
        1 => array(
            'list' => '',
            'case' => '0',
            'style' => 'color: #0000FF; font-weight: bold;',
            'docs' => ''
            )
        ),
    'sy' => array(
        0 => array(
            'list' => '',
            'style' => 'color: #0000FF; font-weight: bold;'
            )
        )
    );

$kw_case_sel = array(
    'GESHI_CAPS_NO_CHANGE' => '',
    'GESHI_CAPS_UPPER' => '',
    'GESHI_CAPS_LOWER' => ''
    );

$kw_cases_sel = array(
    1 => array(
        0 => '',
        1 => ''
        )
    );
// --- empty variables for values of $_POST - end ---

echo "<pre>";
//var_dump($languages);

foreach($post_var_names as $varName) { // export wanted variables of $_POST array...
    if(array_key_exists($varName, $_POST)) {
      $$varName = htmlspecialchars_deep($_POST[$varName]);
    }
}

// determine the selected kw_case...
$kw_case_sel[$ld['kw_case']] = ' selected="selected"';

// determine the selected kw_cases...
for($i = 1; $i <= count($kw_cases_sel); $i += 1) {
    $kw_cases_sel[$i][(int) $ld['kw'][$i]['case']] = ' selected="selected"';
}

$lang = validate_lang();
var_dump($lang);
echo "</pre>";

?>

<form action="?action=test" method="post">
    <fieldset>
        <legend>Generic Information</legend>

        <table width="100%">
            <tr>
                <td>
                    <label for="li[file]">Language File ID:</label>
                </td>
                <td>
                    <input type="text" name="li[file]" id="li[file]" value="<?=$li['file']; ?>" />
                </td>
            </tr>

            <tr>
                <td>
                    <label for="li[name]">Language Name:</label>
                </td>
                <td>
                    <input type="text" name="li[name]" id="li[name]" value="<?=$li['name']; ?>" />
                </td>
            </tr>

        </table>
    </fieldset>

    <fieldset>
        <legend>Author</legend>

        <table width="100%">
            <tr>
                <td>
                    <label for="ai[name]">Full Name:</label>
                </td>
                <td>
                    <input type="text" name="ai[name]" id="ai[name]" value="<?=$ai['name']; ?>" />
                </td>
            </tr>

            <tr>
                <td>
                    <label for="ai[email]">eMail address:</label>
                </td>
                <td>
                    <input type="text" name="ai[email]" id="ai[email]" value="<?=$ai['email']; ?>" />
                </td>
            </tr>

            <tr>
                <td>
                    <label for="ai[web]">Homepage:</label>
                </td>
                <td>
                    <input type="text" name="ai[web]" id="ai[web]" value="<?=$ai['web']; ?>" />
                </td>
            </tr>
        </table>
    </fieldset>

    <fieldset>
        <legend>Comments</legend>

        <fieldset>
            <legend>Single Line</legend>

            <fieldset>
                <legend>Comment Group 1</legend>

                <table width="100%">
                    <tr>
                        <td>
                            <label for="ld[cmt][sl][1][start]">Comment Start:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[cmt][sl][1][start]" id="ld[cmt][sl][1][start]" value="<?=$ld['cmt']['sl'][1]['start']; ?>" />
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <label for="ld[cmt][sl][1][style]">Comment Style:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[cmt][sl][1][style]" id="ld[cmt][sl][1][style]" value="<?=$ld['cmt']['sl'][1]['style']; ?>" />
                        </td>
                    </tr>
                </table>
            </fieldset>

            <fieldset>
                <legend>Comment Group 2</legend>

                <table width="100%">
                    <tr>
                        <td>
                            <label for="ld[cmt][sl][2][start]">Comment Start:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[cmt][sl][2][start]" id="ld[cmt][sl][2][start]" value="<?=$ld['cmt']['sl'][2]['start']; ?>" />
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <label for="ld[cmt][sl][2][style]">Comment Style:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[cmt][sl][2][style]" id="ld[cmt][sl][2][style]" value="<?=$ld['cmt']['sl'][2]['style']; ?>" />
                        </td>
                    </tr>
                </table>
            </fieldset>
        </fieldset>

        <fieldset>
            <legend>Multiple Lines</legend>

            <fieldset>
                <legend>Comment Group 1</legend>

                <table width="100%">
                    <tr>
                        <td>
                            <label for="ld[cmt][ml][1][start]">Comment Start:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[cmt][ml][1][start]" id="ld[cmt][ml][1][start]" value="<?=$ld['cmt']['ml'][1]['start']; ?>" />
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <label for="ld[cmt][ml][1][end]">Comment End:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[cmt][ml][1][end]" id="ld[cmt][ml][1][end]" value="<?=$ld['cmt']['ml'][1]['end']; ?>" />
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <label for="ld[cmt][ml][1][style]">Comment Style:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[cmt][ml][1][style]" id="ld[cmt][ml][1][style]" value="<?=$ld['cmt']['ml'][1]['style']; ?>" />
                        </td>
                    </tr>
                </table>
            </fieldset>

            <fieldset>
                <legend>Comment Group 2</legend>

                <table width="100%">
                    <tr>
                        <td>
                            <label for="ld[cmt][ml][2][start]">Comment Start:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[cmt][ml][2][start]" id="ld[cmt][ml][2][start]" value="<?=$ld['cmt']['ml'][2]['start']; ?>" />
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <label for="ld[cmt][ml][2][end]">Comment End:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[cmt][ml][2][end]" id="ld[cmt][ml][2][end]" value="<?=$ld['cmt']['ml'][2]['end']; ?>" />
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <label for="ld[cmt][ml][2][style]">Comment Style:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[cmt][ml][2][style]" id="ld[cmt][ml][2][style]" value="<?=$ld['cmt']['ml'][2]['style']; ?>" />
                        </td>
                    </tr>
                </table>
            </fieldset>
        </fieldset>

        <fieldset>
            <legend>Regular Expressions</legend>

            <fieldset>
                <legend>Comment Group 1</legend>

                <table width="100%">
                    <tr>
                        <td>
                            <label for="ld[cmt][rxc][1][rx]">Comment RX:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[cmt][rxc][1][rx]" id="ld[cmt][rxc][1][rx]" value="<?=$ld['cmt']['rxc'][1]['rx']; ?>" />
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <label for="ld[cmt][rxc][1][style]">Comment Style:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[cmt][rxc][1][style]" id="ld[cmt][rxc][1][style]" value="<?=$ld['cmt']['rxc'][1]['style']; ?>" />
                        </td>
                    </tr>
                </table>
            </fieldset>
        </fieldset>
    </fieldset>

    <fieldset>
        <legend>Strings</legend>

        <fieldset>
            <legend>String \ Quotes (delimiters, parsed)</legend>

            <fieldset>
                <legend>Quotemark Group 1</legend>

                <table width="100%">
                    <tr>
                        <td>
                            <label for="ld[str][qm][1][delim]">String Delimiter:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[str][qm][1][delim]" id="ld[str][qm][1][delim]" value="<?=$ld['str']['qm'][1]['delim']; ?>" />
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <label for="ld[str][qm][1][style]">String Style:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[str][qm][1][style]" id="ld[str][qm][1][style]" value="<?=$ld['str']['qm'][1]['style']; ?>" />
                        </td>
                    </tr>
                </table>
            </fieldset>
            <fieldset>
                <legend>Quotemark Group 2</legend>

                <table width="100%">
                    <tr>
                        <td>
                            <label for="ld[str][qm][1][delim]">String Delimiter:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[str][qm][2][delim]" id="ld[str][qm][2][delim]" value="<?=$ld['str']['qm'][2]['delim']; ?>" />
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <label for="ld[str][qm][1][style]">String Style:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[str][qm][2][style]" id="ld[str][qm][2][style]" value="<?=$ld['str']['qm'][2]['style']; ?>" />
                        </td>
                    </tr>
                </table>
            </fieldset>


        </fieldset>

        <fieldset>
            <legend>Escape Sequences</legend>

            <fieldset>
                <legend>Generic Escape Char</legend>

                <table width="100%">
                    <tr>
                        <td>
                            <label for="ld[str][ec][char]">Escape Char:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[str][ec][char]" id="ld[str][ec][char]" value="<?=$ld['str']['ec']['char']; ?>" />
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <label for="ld[str][ec][style]">Escape Char Style:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[str][ec][style]" id="ld[str][ec][style]" value="<?=$ld['str']['ec']['style']; ?>" />
                        </td>
                    </tr>
                </table>
            </fieldset>

            <fieldset>
                <legend>Escape Regexp Group 1</legend>

                <table width="100%">
                    <tr>
                        <td>
                            <label for="ld[str][erx][1][rx]">Escape Regexp:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[str][erx][1][rx]" id="ld[str][erx][1][rx]" value="<?=$ld['str']['erx'][1]['rx']; ?>" />
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <label for="ld[str][erx][1][style]">Escape Style:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[str][erx][1][style]" id="ld[str][erx][1][style]" value="<?=$ld['str']['erx'][1]['style']; ?>" />
                        </td>
                    </tr>
                </table>
            </fieldset>

            <fieldset>
                <legend>Escape Regexp Group 2</legend>

                <table width="100%">
                    <tr>
                        <td>
                            <label for="ld[str][erx][2][rx]">Escape Regexp:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[str][erx][2][rx]" id="ld[str][erx][2][rx]" value="<?=$ld['str']['erx'][2]['rx']; ?>" />
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <label for="ld[str][erx][2][style]">Escape Style:</label>
                        </td>
                        <td>
                            <input type="text" name="ld[str][erx][2][style]" id="ld[str][erx][2][style]" value="<?=$ld['str']['erx'][2]['style']; ?>" />
                        </td>
                    </tr>
                </table>
            </fieldset>
        </fieldset>
    </fieldset>

    <fieldset>
        <legend>Keywords</legend>

        <fieldset>
            <legend>Case of Keywords</legend>

            <table width="100%">
                <tr>
                    <td>
                        <label for="ld[kw_case]">Handling of keywords case:</label>
                    </td>
                    <td>
                        <select name=ld[kw_case]" id="ld[kw_case]">
                            <option value="GESHI_CAPS_NO_CHANGE"<?=$kw_case_sel['GESHI_CAPS_NO_CHANGE']; ?>>Don’t change the case of any keyword</option>
                            <option value="GESHI_CAPS_UPPER"<?=$kw_case_sel['GESHI_CAPS_UPPER']; ?>>Convert the case of all keywords to upper case</option>
                            <option value="GESHI_CAPS_LOWER"<?=$kw_case_sel['GESHI_CAPS_LOWER']; ?>>Convert the case of all keywords to lower case</option>
                        </select>
                    </td>
                </tr>
            </table>
        </fieldset>

        <fieldset>
            <legend>Keyword Group 1</legend>

            <table width="100%">
                <tr>
                    <td>
                        <label for="ld[kw][1][list]">Keyword List:</label>
                    </td>
                    <td>
                      <textarea name="ld[kw][1][list]" id="ld[kw][1][list]" rows="10" cols="80"><?=$ld['kw'][1]['list']; ?></textarea>
                    </td>
                </tr>

                <tr>
                    <td>
                        <label for="ld[kw][1][case]">Case Sensitive:</label>
                    </td>
                    <td>
                        <select name="ld[kw][1][case]" id="ld[kw][1][case]">
                            <option value="0"<?=$kw_cases_sel[1][0]; ?>>No</option>
                            <option value="1"<?=$kw_cases_sel[1][1]; ?>>Yes</option>
                        </select>
                    </td>
                </tr>

                <tr>
                    <td>
                        <label for="ld[kw][1][style]">Keyword Style:</label>
                    </td>
                    <td>
                        <input type="text" name="ld[kw][1][style]" id="ld[kw][1][style]" value="<?=$ld['kw'][1]['style']; ?>" />
                    </td>
                </tr>

                <tr>
                    <td>
                        <label for="ld[kw][1][docs]">Documentation URL:</label>
                    </td>
                    <td>
                        <input type="text" name="ld[kw][1][docs]" id="ld[kw][1][docs]" value="<?=$ld['kw'][1]['docs']; ?>" />
                    </td>
                </tr>
            </table>
        </fieldset>

    </fieldset>


    <fieldset>
        <legend>Symbols</legend>

        <fieldset>
            <legend>Symbols Group 1</legend>

            <table width="100%">
                <tr>
                    <td>
                        <label for="ld[sy][0][list]">Symbols List:</label>
                    </td>
                    <td>
                      <textarea name="ld[sy][0][list]" id="ld[sy][0][list]" rows="10" cols="80"><?=$ld['sy'][0]['list']; ?></textarea>
                    </td>
                </tr>

                <tr>
                    <td>
                        <label for="ld[sy][0][style]">Symbols Style:</label>
                    </td>
                    <td>
                        <input type="text" name="ld[sy][0][style]" id="ld[sy][0][style]" value="<?=$ld['sy'][0]['style']; ?>" />
                    </td>
                </tr>
            </table>
        </fieldset>

    </fieldset>


    <div id="langfile">
        <fieldset>
        <legend>Language File Source</legend>
<?
$G = new GeSHi('', 'php');
$langfile_source = gen_langfile($lang);
$G->set_source($langfile_source);
echo $G->parse_code();
unset($G);
?>
        </fieldset>
    </div>

    <input type="submit" name="btn" value="Send!" />
</form>

<p>Operation completed in <?
$time_end = explode(' ', microtime());
$time_diff = $time_end[0] + $time_end[1] - $time_start[0] - $time_start[1];

echo sprintf("%.2f", $time_diff);
?> seconds.</p>

<div id="footer">GeSHi &copy; 2004-2007 Nigel McNie, 2007-2009 Benny Baumann, released under the GNU GPL</div>
</body>
</html>
<?

function str_to_phpstring($str, $doublequote = false){
    if($doublequote) {
        return '"' . strtr($str,
            array(
                "\"" => "\\\"",
                "\\" => "\\\\",
                "\0" => "\\0",
                "\n" => "\\n",
                "\r" => "\\r",
                "\t" => "\\t",
                "\$" => "\\\$"
                )
            ) . '"';
    } else {
        return "'" . strtr($str,
            array(
                "'" => "\\'",
                "\\" => "\\\\"
                )
            ) . "'";
    }
}

function validate_lang(){
    $ai = array(
        'name' => 'Benny Baumann',
        'email' => 'BenBE@geshi.org',
        'web' => 'http://qbnz.com/highlighter/'
        );

    $li = array(
        'file' => 'example',
        'desc' => 'Example'
        );

    if(isset($_POST['ld'])) {
        $ld = $_POST['ld'];
    } else {
        $ld = array(
            'cmt' => array(
                'sl' => array(
                    1 => array(
                        'start' => '//',
                        'style' => 'test'
                        )
                    ),
                'ml' => array(
                    1 => array(
                        'start' => '/*',
                        'end' => '*/',
                        'style' => 'font-style: italic; color: #666666;'
                        )
                    ),
                'rxc' => array(
                    1 => array(
                        'rx' => '/Hello/',
                        'style' => 'color: #00000'
                        )
                    )
                ),
            'str' => array(
                'qm' => array(),
                'ec' => array(
                    'char' => ''
                    ),
                'erx' => array()
                ),
            'kw' => array(),
            'kw_case' => 'GESHI_CAPS_NO_CHANGE',
            'sy' => array()
            );
        }

    return array('ai' => $ai, 'li' => $li, 'ld' => $ld);
}

function gen_langfile($lang){
    $langfile = $lang['li']['file'];
    $langdesc = $lang['li']['desc'];

    $langauthor_name = $lang['ai']['name'];
    $langauthor_email = $lang['ai']['email'];
    $langauthor_web = $lang['ai']['web'];

    $langversion = GESHI_VERSION;

    $langdate = date('Y/m/d');
    $langyear = date('Y');

    $i = '    ';
    $i = array('', $i, $i.$i, $i.$i.$i);

    $src = <<<GESHI_LANGFILE_HEAD
<?php
/*************************************************************************************
 * {$langfile}.php
 * --------
 * Author: {$langauthor_name} ({$langauthor_email})
 * Copyright: (c) {$langyear} {$langauthor_name} ({$langauthor_web})
 * Release Version: {$langversion}
 * Date Started: {$langdate}
 *
 * {$langdesc} language file for GeSHi.
 *
 * CHANGES
 * -------
 * {$langdate} ({$langversion})
 *  -  First Release
 *
 * TODO (updated {$langdate})
 * -------------------------
 * * Complete language file
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

\$language_data = array(

GESHI_LANGFILE_HEAD;

    //Language Name
    $src .= $i[1] . "'LANG_NAME' => ".str_to_phpstring($langdesc).",\n";

    //Comments
    $src .= $i[1] . "'COMMENT_SINGLE' => array(\n";
    foreach($lang['ld']['cmt']['sl'] as $idx_cmt_sl => $tmp_cmt_sl) {
        $src .= $i[2] . ((int)$idx_cmt_sl). " => ". str_to_phpstring($tmp_cmt_sl['start']) . ",\n";
    }
    $src .= $i[2] . "),\n";
    $src .= $i[1] . "'COMMENT_MULTI' => array(\n";
    foreach($lang['ld']['cmt']['ml'] as $tmp_cmt_ml) {
        $src .= $i[2] . str_to_phpstring($tmp_cmt_ml['start']). " => ". str_to_phpstring($tmp_cmt_ml['end']) . ",\n";
    }
    $src .= $i[2] . "),\n";
    $src .= $i[1] . "'COMMENT_REGEXP' => array(\n";
    foreach($lang['ld']['cmt']['rxc'] as $idx_cmt_rxc => $tmp_cmt_rxc) {
        $src .= $i[2] . ((int)$idx_cmt_rxc). " => ". str_to_phpstring($tmp_cmt_rxc['rx']) . ",\n";
    }
    $src .= $i[2] . "),\n";

    //Case Keywords
    $src .= $i[1] . "'CASE_KEYWORDS' => " . $lang['ld']['kw_case'] . ",\n";

    //Quotes \ Strings
    $src .= $i[1] . "'QUOTEMARKS' => array(\n";
    foreach($lang['ld']['str']['qm'] as $idx_str_qm => $tmp_str_qm) {
        $src .= $i[2] . ((int)$idx_str_qm). " => ". str_to_phpstring($tmp_str_qm['delim']) . ",\n";
    }
    $src .= $i[2] . "),\n";
    $src .= $i[1] . "'ESCAPE_CHAR' => " . str_to_phpstring($lang['ld']['str']['ec']['char']) . ",\n";
    $src .= $i[1] . "'ESCAPE_REGEXP' => array(\n";
    foreach($lang['ld']['str']['erx'] as $idx_str_erx => $tmp_str_erx) {
        $src .= $i[2] . ((int)$idx_str_erx). " => ". str_to_phpstring($tmp_str_erx['rx']) . ",\n";
    }
    $src .= $i[2] . "),\n";

    //HardQuotes
    $src .= $i[1] . "'HARDQUOTE' => array(\n";
    $src .= $i[2] . "),\n";
    $src .= $i[1] . "'HARDESCAPE' => array(\n";
    $src .= $i[2] . "),\n";
    $src .= $i[1] . "'HARDCHAR' => '',\n";

    //Numbers
    $src .= $i[1] . "'NUMBERS' =>\n";
    $src .= $i[2] . "GESHI_NUMBER_INT_BASIC | GESHI_NUMBER_OCT_PREFIX | GESHI_NUMBER_HEX_PREFIX |\n";
    $src .= $i[2] . "GESHI_NUMBER_FLT_SCI_ZERO,\n";

    //Keywords
    $src .= $i[1] . "'KEYWRODS' => array(\n";
    foreach($lang['ld']['kw'] as $idx_kw => $tmp_kw) {
        $src .= $i[2] . ((int)$idx_kw) . " => array(\n";
        if(!is_array($tmp_kw['list'])) {
            $tmp_kw['list'] = explode("\n", $tmp_kw['list']);
        }
        $tmp_kw['list'] = array_map('trim', $tmp_kw['list']);
        sort($tmp_kw['list']);
        $kw_esc = array_map('str_to_phpstring', $tmp_kw['list']);
        $kw_nl = true;
        $kw_pos = 0;
        foreach($kw_esc as $kw_data) {
            if((strlen($kw_data) + $kw_pos > 79) && $kw_pos > strlen($i[3])) {
                $src .= "\n";
                $kw_nl = true;
                $kw_pos = 0;
            }
            if($kw_nl) {
                $src .= $i[3];
                $kw_pos += strlen($i[3]);
                $kw_nl = false;
            }
            $src .= $kw_data . ', ';
            $kw_pos += strlen($kw_data) + 2;
        }
        $src .= "\n";
        $src .= $i[3] . "),\n";
    }
    $src .= $i[2] . "),\n";

    //Case Sensitivity
    $src .= $i[1] . "'CASE_SENSITIVE' => array(\n";
    foreach($lang['ld']['kw'] as $idx_kw => $tmp_kw) {
        $src .= $i[2] . ((int)$idx_kw) . " => " . ($tmp_kw['case'] ? 'true' : 'false') . ",\n";
    }
    $src .= $i[2] . "),\n";

    //Symbols
    $src .= $i[1] . "'SYMBOLS' => array(\n";
    foreach($lang['ld']['sy'] as $idx_kw => $tmp_kw) {
        $src .= $i[2] . ((int)$idx_kw) . " => array(\n";
        $tmp_kw['list'] = (array)$tmp_kw['list'];
        sort($tmp_kw['list']);
        $kw_esc = array_map('str_to_phpstring', $tmp_kw['list']);
        $kw_nl = true;
        $kw_pos = strlen($i[3]);
        foreach($kw_esc as $kw_data) {
            if((strlen($kw_data) + $kw_pos > 79) && $kw_pos > strlen($i[3])) {
                $src .= "\n";
                $kw_nl = true;
                $kw_pos = 0;
            }
            if($kw_nl) {
                $src .= $i[3];
                $kw_pos += strlen($i[3]);
                $kw_nl = false;
            }
            $src .= $kw_data . ', ';
            $kw_pos += strlen($kw_data) + 2;
        }
        $src .= "\n";
        $src .= $i[3] . "),\n";
    }
    $src .= $i[2] . "),\n";

    //Styles \ CSS
    $src .= $i[1] . "'STYLES' => array(\n";
    $src .= $i[2] . "'KEYWRODS' => array(\n";
    foreach($lang['ld']['kw'] as $idx_kw => $tmp_kw) {
        $src .= $i[3] . ((int)$idx_kw) . " => " . str_to_phpstring($tmp_kw['style']) . ",\n";
    }
    $src .= $i[3] . "),\n";
    $src .= $i[2] . "'COMMENTS' => array(\n";
    foreach($lang['ld']['cmt']['sl'] as $idx_cmt_sl => $tmp_cmt_sl) {
        $src .= $i[3] . ((int)$idx_cmt_sl) . " => " . str_to_phpstring($tmp_cmt_sl['style']) . ",\n";
    }
    foreach($lang['ld']['cmt']['rxc'] as $idx_cmt_rxc => $tmp_cmt_rxc) {
        $src .= $i[3] . ((int)$idx_cmt_rxc) . " => " . str_to_phpstring($tmp_cmt_rxc['style']) . ",\n";
    }
    $src .= $i[3] . "'MULTI' => " . str_to_phpstring($lang['ld']['cmt']['ml'][1]['style']) . "\n";
    $src .= $i[3] . "),\n";
    $src .= $i[2] . "'ESCAPE_CHAR' => array(\n";
    foreach($lang['ld']['str']['erx'] as $idx_str_erx => $tmp_str_erx) {
        $src .= $i[3] . ((int)$idx_str_erx). " => ". str_to_phpstring($tmp_str_erx['style']) . ",\n";
    }
    //    'HARD' => 'color: #000099; font-weight: bold;'
    $src .= $i[3] . "),\n";
    $src .= $i[2] . "'BRACKETS' => array(\n";
    $src .= $i[3] . "),\n";
    $src .= $i[2] . "'STRINGS' => array(\n";
    foreach($lang['ld']['str']['qm'] as $idx_str_qm => $tmp_str_qm) {
        $src .= $i[3] . ((int)$idx_str_qm). " => ". str_to_phpstring($tmp_str_qm['style']) . ",\n";
    }
    //    'HARD' => 'color: #0000ff;'
    $src .= $i[3] . "),\n";
    $src .= $i[2] . "'NUMBERS' => array(\n";
    $src .= $i[3] . "),\n";
    $src .= $i[2] . "'METHODS' => array(\n";
    $src .= $i[3] . "),\n";
    $src .= $i[2] . "'SYMBOLS' => array(\n";
    foreach($lang['ld']['sy'] as $idx_kw => $tmp_kw) {
        $src .= $i[3] . ((int)$idx_kw) . " => " . str_to_phpstring($tmp_kw['style']) . ",\n";
    }
    $src .= $i[3] . "),\n";
    $src .= $i[2] . "'REGEXPS' => array(\n";
    $src .= $i[3] . "),\n";
    $src .= $i[2] . "'SCRIPT' => array(\n";
    $src .= $i[3] . "),\n";
    $src .= $i[2] . "),\n";

    //Keyword Documentation
    $src .= $i[1] . "'URLS' => array(\n";
    foreach($lang['ld']['kw'] as $idx_kw => $tmp_kw) {
        $src .= $i[2] . ((int)$idx_kw) . " => " . str_to_phpstring($tmp_kw['docs']) . ",\n";
    }
    $src .= $i[2] . "),\n";
    $src .= $i[1] . "'OOLANG' => false,\n";
    $src .= $i[1] . "'OBJECT_SPLITTERS' => array(\n";
    $src .= $i[2] . "),\n";
    $src .= $i[1] . "'REGEXPS' => array(\n";
    $src .= $i[2] . "),\n";
    $src .= $i[1] . "'STRICT_MODE_APPLIES' => GESHI_MAYBE,\n";
    $src .= $i[1] . "'SCRIPT_DELIMITERS' => array(\n";
    $src .= $i[2] . "),\n";
    $src .= $i[1] . "'HIGHLIGHT_STRICT_BLOCK' => array(\n";
    $src .= $i[2] . "),\n";
    $src .= $i[1] . "'TAB_WIDTH' => 4,\n";

    $src .= <<<GESHI_LANGFILE_FOOTER
);

?>
GESHI_LANGFILE_FOOTER;

    //Reduce source ...
    $src = preg_replace('/array\(\s*\)/s', 'array()', $src);
    $src = preg_replace('/\,(\s*\))/s', '\1', $src);
    $src = preg_replace('/\s+$/m', '', $src);

    return $src;
}

// vim: shiftwidth=4 softtabstop=4
?>
