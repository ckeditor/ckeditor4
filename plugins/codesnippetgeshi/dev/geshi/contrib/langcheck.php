<?php
/**
 * GeSHi language file validation script
 *
 * Just point your browser at this script (with geshi.php in the parent directory)
 * and the language files in subdirectory "../geshi/" are being validated
 *
 * CLI mode is supported
 *
 * @author  Benny Baumann
 * @version $Id: langcheck.php 2510 2012-06-27 15:57:55Z reedy_boy $
 */
header('Content-Type: text/html; charset=utf-8');

set_time_limit(0);
error_reporting(E_ALL);
$time_start = explode(' ', microtime());

function colorize($level, $string) {
    static $colors, $end;
    if ( !isset($colors) ) {
      if ( PHP_SAPI != 'cli' ) {
          $end = '</span>';
          $colors = array(
              TYPE_NOTICE => '<span style="color:#080;font-weight:bold;">',
              TYPE_WARNING => '<span style="color:#CC0; font-weight: bold;">',
              TYPE_ERROR => '<span style="color:#F00; font-weight: bold;">',
              TYPE_OK => '<span style="color: #080; font-weight: bold;">'
          );
      } else {
          $end = chr(27).'[0m';
          $colors = array(
              TYPE_NOTICE => chr(27).'[1m',
              TYPE_WARNING => chr(27).'[1;33m',
              TYPE_ERROR => chr(27).'[1;31m',
              TYPE_OK => chr(27).'[1;32m'
          );
      }
    }

    if ( !isset($colors[$level]) ) {
        trigger_error("no colors for level $level", E_USER_ERROR);
    }

    return $colors[$level].$string.$end;
}

define ('TYPE_NOTICE', 0);
define ('TYPE_WARNING', 1);
define ('TYPE_ERROR', 2);
define ('TYPE_OK', 3);

$error_abort = false;
$error_cache = array();
function output_error_cache(){
    global $error_cache, $error_abort;

    if(count($error_cache)) {
        echo colorize(TYPE_ERROR, "Failed");
        if ( PHP_SAPI == 'cli' ) {
            echo "\n\n";
        } else {
            echo "<br /><ol>\n";
        }
        foreach($error_cache as $error_msg) {
            if ( PHP_SAPI == 'cli' ) {
              echo "\n";
            } else {
              echo "<li>";
            }
            switch($error_msg['t']) {
                case TYPE_NOTICE:
                    $msg = 'NOTICE';
                    break;
                case TYPE_WARNING:
                    $msg = 'WARNING';
                    break;
                case TYPE_ERROR:
                    $msg = 'ERROR';
                    break;
            }
            echo colorize($error_msg['t'], $msg);
            if ( PHP_SAPI == 'cli' ) {
                echo "\t" . $error_msg['m'];
            } else {
                echo " " . $error_msg['m'] . "</li>";
            }
        }
        if ( PHP_SAPI == 'cli' ) {
            echo "\n";
        } else {
            echo "</ol>\n";
        }
    } else {
        echo colorize(TYPE_OK, "OK");
        if ( PHP_SAPI == 'cli' ) {
            echo "\n";
        } else {
            echo "\n<br />";
        }
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

function dupfind_strtolower(&$value){
    $value = strtolower($value);
}

if ( PHP_SAPI != 'cli' ) { ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <title>GeSHi Language File Validation Script</title>
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
<h2>GeSHi Language File Validation Script</h2>
<p>To use this script, make sure that <strong>geshi.php</strong> is in the
parent directory or in your include_path, and that the language files are in a
subdirectory of GeSHi's directory called <strong>geshi/</strong>.</p>
<p>Everything else will be done by this script automatically. After the script
finished you should see messages of what could cause trouble with GeSHi or where
your language files can be improved. Please be patient, as this might take some time.</p>

<ol>
<li>Checking where to find GeSHi installation ...<?php
} else { ?>
<?php echo colorize(TYPE_NOTICE, "#### GeSHi Language File Validation Script ####") ?>


To use this script, make sure that <?php echo colorize(TYPE_NOTICE, "geshi.php"); ?> is in the
parent directory or in your include_path, and that the language files are in a
subdirectory of GeSHi's directory called <?php echo colorize(TYPE_NOTICE, "geshi/"); ?>.

Everything else will be done by this script automatically. After the script
finished you should see messages of what could cause trouble with GeSHi or where
your language files can be improved. Please be patient, as this might take some time.


Checking where to find GeSHi installation ...<?php echo "\t";
}

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

output_error_cache();

if(!$error_abort) {
    if ( PHP_SAPI == 'cli' ) {
        echo "Listing available language files ...\t\t";
    } else {
        echo "</li>\n<li>Listing available language files ... ";
    }

    if (!($dir = @opendir(GESHI_LANG_ROOT))) {
        report_error(TYPE_ERROR, 'Error requesting listing for available language files!');
    }

    $languages = array();

    if(!$error_abort) {
        while ($file = readdir($dir)) {
            if (!$file || $file[0] == '.' || strpos($file, '.php') === false) {
                continue;
            }
            $lang = substr($file, 0,  strpos($file, '.'));
            if(4 != strlen($file) - strlen($lang)) {
                continue;
            }
            $languages[] = $lang;
        }
        closedir($dir);
    }

    $languages = array_unique($languages);
    sort($languages);

    if(!count($languages)) {
        report_error(TYPE_WARNING, 'Unable to locate any usable language files in "'.GESHI_LANG_ROOT.'"!');
    }

    output_error_cache();
}

if ( PHP_SAPI == 'cli' ) {
    if (isset($_SERVER['argv'][1]) && in_array($_SERVER['argv'][1], $languages)) {
        $languages = array($_SERVER['argv'][1]);
    }
} else {
    if (isset($_REQUEST['show']) && in_array($_REQUEST['show'], $languages)) {
        $languages = array($_REQUEST['show']);
    }
}

if(!$error_abort) {
    foreach ($languages as $lang) {

        if ( PHP_SAPI == 'cli' ) {
            echo "Validating language file for '$lang' ...\t\t";
        } else {
            echo "</li>\n<li>Validating language file for '$lang' ... ";
        }

        $langfile = GESHI_LANG_ROOT . $lang . '.php';

        $language_data = array();

        if(!is_file($langfile)) {
            report_error(TYPE_ERROR, 'The path "' .$langfile. '" does not ressemble a regular file!');
        } elseif(!is_readable($langfile)) {
            report_error(TYPE_ERROR, 'Cannot read file "' .$langfile. '"!');
        } else {
            $langfile_content = file_get_contents($langfile);
            if(preg_match("/\?>(?:\r?\n|\r(?!\n)){2,}\Z/", $langfile_content)) {
                report_error(TYPE_ERROR, 'Language file contains trailing empty lines at EOF!');
            }
            if(!preg_match("/\?>(?:\r?\n|\r(?!\n))?\Z/", $langfile_content)) {
                report_error(TYPE_ERROR, 'Language file contains no PHP end marker at EOF!');
            }
            if(preg_match("/\t/", $langfile_content)) {
                report_error(TYPE_NOTICE, 'Language file contains unescaped tabulator chars (probably for indentation)!');
            }
            if(preg_match('/^(?:    )*(?!    )(?! \*) /m', $langfile_content)) {
                report_error(TYPE_NOTICE, 'Language file contains irregular indentation (other than 4 spaces per indentation level)!');
            }

            if(!preg_match("/\/\*\*((?!\*\/).)*?Author:((?!\*\/).)*?\*\//s", $langfile_content)) {
                report_error(TYPE_WARNING, 'Language file does not contain a specification of an author!');
            }
            if(!preg_match("/\/\*\*((?!\*\/).)*?Copyright:((?!\*\/).)*?\*\//s", $langfile_content)) {
                report_error(TYPE_WARNING, 'Language file does not contain a specification of the copyright!');
            }
            if(!preg_match("/\/\*\*((?!\*\/).)*?Release Version:((?!\*\/).)*?\*\//s", $langfile_content)) {
                report_error(TYPE_WARNING, 'Language file does not contain a specification of the release version!');
            }
            if(!preg_match("/\/\*\*((?!\*\/).)*?Date Started:((?!\*\/).)*?\*\//s", $langfile_content)) {
                report_error(TYPE_WARNING, 'Language file does not contain a specification of the date it was started!');
            }
            if(!preg_match("/\/\*\*((?!\*\/).)*?This file is part of GeSHi\.((?!\*\/).)*?\*\//s", $langfile_content)) {
                report_error(TYPE_WARNING, 'Language file does not state that it belongs to GeSHi!');
            }
            if(!preg_match("/\/\*\*((?!\*\/).)*?language file for GeSHi\.((?!\*\/).)*?\*\//s", $langfile_content)) {
                report_error(TYPE_WARNING, 'Language file does not state that it is a language file for GeSHi!');
            }
            if(!preg_match("/\/\*\*((?!\*\/).)*?GNU General Public License((?!\*\/).)*?\*\//s", $langfile_content)) {
                report_error(TYPE_WARNING, 'Language file does not state that it is provided under the terms of the GNU GPL!');
            }

            unset($langfile_content);

            include $langfile;

            if(!isset($language_data)) {
                report_error(TYPE_ERROR, 'Language file does not contain a $language_data structure to check!');
            } elseif (!is_array($language_data)) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data structure which is not an array!');
            }
        }

        if(!$error_abort) {
            if(!isset($language_data['LANG_NAME'])) {
                report_error(TYPE_ERROR, 'Language file contains no $language_data[\'LANG_NAME\'] specification!');
            } elseif (!is_string($language_data['LANG_NAME'])) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'LANG_NAME\'] specification which is not a string!');
            }

            if(!isset($language_data['COMMENT_SINGLE'])) {
                report_error(TYPE_ERROR, 'Language file contains no $language_data[\'COMMENT_SIGNLE\'] structure to check!');
            } elseif (!is_array($language_data['COMMENT_SINGLE'])) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'COMMENT_SINGLE\'] structure which is not an array!');
            }

            if(!isset($language_data['COMMENT_MULTI'])) {
                report_error(TYPE_ERROR, 'Language file contains no $language_data[\'COMMENT_MULTI\'] structure to check!');
            } elseif (!is_array($language_data['COMMENT_MULTI'])) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'COMMENT_MULTI\'] structure which is not an array!');
            }

            if(isset($language_data['COMMENT_REGEXP'])) {
                if (!is_array($language_data['COMMENT_REGEXP'])) {
                    report_error(TYPE_ERROR, 'Language file contains a $language_data[\'COMMENT_REGEXP\'] structure which is not an array!');
                }
            }

            if(!isset($language_data['QUOTEMARKS'])) {
                report_error(TYPE_ERROR, 'Language file contains no $language_data[\'QUOTEMARKS\'] structure to check!');
            } elseif (!is_array($language_data['QUOTEMARKS'])) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'QUOTEMARKS\'] structure which is not an array!');
            }

            if(isset($language_data['HARDQUOTE'])) {
                if (!is_array($language_data['HARDQUOTE'])) {
                    report_error(TYPE_ERROR, 'Language file contains a $language_data[\'HARDQUOTE\'] structure which is not an array!');
                }
            }

            if(!isset($language_data['ESCAPE_CHAR'])) {
                report_error(TYPE_ERROR, 'Language file contains no $language_data[\'ESCAPE_CHAR\'] specification to check!');
            } elseif (!is_string($language_data['ESCAPE_CHAR'])) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'ESCAPE_CHAR\'] specification which is not a string!');
            } elseif (1 < strlen($language_data['ESCAPE_CHAR'])) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'ESCAPE_CHAR\'] specification is not empty or exactly one char!');
            }

            if(!isset($language_data['CASE_KEYWORDS'])) {
                report_error(TYPE_ERROR, 'Language file contains no $language_data[\'CASE_KEYWORDS\'] specification!');
            } elseif (!is_int($language_data['CASE_KEYWORDS'])) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'CASE_KEYWORDS\'] specification which is not an integer!');
            } elseif (GESHI_CAPS_NO_CHANGE != $language_data['CASE_KEYWORDS'] &&
                GESHI_CAPS_LOWER != $language_data['CASE_KEYWORDS'] &&
                GESHI_CAPS_UPPER != $language_data['CASE_KEYWORDS']) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'CASE_KEYWORDS\'] specification which is neither of GESHI_CAPS_NO_CHANGE, GESHI_CAPS_LOWER nor GESHI_CAPS_UPPER!');
            }

            if(!isset($language_data['KEYWORDS'])) {
                report_error(TYPE_ERROR, 'Language file contains no $language_data[\'KEYWORDS\'] structure to check!');
            } elseif (!is_array($language_data['KEYWORDS'])) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'KEYWORDS\'] structure which is not an array!');
            } else {
                foreach($language_data['KEYWORDS'] as $kw_key => $kw_value) {
                    if(!is_integer($kw_key)) {
                        report_error(TYPE_WARNING, "Language file contains an key '$kw_key' in \$language_data['KEYWORDS'] that is not integer!");
                    } elseif (!is_array($kw_value)) {
                        report_error(TYPE_ERROR, "Language file contains a \$language_data['KEYWORDS']['$kw_value'] structure which is not an array!");
                    }
                }
            }

            if(!isset($language_data['SYMBOLS'])) {
                report_error(TYPE_ERROR, 'Language file contains no $language_data[\'SYMBOLS\'] structure to check!');
            } elseif (!is_array($language_data['SYMBOLS'])) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'SYMBOLS\'] structure which is not an array!');
            }

            if(!isset($language_data['CASE_SENSITIVE'])) {
                report_error(TYPE_ERROR, 'Language file contains no $language_data[\'CASE_SENSITIVE\'] structure to check!');
            } elseif (!is_array($language_data['CASE_SENSITIVE'])) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'CASE_SENSITIVE\'] structure which is not an array!');
            } else {
                foreach($language_data['CASE_SENSITIVE'] as $cs_key => $cs_value) {
                    if(!is_integer($cs_key)) {
                        report_error(TYPE_WARNING, "Language file contains an key '$cs_key' in \$language_data['CASE_SENSITIVE'] that is not integer!");
                    } elseif (!is_bool($cs_value)) {
                        report_error(TYPE_ERROR, "Language file contains a Case Sensitivity specification for \$language_data['CASE_SENSITIVE']['$cs_value'] which is not a boolean!");
                    }
                }
            }

            if(!isset($language_data['URLS'])) {
                report_error(TYPE_ERROR, 'Language file contains no $language_data[\'URLS\'] structure to check!');
            } elseif (!is_array($language_data['URLS'])) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'URLS\'] structure which is not an array!');
            } else {
                foreach($language_data['URLS'] as $url_key => $url_value) {
                    if(!is_integer($url_key)) {
                        report_error(TYPE_WARNING, "Language file contains an key '$url_key' in \$language_data['URLS'] that is not integer!");
                    } elseif (!is_string($url_value)) {
                        report_error(TYPE_ERROR, "Language file contains a Documentation URL specification for \$language_data['URLS']['$url_value'] which is not a string!");
                    } elseif (preg_match('#&([^;]*(=|$))#U', $url_value)) {
                        report_error(TYPE_ERROR, "Language file contains unescaped ampersands (&amp;) in \$language_data['URLS']!");
                    }
                }
            }

            if(!isset($language_data['OOLANG'])) {
                report_error(TYPE_ERROR, 'Language file contains no $language_data[\'OOLANG\'] specification!');
            } elseif (!is_int($language_data['OOLANG']) && !is_bool($language_data['OOLANG'])) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'OOLANG\'] specification which is neither boolean nor integer!');
            } elseif (false !== $language_data['OOLANG'] &&
                true !== $language_data['OOLANG'] &&
                2 !== $language_data['OOLANG']) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'OOLANG\'] specification which is neither of false, true or 2!');
            }

            if(!isset($language_data['OBJECT_SPLITTERS'])) {
                report_error(TYPE_ERROR, 'Language file contains no $language_data[\'OBJECT_SPLITTERS\'] structure to check!');
            } elseif (!is_array($language_data['OBJECT_SPLITTERS'])) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'OBJECT_SPLITTERS\'] structure which is not an array!');
            }

            if(!isset($language_data['REGEXPS'])) {
                report_error(TYPE_ERROR, 'Language file contains no $language_data[\'REGEXPS\'] structure to check!');
            } elseif (!is_array($language_data['REGEXPS'])) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'REGEXPS\'] structure which is not an array!');
            }

            if(!isset($language_data['STRICT_MODE_APPLIES'])) {
                report_error(TYPE_ERROR, 'Language file contains no $language_data[\'STRICT_MODE_APPLIES\'] specification!');
            } elseif (!is_int($language_data['STRICT_MODE_APPLIES'])) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'STRICT_MODE_APPLIES\'] specification which is not an integer!');
            } elseif (GESHI_MAYBE != $language_data['STRICT_MODE_APPLIES'] &&
                GESHI_ALWAYS != $language_data['STRICT_MODE_APPLIES'] &&
                GESHI_NEVER != $language_data['STRICT_MODE_APPLIES']) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'STRICT_MODE_APPLIES\'] specification which is neither of GESHI_MAYBE, GESHI_ALWAYS nor GESHI_NEVER!');
            }

            if(!isset($language_data['SCRIPT_DELIMITERS'])) {
                report_error(TYPE_ERROR, 'Language file contains no $language_data[\'SCRIPT_DELIMITERS\'] structure to check!');
            } elseif (!is_array($language_data['SCRIPT_DELIMITERS'])) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'SCRIPT_DELIMITERS\'] structure which is not an array!');
            }

            if(!isset($language_data['HIGHLIGHT_STRICT_BLOCK'])) {
                report_error(TYPE_ERROR, 'Language file contains no $language_data[\'HIGHLIGHT_STRICT_BLOCK\'] structure to check!');
            } elseif (!is_array($language_data['HIGHLIGHT_STRICT_BLOCK'])) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'HIGHLIGHT_STRICT_BLOCK\'] structure which is not an array!');
            }

            if(isset($language_data['TAB_WIDTH'])) {
                if (!is_int($language_data['TAB_WIDTH'])) {
                    report_error(TYPE_ERROR, 'Language file contains a $language_data[\'TAB_WIDTH\'] specification which is not an integer!');
                } elseif (1 > $language_data['TAB_WIDTH']) {
                    report_error(TYPE_ERROR, 'Language file contains a $language_data[\'TAB_WIDTH\'] specification which is less than 1!');
                }
            }

            if(isset($language_data['PARSER_CONTROL'])) {
                if (!is_array($language_data['PARSER_CONTROL'])) {
                    report_error(TYPE_ERROR, 'Language file contains a $language_data[\'PARSER_CONTROL\'] structure which is not an array!');
                }
            }

            if(!isset($language_data['STYLES'])) {
                report_error(TYPE_ERROR, 'Language file contains no $language_data[\'STYLES\'] structure to check!');
            } elseif (!is_array($language_data['STYLES'])) {
                report_error(TYPE_ERROR, 'Language file contains a $language_data[\'STYLES\'] structure which is not an array!');
            } else {
                $style_arrays = array('KEYWORDS', 'COMMENTS', 'ESCAPE_CHAR',
                    'BRACKETS', 'STRINGS', 'NUMBERS', 'METHODS', 'SYMBOLS',
                    'REGEXPS', 'SCRIPT');
                foreach($style_arrays as $style_kind) {
                    if(!isset($language_data['STYLES'][$style_kind])) {
                        report_error(TYPE_ERROR, "Language file contains no \$language_data['STYLES']['$style_kind'] structure to check!");
                    } elseif (!is_array($language_data['STYLES'][$style_kind])) {
                        report_error(TYPE_ERROR, "Language file contains a \$language_data['STYLES\']['$style_kind'] structure which is not an array!");
                    } else {
                        foreach($language_data['STYLES'][$style_kind] as $sk_key => $sk_value) {
                            if(!is_int($sk_key) && ('COMMENTS' != $style_kind && 'MULTI' != $sk_key)
                                && !(('STRINGS' == $style_kind || 'ESCAPE_CHAR' == $style_kind) && 'HARD' == $sk_key)) {
                                report_error(TYPE_WARNING, "Language file contains an key '$sk_key' in \$language_data['STYLES']['$style_kind'] that is not integer!");
                            } elseif (!is_string($sk_value)) {
                                report_error(TYPE_WARNING, "Language file contains a CSS specification for \$language_data['STYLES']['$style_kind'][$key] which is not a string!");
                            }
                        }
                    }
                }

                unset($style_arrays);
            }
        }

        if(!$error_abort) {
            //Initial sanity checks survived? --> Let's dig deeper!
            foreach($language_data['KEYWORDS'] as $key => $keywords) {
                if(!isset($language_data['CASE_SENSITIVE'][$key])) {
                    report_error(TYPE_ERROR, "Language file contains no \$language_data['CASE_SENSITIVE'] specification for keyword group $key!");
                }
                if(!isset($language_data['URLS'][$key])) {
                    report_error(TYPE_ERROR, "Language file contains no \$language_data['URLS'] specification for keyword group $key!");
                }
                if(empty($keywords)) {
                    report_error(TYPE_WARNING, "Language file contains an empty keyword list in \$language_data['KEYWORDS'] for group $key!");
                }
                foreach($keywords as $id => $kw) {
                    if(!is_string($kw)) {
                        report_error(TYPE_WARNING, "Language file contains an non-string entry at \$language_data['KEYWORDS'][$key][$id]!");
                    } elseif (!strlen($kw)) {
                        report_error(TYPE_ERROR, "Language file contains an empty string entry at \$language_data['KEYWORDS'][$key][$id]!");
                    } elseif (preg_match('/^([\(\)\{\}\[\]\^=.,:;\-+\*\/%\$\"\'\?]|&[\w#]\w*;)+$/i', $kw)) {
                        report_error(TYPE_NOTICE, "Language file contains an keyword ('$kw') at \$language_data['KEYWORDS'][$key][$id] which seems to be better suited for the symbols section!");
                    }
                }
                if(isset($language_data['CASE_SENSITIVE'][$key]) && !$language_data['CASE_SENSITIVE'][$key]) {
                    array_walk($keywords, 'dupfind_strtolower');
                }
                if(count($keywords) != count(array_unique($keywords))) {
                    $kw_diffs = array_count_values($keywords);
                    foreach($kw_diffs as $kw => $kw_count) {
                        if($kw_count > 1) {
                            report_error(TYPE_WARNING, "Language file contains per-group duplicate keyword '$kw' in \$language_data['KEYWORDS'][$key]!");
                        }
                    }
                }
            }

            $disallowed_before = "(?<![a-zA-Z0-9\$_\|\#;>|^&";
            $disallowed_after = "(?![a-zA-Z0-9_\|%\\-&;";

            foreach($language_data['KEYWORDS'] as $key => $keywords) {
                foreach($language_data['KEYWORDS'] as $key2 => $keywords2) {
                    if($key2 <= $key) {
                        continue;
                    }
                    $kw_diffs = array_intersect($keywords, $keywords2);
                    foreach($kw_diffs as $kw) {
                        if(isset($language_data['PARSER_CONTROL']['KEYWORDS'])) {
                            //Check the precondition\post-cindition for the involved keyword groups
                            $g1_pre = $disallowed_before;
                            $g2_pre = $disallowed_before;
                            $g1_post = $disallowed_after;
                            $g2_post = $disallowed_after;
                            if(isset($language_data['PARSER_CONTROL']['KEYWORDS']['DISALLOWED_BEFORE'])) {
                                $g1_pre = $language_data['PARSER_CONTROL']['KEYWORDS']['DISALLOWED_BEFORE'];
                                $g2_pre = $language_data['PARSER_CONTROL']['KEYWORDS']['DISALLOWED_BEFORE'];
                            }
                            if(isset($language_data['PARSER_CONTROL']['KEYWORDS']['DISALLOWED_AFTER'])) {
                                $g1_post = $language_data['PARSER_CONTROL']['KEYWORDS']['DISALLOWED_AFTER'];
                                $g2_post = $language_data['PARSER_CONTROL']['KEYWORDS']['DISALLOWED_AFTER'];
                            }

                            if(isset($language_data['PARSER_CONTROL']['KEYWORDS'][$key]['DISALLOWED_BEFORE'])) {
                                $g1_pre = $language_data['PARSER_CONTROL']['KEYWORDS'][$key]['DISALLOWED_BEFORE'];
                            }
                            if(isset($language_data['PARSER_CONTROL']['KEYWORDS'][$key]['DISALLOWED_AFTER'])) {
                                $g1_post = $language_data['PARSER_CONTROL']['KEYWORDS'][$key]['DISALLOWED_AFTER'];
                            }

                            if(isset($language_data['PARSER_CONTROL']['KEYWORDS'][$key2]['DISALLOWED_BEFORE'])) {
                                $g2_pre = $language_data['PARSER_CONTROL']['KEYWORDS'][$key2]['DISALLOWED_BEFORE'];
                            }
                            if(isset($language_data['PARSER_CONTROL']['KEYWORDS'][$key2]['DISALLOWED_AFTER'])) {
                                $g2_post = $language_data['PARSER_CONTROL']['KEYWORDS'][$key2]['DISALLOWED_AFTER'];
                            }

                            if($g1_pre != $g2_pre || $g1_post != $g2_post) {
                                continue;
                            }
                        }
                        report_error(TYPE_WARNING, "Language file contains cross-group duplicate keyword '$kw' in \$language_data['KEYWORDS'][$key] and \$language_data['KEYWORDS'][$key2]!");
                    }
                }
            }
            foreach($language_data['CASE_SENSITIVE'] as $key => $keywords) {
                if(!isset($language_data['KEYWORDS'][$key]) && $key != GESHI_COMMENTS) {
                    report_error(TYPE_WARNING, "Language file contains an superfluous \$language_data['CASE_SENSITIVE'] specification for non-existing keyword group $key!");
                }
            }
            foreach($language_data['URLS'] as $key => $keywords) {
                if(!isset($language_data['KEYWORDS'][$key])) {
                    report_error(TYPE_WARNING, "Language file contains an superfluous \$language_data['URLS'] specification for non-existing keyword group $key!");
                }
            }
            foreach($language_data['STYLES']['KEYWORDS'] as $key => $keywords) {
                if(!isset($language_data['KEYWORDS'][$key])) {
                    report_error(TYPE_WARNING, "Language file contains an superfluous \$language_data['STYLES']['KEYWORDS'] specification for non-existing keyword group $key!");
                }
            }

            foreach($language_data['COMMENT_SINGLE'] as $ck => $cv) {
                if(!is_int($ck)) {
                    report_error(TYPE_WARNING, "Language file contains an key '$ck' in \$language_data['COMMENT_SINGLE'] that is not integer!");
                }
                if(!is_string($cv)) {
                    report_error(TYPE_WARNING, "Language file contains an non-string entry at \$language_data['COMMENT_SINGLE'][$ck]!");
                }
                if(!isset($language_data['STYLES']['COMMENTS'][$ck])) {
                    report_error(TYPE_WARNING, "Language file contains no \$language_data['STYLES']['COMMENTS'] specification for comment group $ck!");
                }
            }
            if(isset($language_data['COMMENT_REGEXP'])) {
                foreach($language_data['COMMENT_REGEXP'] as $ck => $cv) {
                    if(!is_int($ck)) {
                        report_error(TYPE_WARNING, "Language file contains an key '$ck' in \$language_data['COMMENT_REGEXP'] that is not integer!");
                    }
                    if(!is_string($cv)) {
                        report_error(TYPE_WARNING, "Language file contains an non-string entry at \$language_data['COMMENT_REGEXP'][$ck]!");
                    }
                    if(!isset($language_data['STYLES']['COMMENTS'][$ck])) {
                        report_error(TYPE_WARNING, "Language file contains no \$language_data['STYLES']['COMMENTS'] specification for comment group $ck!");
                    }
                }
            }
            foreach($language_data['STYLES']['COMMENTS'] as $ck => $cv) {
                if($ck != 'MULTI' && !isset($language_data['COMMENT_SINGLE'][$ck]) &&
                    !isset($language_data['COMMENT_REGEXP'][$ck])) {
                    report_error(TYPE_NOTICE, "Language file contains an superfluous \$language_data['STYLES']['COMMENTS'] specification for Single Line or Regular-Expression Comment key $ck!");
                }
            }
            if (isset($language_data['STYLES']['STRINGS']['HARD'])) {
                if (empty($language_data['HARDQUOTE'])) {
                    report_error(TYPE_NOTICE, "Language file contains superfluous \$language_data['STYLES']['STRINGS'] specification for key 'HARD', but no 'HARDQUOTE's are defined!");
                }
                unset($language_data['STYLES']['STRINGS']['HARD']);
            }
            foreach($language_data['STYLES']['STRINGS'] as $sk => $sv) {
                if($sk && !isset($language_data['QUOTEMARKS'][$sk])) {
                    report_error(TYPE_NOTICE, "Language file contains an superfluous \$language_data['STYLES']['STRINGS'] specification for non-existing quotemark key $sk!");
                }
            }

            foreach($language_data['REGEXPS'] as $rk => $rv) {
                if(!is_int($rk)) {
                    report_error(TYPE_WARNING, "Language file contains an key '$rk' in \$language_data['REGEXPS'] that is not integer!");
                }
                if(is_string($rv)) {
                    //Check for unmasked / in regular expressions ...
                    if(empty($rv)) {
                        report_error(TYPE_WARNING, "Language file contains an empty regular expression at \$language_data['REGEXPS'][$rk]!");
                    } else {
                        if(preg_match("/(?<!\\\\)\//s", $rv)) {
                            report_error(TYPE_WARNING, "Language file contains a regular expression with an unmasked / character at \$language_data['REGEXPS'][$rk]!");
                        } elseif (preg_match("/(?<!<)(\\\\\\\\)*\\\\\|(?!>)/s", $rv)) {
                            report_error(TYPE_WARNING, "Language file contains a regular expression with an unescaped match for a pipe character '|' which needs escaping as '&lt;PIPE&gt;' instead at \$language_data['REGEXPS'][$rk]!");
                        }
                    }
                } elseif(is_array($rv)) {
                    if(!isset($rv[GESHI_SEARCH])) {
                        report_error(TYPE_ERROR, "Language file contains no GESHI_SEARCH entry in extended regular expression at \$language_data['REGEXPS'][$rk]!");
                    } elseif(!is_string($rv[GESHI_SEARCH])) {
                        report_error(TYPE_ERROR, "Language file contains a GESHI_SEARCH entry in extended regular expression at \$language_data['REGEXPS'][$rk] which is not a string!");
                    } else {
                        if(preg_match("/(?<!\\\\)\//s", $rv[GESHI_SEARCH])) {
                            report_error(TYPE_WARNING, "Language file contains a regular expression with an unmasked / character at \$language_data['REGEXPS'][$rk]!");
                        } elseif (preg_match("/(?<!<)(\\\\\\\\)*\\\\\|(?!>)/s", $rv[GESHI_SEARCH])) {
                            report_error(TYPE_WARNING, "Language file contains a regular expression with an unescaped match for a pipe character '|' which needs escaping as '&lt;PIPE&gt;' instead at \$language_data['REGEXPS'][$rk]!");
                        }
                    }
                    if(!isset($rv[GESHI_REPLACE])) {
                        report_error(TYPE_WARNING, "Language file contains no GESHI_REPLACE entry in extended regular expression at \$language_data['REGEXPS'][$rk]!");
                    } elseif(!is_string($rv[GESHI_REPLACE])) {
                        report_error(TYPE_ERROR, "Language file contains a GESHI_REPLACE entry in extended regular expression at \$language_data['REGEXPS'][$rk] which is not a string!");
                    }
                    if(!isset($rv[GESHI_MODIFIERS])) {
                        report_error(TYPE_WARNING, "Language file contains no GESHI_MODIFIERS entry in extended regular expression at \$language_data['REGEXPS'][$rk]!");
                    } elseif(!is_string($rv[GESHI_MODIFIERS])) {
                        report_error(TYPE_ERROR, "Language file contains a GESHI_MODIFIERS entry in extended regular expression at \$language_data['REGEXPS'][$rk] which is not a string!");
                    }
                    if(!isset($rv[GESHI_BEFORE])) {
                        report_error(TYPE_WARNING, "Language file contains no GESHI_BEFORE entry in extended regular expression at \$language_data['REGEXPS'][$rk]!");
                    } elseif(!is_string($rv[GESHI_BEFORE])) {
                        report_error(TYPE_ERROR, "Language file contains a GESHI_BEFORE entry in extended regular expression at \$language_data['REGEXPS'][$rk] which is not a string!");
                    }
                    if(!isset($rv[GESHI_AFTER])) {
                        report_error(TYPE_WARNING, "Language file contains no GESHI_AFTER entry in extended regular expression at \$language_data['REGEXPS'][$rk]!");
                    } elseif(!is_string($rv[GESHI_AFTER])) {
                        report_error(TYPE_ERROR, "Language file contains a GESHI_AFTER entry in extended regular expression at \$language_data['REGEXPS'][$rk] which is not a string!");
                    }
                } else {
                    report_error(TYPE_WARNING, "Language file contains an non-string and non-array entry at \$language_data['REGEXPS'][$rk]!");
                }
                if(!isset($language_data['STYLES']['REGEXPS'][$rk])) {
                    report_error(TYPE_WARNING, "Language file contains no \$language_data['STYLES']['REGEXPS'] specification for regexp group $rk!");
                }
            }
            foreach($language_data['STYLES']['REGEXPS'] as $rk => $rv) {
                if(!isset($language_data['REGEXPS'][$rk])) {
                    report_error(TYPE_NOTICE, "Language file contains an superfluous \$language_data['STYLES']['REGEXPS'] specification for regexp key $rk!");
                }
            }


        }

        output_error_cache();

        flush();

        if($error_abort) {
            break;
        }
    }
}

$time_end = explode(' ', microtime());
$time_diff = $time_end[0] + $time_end[1] - $time_start[0] - $time_start[1];

if ( PHP_SAPI != 'cli' ) {
?></li>
</ol>

<p>Validation process completed in <? printf("%.2f", $time_diff); ?> seconds.</p>

<div id="footer">GeSHi &copy; 2004-2007 Nigel McNie, 2007-2008 Benny Baumann, released under the GNU GPL</div>
</body>
</html>

<?php } else { ?>

Validation process completed in <? printf("%.2f", $time_diff); ?> seconds.

GeSHi &copy; 2004-2007 Nigel McNie, 2007-2012 Benny Baumann, released under the GNU GPL

<?php } ?>