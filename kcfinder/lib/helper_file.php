<?php

/** This file is part of KCFinder project
  *
  *      @desc File helper class
  *   @package KCFinder
  *   @version 3.12
  *    @author Pavel Tzonkov <sunhater@sunhater.com>
  * @copyright 2010-2014 KCFinder Project
  *   @license http://opensource.org/licenses/GPL-3.0 GPLv3
  *   @license http://opensource.org/licenses/LGPL-3.0 LGPLv3
  *      @link http://kcfinder.sunhater.com
  */

namespace kcfinder;

class file {

    static $MIME = array(
        'ai'    => 'application/postscript',
        'aif'   => 'audio/x-aiff',
        'aifc'  => 'audio/x-aiff',
        'aiff'  => 'audio/x-aiff',
        'avi'   => 'video/x-msvideo',
        'bin'   => 'application/macbinary',
        'bmp'   => 'image/bmp',
        'cpt'   => 'application/mac-compactpro',
        'css'   => 'text/css',
        'csv'   => 'text/x-comma-separated-values',
        'dcr'   => 'application/x-director',
        'dir'   => 'application/x-director',
        'doc'   => 'application/msword',
        'docx'  => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'dvi'   => 'application/x-dvi',
        'dxr'   => 'application/x-director',
        'eml'   => 'message/rfc822',
        'eps'   => 'application/postscript',
        'flv'   => 'video/x-flv',
        'gif'   => 'image/gif',
        'gtar'  => 'application/x-gtar',
        'gz'    => 'application/x-gzip',
        'hqx'   => 'application/mac-binhex40',
        'htm'   => 'text/html',
        'html'  => 'text/html',
        'jpe'   => 'image/jpeg',
        'jpeg'  => 'image/jpeg',
        'jpg'   => 'image/jpeg',
        'js'    => 'application/x-javascript',
        'log'   => 'text/plain',
        'mid'   => 'audio/midi',
        'midi'  => 'audio/midi',
        'mif'   => 'application/vnd.mif',
        'mov'   => 'video/quicktime',
        'movie' => 'video/x-sgi-movie',
        'mp2'   => 'audio/mpeg',
        'mp3'   => 'audio/mpeg',
        'mp4'   => 'video/mpeg',
        'mpe'   => 'video/mpeg',
        'mpeg'  => 'video/mpeg',
        'mpg'   => 'video/mpeg',
        'mpga'  => 'audio/mpeg',
        'oda'   => 'application/oda',
        'pdf'   => 'application/pdf',
        'php'   => 'application/x-httpd-php',
        'php3'  => 'application/x-httpd-php',
        'php4'  => 'application/x-httpd-php',
        'phps'  => 'application/x-httpd-php-source',
        'phtml' => 'application/x-httpd-php',
        'png'   => 'image/png',
        'ppt'   => 'application/powerpoint',
        'ps'    => 'application/postscript',
        'psd'   => 'application/x-photoshop',
        'qt'    => 'video/quicktime',
        'ra'    => 'audio/x-realaudio',
        'ram'   => 'audio/x-pn-realaudio',
        'rm'    => 'audio/x-pn-realaudio',
        'rpm'   => 'audio/x-pn-realaudio-plugin',
        'rtf'   => 'text/rtf',
        'rtx'   => 'text/richtext',
        'rv'    => 'video/vnd.rn-realvideo',
        'shtml' => 'text/html',
        'sit'   => 'application/x-stuffit',
        'smi'   => 'application/smil',
        'smil'  => 'application/smil',
        'swf'   => 'application/x-shockwave-flash',
        'tar'   => 'application/x-tar',
        'tgz'   => 'application/x-tar',
        'text'  => 'text/plain',
        'tif'   => 'image/tiff',
        'tiff'  => 'image/tiff',
        'txt'   => 'text/plain',
        'wav'   => 'audio/x-wav',
        'wbxml' => 'application/wbxml',
        'wmlc'  => 'application/wmlc',
        'word'  => 'application/msword',
        'xht'   => 'application/xhtml+xml',
        'xhtml' => 'application/xhtml+xml',
        'xl'    => 'application/excel',
        'xls'   => 'application/excel',
        'xlsx'  => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'xml'   => 'text/xml',
        'xsl'   => 'text/xml',
        'zip'   => 'application/x-zip'
    );

/** Checks if the given file is really writable. The standard PHP function
  * is_writable() does not work properly on Windows servers.
  * @param string $filename
  * @return bool */

    static function isWritable($filename) {
        $filename = path::normalize($filename);
        if (!is_file($filename) || (false === ($fp = @fopen($filename, 'a+'))))
            return false;
        fclose($fp);
        return true;
    }

/** Get the extension from filename
  * @param string $filename
  * @param bool $toLower
  * @return string */

    static function getExtension($filename, $toLower=true) {
        return preg_match('/^.*\.([^\.]*)$/s', $filename, $patt)
            ? ($toLower ? strtolower($patt[1]) : $patt[1]) : "";
    }

/** Get MIME type of the given filename. If Fileinfo PHP extension is
  * available the MIME type will be fetched by the file's content. The
  * second parameter is optional and defines the magic file path. If you
  * skip it, the default one will be loaded.
  * If Fileinfo PHP extension is not available the MIME type will be fetched
  * by filename extension regarding $MIME property. If the file extension
  * does not exist there, returned type will be application/octet-stream
  * @param string $filename
  * @param string $magic
  * @return string */

    static function getMimeType($filename, $magic=null) {
        if (class_exists("finfo")) {
            $finfo = new \finfo(FILEINFO_MIME, $magic);
            if ($finfo) {
                $mime = $finfo->file($filename);
                $mime = substr($mime, 0, strrpos($mime, ";"));
                return $mime;
            }
        }
        $ext = self::getExtension($filename, true);
        return isset(self::$MIME[$ext]) ? self::$MIME[$ext] : "application/octet-stream";
    }

/** Get inexistant filename based on the given filename. If you skip $dir
  * parameter the directory will be fetched from $filename and returned
  * value will be full filename path. The third parameter is optional and
  * defines the template, the filename will be renamed to. Default template
  * is {name}({sufix}){ext}. Examples:
  *
  *   file::getInexistantFilename("/my/directory/myfile.txt");
  *   If myfile.txt does not exist - returns the same path to the file
  *   otherwise returns "/my/directory/myfile(1).txt"
  *
  *   file::getInexistantFilename("myfile.txt", "/my/directory");
  *   returns "myfile.txt" or "myfile(1).txt" or "myfile(2).txt" etc...
  *
  *   file::getInexistantFilename("myfile.txt", "/dir", "{name}[{sufix}]{ext}");
  *   returns "myfile.txt" or "myfile[1].txt" or "myfile[2].txt" etc...
  *
  * @param string $filename
  * @param string $dir
  * @param string $tpl
  * @return string */

    static function getInexistantFilename($filename, $dir=null, $tpl=null) {
        if ($tpl === null)  $tpl = "{name}({sufix}){ext}";
        $fullPath = ($dir === null);
        if ($fullPath)
            $dir = path::normalize(dirname($filename));
        else {
            $fdir = dirname($filename);
            $dir = strlen($fdir)
                ? path::normalize("$dir/$fdir")
                : path::normalize($dir);
        }
        $filename = basename($filename);
        $ext = self::getExtension($filename, false);
        $name = strlen($ext) ? substr($filename, 0, -strlen($ext) - 1) : $filename;
        $tpl = str_replace('{name}', $name, $tpl);
        $tpl = str_replace('{ext}', (strlen($ext) ? ".$ext" : ""), $tpl);
        $i = 1; $file = "$dir/$filename";
        while (file_exists($file))
            $file = "$dir/" . str_replace('{sufix}', $i++, $tpl);

        return $fullPath
            ? $file
            : (strlen($fdir)
                ? "$fdir/" . basename($file)
                : basename($file));
    }

/** Normalize given filename. Accented characters becomes non-accented and
  * removes any other special characters. Usable for non-unicode filesystems
  * @param $filename
  * @return string */

    static function normalizeFilename($filename) {
        $string = htmlentities($filename, ENT_QUOTES, 'UTF-8');
        if (strpos($string, '&') !== false)
            $filename = html_entity_decode(preg_replace('~&([a-z]{1,2})(?:acute|cedil|circ|grave|lig|orn|ring|slash|tilde|uml);~i', '$1', $string), ENT_QUOTES, 'UTF-8');
        $filename = trim(preg_replace('~[^0-9a-z\.\- ]~i', "_", $filename));
        return $filename;
    }

}

?>