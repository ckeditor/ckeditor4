#!/usr/bin/php -q
<?php
/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license

Script for automatic line-ending corrections.
Requires PHP5 to run: http://www.gophp5.org/ ;)
*/

error_reporting(E_ALL);

/**
 * Carriage return
 *
 */
define('CR', "\r");
/**
 * Line feed
 *
 */
define('LF', "\n");
/**
 * Carriage return + Line feed
 *
 */
define('CRLF', "\r\n");

/**
 * Array, where:
 *  file extension is the key
 *  value is the new line character
 */
$list = array();
$list["readme"] = CRLF;
$list["afp"] = CRLF;
$list["afpa"] = CRLF;
$list["ascx"] = CRLF;
$list["asp"] = CRLF;
$list["aspx"] = CRLF;
$list["bat"] = CRLF;
$list["cfc"] = CRLF;
$list["cfm"] = CRLF;
$list["cgi"] = LF;
$list["code"] = CRLF;
$list["command"] = CRLF;
$list["conf"] = CRLF;
$list["css"] = CRLF;
$list["dtd"] = CRLF;
$list["htaccess"] = CRLF;
$list["htc"] = CRLF;
$list["htm"] = CRLF;
$list["html"] = CRLF;
$list["js"] = CRLF;
$list["jsp"] = CRLF;
$list["lasso"] = CRLF;
$list["pack"] = CRLF;
$list["php"] = CRLF;
$list["pl"] = LF;
$list["py"] = CRLF;
$list["sample"] = CRLF;
$list["sh"] = LF;
$list["txt"] = CRLF;
$list["xml"] = CRLF;

$bom = array();
$bom['asp'] = true;
$bom['js'] = true;

/**
 * Do not modify anything below
 * use command line arguments to modify script's behaviour
 */

/**
 * Strip whitespace from the end of file
 * @var boolean $eofstripwhite
 */
$eofstripwhite = false;
/**
 * Strip whitespace from the end of line
 * @var boolean $eolstripwhite
 */
$eolstripwhite = false;
/**
 * Force new line character at the end of file
 * @var boolean $eofnewline
 */
$eofnewline = false;
/**
 * Windows only
 * If set to true, archive files/folders are skipped
 * @var boolean $noarchive
 */
$noarchive = false;
/**
 * Windows only
 * If set to true, hidden files/folders are skipped
 * @var boolean $nohidden
 */
$nohidden = false;
/**
 * Windows only
 * If set to true, system files/folders are skipped
 * @var boolean $nosystem
 */
$nosystem = false;
/**
 * If set to true, dot files are skipped
 * @var boolean $nodotfiles
 */
$nodotfiles = false;
/**
 * If set to true, BOM characters are fixed
 * @var boolean $fixbom
 */
$fixbom = false;
/**
 * How deep to recurse into subdirectories
 * -1 to disable
 *  0 to fix only current directory
 *
 * @var integer $maxdepth
 */
$maxdepth = -1;
/**
 * If set, regex is used to exclude files
 * Warning: preg_match format expected
 * example:
 * --excluderegex = "/(\.\w+)$/"
 *
 * @var string $excluderegex
 */
$excluderegex = "";

/**
 * Set to true if script is launched in Windows
 * @var boolean $windows
 */
$windows = (strtolower(substr(PHP_OS, 0, 3)) == "win");

/**
 * Count saved bytes
 * @var integer $saved_bytes
 */
$saved_bytes = 0;

/**
 * Filter file list using regular expression (negative result)
 *
 */
class NegRegexFilter extends FilterIterator
{
    protected $regex;
    public function __construct(Iterator $it, $regex)
    {
        parent::__construct($it);
        $this->regex=$regex;
    }
    public function accept()
    {
        return !preg_match($this->regex, $this->current());
    }
}

/**
 * Filter file list using regular expression
 *
 */
class RegexFilter extends FilterIterator
{
    protected $regex;
    public function __construct(Iterator $it, $regex)
    {
        parent::__construct($it);
        $this->regex=$regex;
    }
    public function accept()
    {
        return preg_match($this->regex, $this->current());
    }
}

/**
 * Filter file list by depth
 *
 */
class DepthFilter extends FilterIterator
{
    protected $depth;
    public function __construct(Iterator $it, $depth)
    {
        parent::__construct($it);
        $this->depth=$depth;
    }
    public function accept()
    {
        return $this->getInnerIterator()->getDepth()<$this->depth;
    }
}

/**
 * Fix new line characters in given file
 * Returns true if file was changed
 *
 * @param string $path relative or absolute path name to file
 * @param string $nl name of a constant that holds new line character (CRLF|CR|LF)
 * @return bool
 */
function fixFile($path, $nl) {

    $contents = file($path);
    $size = filesize($path);
    if ($contents === false) {
        echo "\rERROR: couldn't read the " . $path . " file". "\n";
        return false;
    }

    $modified = false;
    $new_content = "";
    $contents_len = sizeof($contents);

    if ($GLOBALS['eofstripwhite']) {
        $lines_processed=0;
        //iterate through lines, from the end of file
        for ($i=$contents_len-1; $i>=0; $i--) {
            $old_line = $contents[$i];
            $contents[$i] = rtrim($contents[$i]);
            if ($old_line !== $contents[$i]) {
                if (!$GLOBALS['eofnewline'] || $old_line !== $contents[$i] . constant($nl) || $lines_processed>0) {
                    $modified = true;
                }
            }

            if (empty($contents[$i])) {
                //we have an empty line at the end of file, just skip it
                unset($contents[$contents_len--]);
            }
            else {
                if ($GLOBALS['eofnewline']) {
                    $contents[$i] .= constant($nl);
                    if ($old_line !== $contents[$i]) {
                        $modified = true;
                    }
                }
                //we have found non-empty line, there is no need to go further
                break;
            }
            $lines_processed++;
        }
    }

    for ($i=0; $i<$contents_len; $i++) {
        $is_last_line = ($i == $contents_len-1);
        $line = $contents[$i];

        switch ($nl)
        {
            case 'CRLF':
                if (substr($line, -2) !== CRLF) {
                    if (substr($line, -1) === LF || substr($line, -1) === CR) {
                        $line = substr($line, 0, -1) . CRLF;
                        $modified = true;
                    }
                    elseif(strlen($line)) {
                        if (!$is_last_line) {
                            echo "\rERROR: wrong line ending: " . $path . "@line " . ($i+1) . "\n";
                            return false;
                        }
                        elseif(!$GLOBALS['eofstripwhite']) {
                            $line = $line . CRLF;
                            $modified = true;
                        }
                    }
                }
                break;

            case 'CR':
                if (substr($line, -1) !== CR) {
                    if (substr($line, -1) === LF) {
                        $line = substr($line, 0, -1) . CR;
                        $modified = true;
                    }
                    elseif(strlen($line)) {
                        if (!$is_last_line) {
                            echo "\rERROR: wrong line ending: " . $path . "@line " . ($i+1) . "\n";
                            return false;
                        }
                        elseif(!$GLOBALS['eofstripwhite']) {
                            $line = $line . CR;
                            $modified = true;
                        }
                    }
                }
                break;

            case 'LF':
                if (substr($line, -2) === CRLF) {
                    $line = substr($line, 0, -2) . LF;
                    $modified = true;
                }
                elseif (substr($line, -1) !== LF) {
                    if (substr($line, -1) === CR) {
                        $line = substr($line, 0, -1) . LF;
                        $modified = true;
                    }
                    elseif(strlen($line)) {
                        if (!$is_last_line) {
                            echo "\rERROR: wrong line ending: " . $path . "@line " . ($i+1) . "\n";
                            return false;
                        }
                        elseif(!$GLOBALS['eofstripwhite']) {
                            $line = $line . LF;
                            $modified = true;
                        }
                    }
                }
                break;
        }
        if ($GLOBALS['eolstripwhite']) {
            $before = strlen($line);
            $line = preg_replace("/(?:\x09|\x20)+((?:\r|\n)+)$/", "$1", $line);
            if (strlen($line) != $before) {
                $modified = true;
            }
        }
        $new_content .= $line;
    }

    if ($GLOBALS['fixbom']) {
        $before_fixing = $new_content;
        $ext = strtolower(substr($path, strrpos($path, ".") + 1));
        $new_content = stripUtf8Bom( $new_content );
        if (!empty($GLOBALS['bom'][$ext])) {
            $new_content = "\xEF\xBB\xBF" . $new_content; // BOM
        }
        if ($new_content != $before_fixing)
            $modified = true;
    }

    if ($modified) {
        $fp = fopen($path, "wb");
        if (!$fp) {
            echo "\rERROR: couldn't open the " . $path . " file". "\n";
            return false;
        }
        else {
            if (flock($fp, LOCK_EX)) {
                fwrite($fp, $new_content);
                flock($fp, LOCK_UN);
                echo "\rMODIFIED to " . $nl . ": " . $path ;
                if ($GLOBALS['eolstripwhite']) {
                    $saved = $size - strlen($new_content);
                    $GLOBALS['saved_bytes'] += $saved;
                    if ($saved>0) {
                        echo " (saved " . $saved . "B)";
                    }
                    else if ($saved<0) {
                        echo " (" . abs($saved) . "B added)";
                    }
                }
                echo "\n";
            } else {
                echo "\rERROR: couldn't lock the " . $path . " file". "\n";
                return false;
            }
            fclose($fp);
        }
    }

    return $modified;
}

/**
 * Strip BOM from a string
 * @param string $data
 */
function stripUtf8Bom( $data )
{
    if ( substr( $data, 0, 3 ) == "\xEF\xBB\xBF" )
        return stripUtf8Bom(substr_replace( $data, '', 0, 3 )) ;

    return $data ;
}

/**
 * Fix ending lines in all files at given path
 *
 * @param string $path
 */
function fixPath($path)
{
    if (is_file($path)) {
        $ext = strtolower(substr($path, strrpos($path, ".")));
        foreach (array('CRLF', 'LF', 'CR') as $nl) {
            //find out what's the correct line ending and fix file
            //no need to process further
            if (in_array($ext, $GLOBALS['extList'][$nl])) {
                echo "Fixing single file:\n";
                fixFile($path, $nl);
                break;
            }
        }

    }
    else {
        $dir = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path), true);

        if ($GLOBALS['maxdepth'] > -1) {
            $dir = new DepthFilter($dir, $GLOBALS['maxdepth']+1);
        }

        $dir = new NegRegexFilter($dir, "/\/(\.svn|CVS)/");

        if ($GLOBALS['excluderegex']) {
            $dir = new NegRegexFilter($dir, $GLOBALS['excluderegex']);
        }

        foreach (array('CRLF', 'LF', 'CR') as $nl) {

            $filtered_dir = new RegexFilter($dir, "/\.(".implode("|", $GLOBALS['extList'][$nl]).")$/i");

            $extensions = array();
            $j = 0;
            $progressbar = "|/-\\";
            foreach ($filtered_dir as $file) {
                if (!is_dir($file)) {
                    $basename = basename($file);

                    //skip dot files
                    if ($GLOBALS['nodotfiles']) {
                        if (strpos($basename, ".") === 0) {
                            continue;
                        }
                    }

                    if ($GLOBALS['windows']) {
                        $attribs = trim(substr(shell_exec("attrib " . $file), 0, 5));
                        //skip archive files
                        if ($GLOBALS['noarchive'] && false !== strpos($attribs, "A")) {
                            print "\r ".$progressbar[$j++ % 4]. " ". str_pad(basename($file), 35, " ", STR_PAD_RIGHT)." SKIPPED";
                            continue;
                        }
                        //skip hidden files
                        if ($GLOBALS['nohidden'] && false !== strpos($attribs, "H")) {
                            print "\r ".$progressbar[$j++ % 4]. " ". str_pad(basename($file), 35, " ", STR_PAD_RIGHT)." SKIPPED";
                            continue;
                        }
                        //skip system files
                        if ($GLOBALS['nosystem'] && false !== strpos($attribs, "S")) {
                            print "\r ".$progressbar[$j++ % 4]. " ". str_pad(basename($file), 35, " ", STR_PAD_RIGHT)." SKIPPED";
                            continue;
                        }
                    }

                    fixFile($file, $nl);
                    print "\r ".$progressbar[$j++ % 4]. " ". str_pad(basename($file), 35, " ", STR_PAD_RIGHT);
                }
            }
        }
    }
}

function printHelp() {
    $help = <<<HELP

SYNOPSIS
       php fixlineends.php [options] PATH [PATH2...]

DESCRIPTION
       Traverse recursively all the paths given and fix line endings
       in each file.

OPTIONS
       --eofnewline
            force new line character at the end of file

       --eofstripwhite
            strip whitespace from the end of file

       --eolstripwhite
            strip whitespace from the end of line (spaces, tabs)

       --excluderegex=regex
            use regex to exclude files, preg_match() format expected

       --fixbom
            fix BOM characters

       --help
            display this help and exit

       --noarchive
            skip archive files (Windows only)

       --nodotfiles
            skip dot files

       --nohidden
            skip hidden files (Windows only)

       --nosystem
            skip system files (Windows only)

       --maxdepth
            fix line ends only if file is N or fewer levels below
            the command line argument; Use --max-depth=0 to omit
            subdirectories

EXAMPLES
            php fixlineends.php --eofstripwhite --eofnewline --maxdepth=1
                --nodotfiles --excluderegex=/\_private/ .

       This command fixes line endings in current directory and in
       subdirectories placed one level below. Dot files are skipped.
       Paths that match "_private" are skipped. White chars are stripped
       at the end of file. New line character is added to the end of file
       (if required).


HELP;
    echo $help;
}

function translateCommandArgs($args) {
    $paths = $args[1];

    foreach ($paths as $path) {
        if (!is_dir($path) && !is_file($path)) {
            die("Entered path is invalid: " . $path);
        }
    }

    foreach ($args[0] as $arg) {
        if (!isset($arg[0])) {
            continue;
        }
        switch ($arg[0]) {
            case '--noarchive':
                $GLOBALS['noarchive'] = true;
                break;

            case '--help':
                printHelp();
                die();
                break;

            case '--maxdepth':
                $GLOBALS['maxdepth'] = intval($arg[1]);
                break;

            case '--nohidden':
                $GLOBALS['nohidden'] = true;
                break;

            case '--nosystem':
                $GLOBALS['nosystem'] = true;
                break;

            case '--nodotfiles':
                $GLOBALS['nodotfiles'] = true;
                break;

            case '--fixbom':
                $GLOBALS['fixbom'] = true;
                break;

            case '--excluderegex':
                $GLOBALS['excluderegex'] = $arg[1];
                break;

            case '--eofnewline':
                $GLOBALS['eofnewline'] = true;
                break;

            case '--eofstripwhite':
                $GLOBALS['eofstripwhite'] = true;
                break;

            case '--eolstripwhite':
                $GLOBALS['eolstripwhite'] = true;
                break;
        }
    }

    return $paths;
}

//$extList holds the associative array of extensions
//key is the name of a constant that holds the line character
$extList = array();
$extList['CRLF'] = $extList['CR'] = $extList['LF'] = array();

foreach ($list as $ext => $nl) {
    $extRegex = preg_quote($ext);
    switch ($nl) {
        case CRLF:
            $extList['CRLF'][] = $extRegex;
            break;
        case LF:
            $extList['LF'][] = $extRegex;
            break;
        case CR:
            $extList['CR'][] = $extRegex;
            break;
        default:
            die("Unknown line ending");
            break;
    }
}

if ($_SERVER['argc']>1) {
    include "../_thirdparty/console_getopt/Getopt.php";

    if ($windows) {
        $longoptions = array("eofstripwhite", "eofnewline", "eolstripwhite", "help", "noarchive", "nohidden", "nosystem", "nodotfiles", "maxdepth=", "excluderegex=", "fixbom");
    }
    else {
        $longoptions = array("eofstripwhite", "eofnewline", "eolstripwhite", "help", "nodotfiles", "maxdepth=", "excluderegex=", "fixbom");
    }

    $con  = new Console_Getopt;
    $args = $con->readPHPArgv();
    $options = $con->getopt($args, null, $longoptions);

    if (PEAR::isError($options)) {
        die($options->getMessage());
    }

    $paths = translateCommandArgs($options);
    foreach ($paths as $path) {
        fixPath($path);
    }
}
else {
    printHelp();
    die();
}

print "\rDone!".str_repeat(" ",40)."\n";
if ($saved_bytes>0) {
    echo "saved " . $saved_bytes . "B";
}
else if ($saved_bytes<0) {
    echo abs($saved_bytes) . "B added";
}
