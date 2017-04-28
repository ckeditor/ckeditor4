<?php

/** This file is part of KCFinder project
  *
  *      @desc Uploader class
  *   @package KCFinder
  *   @version 3.12
  *    @author Pavel Tzonkov <sunhater@sunhater.com>
  * @copyright 2010-2014 KCFinder Project
  *   @license http://opensource.org/licenses/GPL-3.0 GPLv3
  *   @license http://opensource.org/licenses/LGPL-3.0 LGPLv3
  *      @link http://kcfinder.sunhater.com
  */

namespace kcfinder;

class uploader {

/** Release version */
    const VERSION = "3.12";

/** Config session-overrided settings
  * @var array */
    protected $config = array();

/** Default image driver
  * @var string */
    protected $imageDriver = "gd";

/** Opener applocation properties
  * @var array */
    protected $opener = array();

/** Got from $_GET['type'] or first one $config['types'] array key, if inexistant
  * @var string */
    protected $type;

/** Helper property. Local filesystem path to the Type Directory
  * Equivalent: $config['uploadDir'] . "/" . $type
  * @var string */
    protected $typeDir;

/** Helper property. Web URL to the Type Directory
  * Equivalent: $config['uploadURL'] . "/" . $type
  * @var string */
    protected $typeURL;

/** Linked to $config['types']
  * @var array */
    protected $types = array();

/** Settings which can override default settings if exists as keys in $config['types'][$type] array
  * @var array */
    protected $typeSettings = array('disabled', 'theme', 'dirPerms', 'filePerms', 'denyZipDownload', 'maxImageWidth', 'maxImageHeight', 'thumbWidth', 'thumbHeight', 'jpegQuality', 'access', 'filenameChangeChars', 'dirnameChangeChars', 'denyExtensionRename', 'deniedExts', 'watermark');

/** Got from language file
  * @var string */
    protected $charset;

/** The language got from $_GET['lng'] or $_GET['lang'] or... Please see next property
  * @var string */
    protected $lang = "en";

/** Possible language $_GET keys
  * @var array */
    protected $langInputNames = array('lang', 'langCode', 'lng', 'language', 'lang_code');

/** Uploaded file(s) info. Linked to first $_FILES element
  * @var array */
    protected $file;

/** Next three properties are got from the current language file
  * @var string */
    protected $dateTimeFull;   // Currently not used
    protected $dateTimeMid;    // Currently not used
    protected $dateTimeSmall;

/** Contain Specified language labels
  * @var array */
    protected $labels = array();

/** Session array. Please use this property instead of $_SESSION
  * @var array */
    protected $session;

/** CMS integration property (got from $_GET['cms'])
  * @var string */
    protected $cms = "";

/** Magic method which allows read-only access to protected or private class properties
  * @param string $property
  * @return mixed */
    public function __get($property) {
        return property_exists($this, $property) ? $this->$property : null;
    }

    public function __construct() {

        // SET CMS INTEGRATION PROPERTY
        if (isset($_GET['cms']) &&
            $this->checkFilename($_GET['cms']) &&
            is_file("integration/{$_GET['cms']}.php")
        )
            $this->cms = $_GET['cms'];

		// LINKING UPLOADED FILE
        if (count($_FILES))
            $this->file = &$_FILES[key($_FILES)];

        // LOAD DEFAULT CONFIGURATION
        require "conf/config.php";

        // SETTING UP SESSION
        if (!session_id()) {
            if (isset($_CONFIG['_sessionLifetime']))
                ini_set('session.gc_maxlifetime', $_CONFIG['_sessionLifetime'] * 60);
            if (isset($_CONFIG['_sessionDir']))
                ini_set('session.save_path', $_CONFIG['_sessionDir']);
            if (isset($_CONFIG['_sessionDomain']))
                ini_set('session.cookie_domain', $_CONFIG['_sessionDomain']);
            session_start();
        }

        // LOAD SESSION CONFIGURATION IF EXISTS
        $this->config = $_CONFIG;
        $sessVar = "_sessionVar";
        if (isset($_CONFIG[$sessVar])) {

            $sessVar = $_CONFIG[$sessVar];

            if (!isset($_SESSION[$sessVar]))
                $_SESSION[$sessVar] = array();

            $sessVar = &$_SESSION[$sessVar];

            if (!is_array($sessVar))
                $sessVar = array();

            foreach ($sessVar as $key => $val)
                if ((substr($key, 0, 1) != "_") && isset($_CONFIG[$key]))
                    $this->config[$key] = $val;

            if (!isset($sessVar['self']))
                $sessVar['self'] = array();

            $this->session = &$sessVar['self'];

        } else
            $this->session = &$_SESSION;

        // SECURING THE SESSION
        $stamp = array(
            'ip' => $_SERVER['REMOTE_ADDR'],
            'agent' => md5($_SERVER['HTTP_USER_AGENT'])
        );
        if (!isset($this->session['stamp']))
            $this->session['stamp'] = $stamp;
        elseif (!is_array($this->session['stamp']) || ($this->session['stamp'] !== $stamp)) {
            if ($this->session['stamp']['ip'] === $stamp['ip'])
                session_destroy();
            die;
        }

        // IMAGE DRIVER INIT
        if (isset($this->config['imageDriversPriority'])) {
            $this->config['imageDriversPriority'] =
                text::clearWhitespaces($this->config['imageDriversPriority']);
            $driver = image::getDriver(explode(' ', $this->config['imageDriversPriority']));
            if ($driver !== false)
                $this->imageDriver = $driver;
        }
        if ((!isset($driver) || ($driver === false)) &&
            (image::getDriver(array($this->imageDriver)) === false)
        )
            die("Cannot find any of the supported PHP image extensions!");

        // WATERMARK INIT
        if (isset($this->config['watermark']) && is_string($this->config['watermark']))
            $this->config['watermark'] = array('file' => $this->config['watermark']);

        // GET TYPE DIRECTORY
        $this->types = &$this->config['types'];
        $firstType = array_keys($this->types);
        $firstType = $firstType[0];
        $this->type = (
            isset($_GET['type']) &&
            isset($this->types[$_GET['type']])
        )
            ? $_GET['type'] : $firstType;

        // LOAD TYPE DIRECTORY SPECIFIC CONFIGURATION IF EXISTS
        if (is_array($this->types[$this->type])) {
            foreach ($this->types[$this->type] as $key => $val)
                if (in_array($key, $this->typeSettings))
                    $this->config[$key] = $val;
            $this->types[$this->type] = isset($this->types[$this->type]['type'])
                ? $this->types[$this->type]['type'] : "";
        }

        // COOKIES INIT
        $ip = '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
        $ip = '/^' . implode('\.', array($ip, $ip, $ip, $ip)) . '$/';
        if (preg_match($ip, $_SERVER['HTTP_HOST']) ||
            preg_match('/^[^\.]+$/', $_SERVER['HTTP_HOST'])
        )
            $this->config['cookieDomain'] = "";
        elseif (!strlen($this->config['cookieDomain']))
            $this->config['cookieDomain'] = $_SERVER['HTTP_HOST'];
        if (!strlen($this->config['cookiePath']))
            $this->config['cookiePath'] = "/";

        // UPLOAD FOLDER INIT

        // FULL URL
        if (preg_match('/^([a-z]+)\:\/\/([^\/^\:]+)(\:(\d+))?\/(.+)\/?$/',
                $this->config['uploadURL'], $patt)
        ) {
            list($unused, $protocol, $domain, $unused, $port, $path) = $patt;
            $path = path::normalize($path);
            $this->config['uploadURL'] = "$protocol://$domain" . (strlen($port) ? ":$port" : "") . "/$path";
            $this->config['uploadDir'] = strlen($this->config['uploadDir'])
                ? path::normalize($this->config['uploadDir'])
                : path::url2fullPath("/$path");
            $this->typeDir = "{$this->config['uploadDir']}/{$this->type}";
            $this->typeURL = "{$this->config['uploadURL']}/{$this->type}";

        // SITE ROOT
        } elseif ($this->config['uploadURL'] == "/") {
            $this->config['uploadDir'] = strlen($this->config['uploadDir'])
                ? path::normalize($this->config['uploadDir'])
                : path::normalize($_SERVER['DOCUMENT_ROOT']);
            $this->typeDir = "{$this->config['uploadDir']}/{$this->type}";
            $this->typeURL = "/{$this->type}";

        // ABSOLUTE & RELATIVE
        } else {
            $this->config['uploadURL'] = (substr($this->config['uploadURL'], 0, 1) === "/")
                ? path::normalize($this->config['uploadURL'])
                : path::rel2abs_url($this->config['uploadURL']);
            $this->config['uploadDir'] = strlen($this->config['uploadDir'])
                ? path::normalize($this->config['uploadDir'])
                : path::url2fullPath($this->config['uploadURL']);
            $this->typeDir = "{$this->config['uploadDir']}/{$this->type}";
            $this->typeURL = "{$this->config['uploadURL']}/{$this->type}";
        }

        // HOST APPLICATIONS INIT
        if (isset($_GET['CKEditorFuncNum'])) {
            $this->opener['name'] = "ckeditor";
            $this->opener['CKEditor'] = array('funcNum' => $_GET['CKEditorFuncNum']);

        } elseif (isset($_GET['opener'])) {
            $this->opener['name'] = $_GET['opener'];

            if ($_GET['opener'] == "tinymce") {
                if (!isset($this->config['_tinyMCEPath']) || !strlen($this->config['_tinyMCEPath']))
                    $this->opener['name'] = false;

            } elseif ($_GET['opener'] == "tinymce4") {
                if (!isset($_GET['field']))
                    $this->opener['name'] = false;
                else
                    $this->opener['TinyMCE'] = array('field' => $_GET['field']);
            }

        } else
            $this->opener['name'] = false;

        // LOCALIZATION
        foreach ($this->langInputNames as $key)
            if (isset($_GET[$key]) &&
                preg_match('/^[a-z][a-z\._\-]*$/i', $_GET[$key]) &&
                file_exists("lang/" . strtolower($_GET[$key]) . ".php")
            ) {
                $this->lang = $_GET[$key];
                break;
            }
        $this->localize($this->lang);

        // IF BROWSER IS ENABLED
        if (!$this->config['disabled']) {

            // TRY TO CREATE UPLOAD DIRECTORY IF NOT EXISTS
            if (!$this->config['disabled'] && !is_dir($this->config['uploadDir']))
                @mkdir($this->config['uploadDir'], $this->config['dirPerms']);

            // CHECK & MAKE DEFAULT .htaccess
            if (isset($this->config['_check4htaccess']) &&
                $this->config['_check4htaccess']
            ) {
                $htaccess = "{$this->config['uploadDir']}/.htaccess";
                $original = $this->get_htaccess();
                if (!file_exists($htaccess)) {
                    if (!@file_put_contents($htaccess, $original))
                        $this->backMsg("Cannot write to upload folder. {$this->config['uploadDir']}");
                } else {
                    if (false === ($data = @file_get_contents($htaccess)))
                        $this->backMsg("Cannot read .htaccess");
                    if (($data != $original) && !@file_put_contents($htaccess, $original))
                        $this->backMsg("Incorrect .htaccess file. Cannot rewrite it!");
                }
            }

            // CHECK & CREATE UPLOAD FOLDER
            if (!is_dir($this->typeDir)) {
                if (!mkdir($this->typeDir, $this->config['dirPerms']))
                    $this->backMsg("Cannot create {dir} folder.", array('dir' => $this->type));
            } elseif (!is_readable($this->typeDir))
                $this->backMsg("Cannot read upload folder.");
        }
    }

    public function upload() {
        $config = &$this->config;
        $file = &$this->file;
        $url = $message = "";

        if ($config['disabled'] || !$config['access']['files']['upload']) {
            if (isset($file['tmp_name'])) @unlink($file['tmp_name']);
            $message = $this->label("You don't have permissions to upload files.");

        } elseif (true === ($message = $this->checkUploadedFile())) {
            $message = "";

            $dir = "{$this->typeDir}/";
            if (isset($_GET['dir']) &&
                (false !== ($gdir = $this->checkInputDir($_GET['dir'])))
            ) {
                $udir = path::normalize("$dir$gdir");
                if (substr($udir, 0, strlen($dir)) !== $dir)
                    $message = $this->label("Unknown error.");
                else {
                    $l = strlen($dir);
                    $dir = "$udir/";
                    $udir = substr($udir, $l);
                }
            }

            if (!strlen($message)) {
                if (!is_dir(path::normalize($dir)))
                    @mkdir(path::normalize($dir), $this->config['dirPerms'], true);

                $filename = $this->normalizeFilename($file['name']);
                $target = file::getInexistantFilename($dir . $filename);

                if (!@move_uploaded_file($file['tmp_name'], $target) &&
                    !@rename($file['tmp_name'], $target) &&
                    !@copy($file['tmp_name'], $target)
                )
                    $message = $this->label("Cannot move uploaded file to target folder.");
                else {
                    if (function_exists('chmod'))
                        @chmod($target, $this->config['filePerms']);
                    $this->makeThumb($target);
                    $url = $this->typeURL;
                    if (isset($udir)) $url .= "/$udir";
                    $url .= "/" . basename($target);
                    if (preg_match('/^([a-z]+)\:\/\/([^\/^\:]+)(\:(\d+))?\/(.+)$/', $url, $patt)) {
                        list($unused, $protocol, $domain, $unused, $port, $path) = $patt;
                        $base = "$protocol://$domain" . (strlen($port) ? ":$port" : "") . "/";
                        $url = $base . path::urlPathEncode($path);
                    } else
                        $url = path::urlPathEncode($url);
                }
            }
        }

        if (strlen($message) &&
            isset($this->file['tmp_name']) &&
            file_exists($this->file['tmp_name'])
        )
            @unlink($this->file['tmp_name']);

        if (strlen($message) && method_exists($this, 'errorMsg'))
            $this->errorMsg($message);
        else
            $this->callBack($url, $message);
    }

    protected function normalizeFilename($filename) {

        if (isset($this->config['filenameChangeChars']) &&
            is_array($this->config['filenameChangeChars'])
        )
            $filename = strtr($filename, $this->config['filenameChangeChars']);

        if (isset($this->config['_normalizeFilenames']) && $this->config['_normalizeFilenames'])
            $filename = file::normalizeFilename($filename);

        return $filename;
    }

    protected function normalizeDirname($dirname) {

        if (isset($this->config['dirnameChangeChars']) &&
            is_array($this->config['dirnameChangeChars'])
        )
            $dirname = strtr($dirname, $this->config['dirnameChangeChars']);

        if (isset($this->config['_normalizeFilenames']) && $this->config['_normalizeFilenames'])
            $dirname = file::normalizeFilename($dirname);

        return $dirname;
    }

    protected function checkFilePath($file) {
        $rPath = realpath($file);
        if (strtoupper(substr(PHP_OS, 0, 3)) == "WIN")
            $rPath = str_replace("\\", "/", $rPath);
        return (substr($rPath, 0, strlen($this->typeDir)) === $this->typeDir);
    }

    protected function checkFilename($file) {

        if ((basename($file) !== $file) ||
            (
                isset($this->config['_normalizeFilenames']) &&
                $this->config['_normalizeFilenames'] &&
                preg_match('/[^0-9a-z\.\- _]/si', $file)
            )
        )
            return false;

        return true;
    }

    protected function checkUploadedFile(array $aFile=null) {
        $config = &$this->config;
        $file = ($aFile === null) ? $this->file : $aFile;

        if (!is_array($file) || !isset($file['name']))
            return $this->label("Unknown error");

        if (is_array($file['name'])) {
            foreach ($file['name'] as $i => $name) {
                $return = $this->checkUploadedFile(array(
                    'name' => $name,
                    'tmp_name' => $file['tmp_name'][$i],
                    'error' => $file['error'][$i]
                ));
                if ($return !== true)
                    return "$name: $return";
            }
            return true;
        }

        $extension = file::getExtension($file['name']);
        $typePatt = strtolower(text::clearWhitespaces($this->types[$this->type]));

        // CHECK FOR UPLOAD ERRORS
        if ($file['error'])
            return
                ($file['error'] == UPLOAD_ERR_INI_SIZE) ?
                    $this->label("The uploaded file exceeds {size} bytes.",
                        array('size' => ini_get('upload_max_filesize'))) : (
                ($file['error'] == UPLOAD_ERR_FORM_SIZE) ?
                    $this->label("The uploaded file exceeds {size} bytes.",
                        array('size' => $_GET['MAX_FILE_SIZE'])) : (
                ($file['error'] == UPLOAD_ERR_PARTIAL) ?
                    $this->label("The uploaded file was only partially uploaded.") : (
                ($file['error'] == UPLOAD_ERR_NO_FILE) ?
                    $this->label("No file was uploaded.") : (
                ($file['error'] == UPLOAD_ERR_NO_TMP_DIR) ?
                    $this->label("Missing a temporary folder.") : (
                ($file['error'] == UPLOAD_ERR_CANT_WRITE) ?
                    $this->label("Failed to write file.") :
                    $this->label("Unknown error.")
            )))));

        // HIDDEN FILENAMES CHECK
        elseif (substr($file['name'], 0, 1) == ".")
            return $this->label("File name shouldn't begins with '.'");

        // EXTENSION CHECK
        elseif (
            (substr($file['name'], -1) == ".") ||
            !$this->validateExtension($extension, $this->type)
        )
            return $this->label("Denied file extension.");

        // SPECIAL DIRECTORY TYPES CHECK (e.g. *img)
        elseif (preg_match('/^\*([^ ]+)(.*)?$/s', $typePatt, $patt)) {
            list($typePatt, $type, $params) = $patt;
            $class = __NAMESPACE__ . "\\type_$type";
            if (class_exists($class)) {
                $type = new $class();
                $cfg = $config;
                $cfg['filename'] = $file['name'];
                if (strlen($params))
                    $cfg['params'] = trim($params);
                $response = $type->checkFile($file['tmp_name'], $cfg);
                if ($response !== true)
                    return $this->label($response);
            } else
                return $this->label("Non-existing directory type.");
        }

        // IMAGE RESIZE
        $img = image::factory($this->imageDriver, $file['tmp_name']);
        if (!$img->initError && !$this->imageResize($img, $file['tmp_name']))
            return $this->label("The image is too big and/or cannot be resized.");

        return true;
    }

    protected function checkInputDir($dir, $inclType=true, $existing=true) {
        $dir = path::normalize($dir);
        if (substr($dir, 0, 1) == "/")
            $dir = substr($dir, 1);

        if ((substr($dir, 0, 1) == ".") || (substr(basename($dir), 0, 1) == "."))
            return false;

        if ($inclType) {
            $first = explode("/", $dir);
            $first = $first[0];
            if ($first != $this->type)
                return false;
            $return = $this->removeTypeFromPath($dir);
        } else {
            $return = $dir;
            $dir = "{$this->type}/$dir";
        }

        if (!$existing)
            return $return;

        $path = "{$this->config['uploadDir']}/$dir";
        return (is_dir($path) && is_readable($path)) ? $return : false;
    }

    protected function validateExtension($ext, $type) {
        $ext = trim(strtolower($ext));
        if (!isset($this->types[$type]))
            return false;

        $exts = strtolower(text::clearWhitespaces($this->config['deniedExts']));
        if (strlen($exts)) {
            $exts = explode(" ", $exts);
            if (in_array($ext, $exts))
                return false;
        }

        $exts = trim($this->types[$type]);
        if (!strlen($exts) || substr($exts, 0, 1) == "*")
            return true;

        if (substr($exts, 0, 1) == "!") {
            $exts = explode(" ", trim(strtolower(substr($exts, 1))));
            return !in_array($ext, $exts);
        }

        $exts = explode(" ", trim(strtolower($exts)));
        return in_array($ext, $exts);
    }

    protected function getTypeFromPath($path) {
        return preg_match('/^([^\/]*)\/.*$/', $path, $patt)
            ? $patt[1] : $path;
    }

    protected function removeTypeFromPath($path) {
        return preg_match('/^[^\/]*\/(.*)$/', $path, $patt)
            ? $patt[1] : "";
    }

    protected function imageResize($image, $file=null) {

        if (!($image instanceof image)) {
            $img = image::factory($this->imageDriver, $image);
            if ($img->initError) return false;
            $file = $image;
        } elseif ($file === null)
            return false;
        else
            $img = $image;

        $orientation = 1;
        if (function_exists("exif_read_data")) {
            $orientation = @exif_read_data($file);
            $orientation = isset($orientation['Orientation']) ? $orientation['Orientation'] : 1;
        }

        // IMAGE WILL NOT BE RESIZED WHEN NO WATERMARK AND SIZE IS ACCEPTABLE
        if ((
                !isset($this->config['watermark']['file']) ||
                (!strlen(trim($this->config['watermark']['file'])))
            ) && (
                (
                    !$this->config['maxImageWidth'] &&
                    !$this->config['maxImageHeight']
                ) || (
                    ($img->width <= $this->config['maxImageWidth']) &&
                    ($img->height <= $this->config['maxImageHeight'])
                )
            ) &&
            ($orientation == 1)
        )
            return true;

        // PROPORTIONAL RESIZE
        if ((!$this->config['maxImageWidth'] || !$this->config['maxImageHeight'])) {

            if ($this->config['maxImageWidth'] &&
                ($this->config['maxImageWidth'] < $img->width)
            ) {
                $width = $this->config['maxImageWidth'];
                $height = $img->getPropHeight($width);

            } elseif (
                $this->config['maxImageHeight'] &&
                ($this->config['maxImageHeight'] < $img->height)
            ) {
                $height = $this->config['maxImageHeight'];
                $width = $img->getPropWidth($height);
            }

            if (isset($width) && isset($height) && !$img->resize($width, $height))
                return false;

        // RESIZE TO FIT
        } elseif (
            $this->config['maxImageWidth'] && $this->config['maxImageHeight'] &&
            !$img->resizeFit($this->config['maxImageWidth'], $this->config['maxImageHeight'])
        )
            return false;

        // AUTO FLIP AND ROTATE FROM EXIF
        if ((($orientation == 2) && !$img->flipHorizontal()) ||
            (($orientation == 3) && !$img->rotate(180)) ||
            (($orientation == 4) && !$img->flipVertical()) ||
            (($orientation == 5) && (!$img->flipVertical() || !$img->rotate(90))) ||
            (($orientation == 6) && !$img->rotate(90)) ||
            (($orientation == 7) && (!$img->flipHorizontal() || !$img->rotate(90))) ||
            (($orientation == 8) && !$img->rotate(270))
        )
            return false;
        if (($orientation >= 2) && ($orientation <= 8) && ($this->imageDriver == "imagick"))
            try {
                $img->image->setImageProperty('exif:Orientation', "1");
            } catch (\Exception $e) {}

        // WATERMARK
        if (isset($this->config['watermark']['file']) &&
            is_file($this->config['watermark']['file'])
        ) {
            $left = isset($this->config['watermark']['left'])
                ? $this->config['watermark']['left'] : false;
            $top = isset($this->config['watermark']['top'])
                ? $this->config['watermark']['top'] : false;
            $img->watermark($this->config['watermark']['file'], $left, $top);
        }

        // WRITE TO FILE
        return $img->output("jpeg", array(
            'file' => $file,
            'quality' => $this->config['jpegQuality']
        ));
    }

    protected function makeThumb($file, $overwrite=true) {
        $img = image::factory($this->imageDriver, $file);

        // Drop files which are not images
        if ($img->initError)
            return true;

        $fimg = new fastImage($file);
        $type = $fimg->getType();
        $fimg->close();

        if ($type === false)
            return true;

        $thumb = substr($file, strlen($this->config['uploadDir']));
        $thumb = $this->config['uploadDir'] . "/" . $this->config['thumbsDir'] . "/" . $thumb;
        $thumb = path::normalize($thumb);
        $thumbDir = dirname($thumb);
        if (!is_dir($thumbDir) && !@mkdir($thumbDir, $this->config['dirPerms'], true))
            return false;

        if (!$overwrite && is_file($thumb))
            return true;

        // Images with smaller resolutions than thumbnails
        if (($img->width <= $this->config['thumbWidth']) &&
            ($img->height <= $this->config['thumbHeight'])
        ) {
            // Drop only browsable types
            if (in_array($type, array("gif", "jpeg", "png")))
                return true;

        // Resize image
        } elseif (!$img->resizeFit($this->config['thumbWidth'], $this->config['thumbHeight']))
            return false;

        // Save thumbnail
        $options = array('file' => $thumb);
        if ($type == "gif")
            $type = "jpeg";
        if ($type == "jpeg")
            $options['quality'] = $this->config['jpegQuality'];
        return $img->output($type, $options);
    }

    protected function localize($langCode) {
        require "lang/{$langCode}.php";
        setlocale(LC_ALL, $lang['_locale']);
        $this->charset = $lang['_charset'];
        $this->dateTimeFull = $lang['_dateTimeFull'];
        $this->dateTimeMid = $lang['_dateTimeMid'];
        $this->dateTimeSmall = $lang['_dateTimeSmall'];
        unset($lang['_locale']);
        unset($lang['_charset']);
        unset($lang['_dateTimeFull']);
        unset($lang['_dateTimeMid']);
        unset($lang['_dateTimeSmall']);
        $this->labels = $lang;
    }

    protected function label($string, array $data=null) {
        $return = isset($this->labels[$string]) ? $this->labels[$string] : $string;
        if (is_array($data))
            foreach ($data as $key => $val)
                $return = str_replace("{{$key}}", $val, $return);
        return $return;
    }

    protected function backMsg($message, array $data=null) {
        $message = $this->label($message, $data);
        $tmp_name = isset($this->file['tmp_name']) ? $this->file['tmp_name'] : false;

        if ($tmp_name) {
            $tmp_name = (is_array($tmp_name) && isset($tmp_name[0]))
                ? $tmp_name[0]
                : $tmp_name;

            if (file_exists($tmp_name))
                @unlink($tmp_name);
        }
        $this->callBack("", $message);
        die;
    }

    protected function callBack($url, $message="") {
        $message = text::jsValue($message);

        if ((get_class($this) == "kcfinder\\browser") && ($this->action != "browser"))
            return;

        if (isset($this->opener['name'])) {
            $method = "callBack_{$this->opener['name']}";
            if (method_exists($this, $method))
                $js = $this->$method($url, $message);
        }

        if (!isset($js))
            $js = $this->callBack_default($url, $message);

        header("Content-Type: text/html; charset={$this->charset}");
        echo "<html><body>$js</body></html>";
    }

    protected function callBack_ckeditor($url, $message) {
        $CKfuncNum = isset($this->opener['CKEditor']['funcNum']) ? $this->opener['CKEditor']['funcNum'] : 0;
        if (!$CKfuncNum) $CKfuncNum = 0;
        return "<script type='text/javascript'>
var par = window.parent,
    op = window.opener,
    o = (par && par.CKEDITOR) ? par : ((op && op.CKEDITOR) ? op : false);
if (o !== false) {
    if (op) window.close();
    o.CKEDITOR.tools.callFunction($CKfuncNum, '$url', '$message');
} else {
    alert('$message');
    if (op) window.close();
}
</script>";
    }

    protected function callBack_fckeditor($url, $message) {
        $n = strlen($message) ? 1 : 0;
        return "<script type='text/javascript'>
var par = window.parent,
    op = window.opener,
    o = (op && op.OnUploadCompleted) ? op.OnUploadCompleted : ((par && par.OnUploadCompleted) ? par.OnUploadCompleted : false);
if (o !== false) {
    if (op) window.close();
    o($n, '$url', '', '$message');
} else {
    alert('$message');
    if (op) window.close();
}
</script>";
    }

    protected function callBack_tinymce($url, $message) {
        return $this->callBack_default($url, $message);
    }

    protected function callBack_tinymce4($url, $message) {
        return $this->callBack_default($url, $message);
    }

    protected function callBack_default($url, $message) {
        return "<script type='text/javascript'>
alert('$message');
if (window.opener) window.close();
</script>";
    }

    protected function get_htaccess() {
        return file_get_contents("conf/upload.htaccess");
    }
}

?>
