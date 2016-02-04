<?php

/** This file is part of KCFinder project
  *
  *      @desc Path helper class
  *   @package KCFinder
  *   @version 3.12
  *    @author Pavel Tzonkov <sunhater@sunhater.com>
  * @copyright 2010-2014 KCFinder Project
  *   @license http://opensource.org/licenses/GPL-3.0 GPLv3
  *   @license http://opensource.org/licenses/LGPL-3.0 LGPLv3
  *      @link http://kcfinder.sunhater.com
  */

namespace kcfinder;

class path {

/** Get the absolute URL path of the given one. Returns FALSE if the URL
  * is not valid or the current directory cannot be resolved (getcwd())
  * @param string $path
  * @return string */

    static function rel2abs_url($path) {
        if (substr($path, 0, 1) == "/") return $path;
        $dir = @getcwd();

        if (!isset($_SERVER['DOCUMENT_ROOT']) || ($dir === false))
            return false;

        $dir = self::normalize($dir);
        $doc_root = self::normalize($_SERVER['DOCUMENT_ROOT']);

        if (substr($dir, 0, strlen($doc_root)) != $doc_root)
            return false;

        $return = self::normalize(substr($dir, strlen($doc_root)) . "/$path");
        if (substr($return, 0, 1) !== "/")
            $return = "/$return";

        return $return;
    }

/** Resolve full filesystem path of given URL. Returns FALSE if the URL
  * cannot be resolved
  * @param string $url
  * @return string */

    static function url2fullPath($url) {
        $url = self::normalize($url);

        $uri = isset($_SERVER['SCRIPT_NAME'])
            ? $_SERVER['SCRIPT_NAME'] : (isset($_SERVER['PHP_SELF'])
            ? $_SERVER['PHP_SELF']
            : false);

        $uri = self::normalize($uri);

        if (substr($url, 0, 1) !== "/") {
            if ($uri === false) return false;
            $url = dirname($uri) . "/$url";
        }

        if (isset($_SERVER['DOCUMENT_ROOT'])) {
            return self::normalize($_SERVER['DOCUMENT_ROOT'] . "/$url");

        } else {
            if ($uri === false) return false;

            if (isset($_SERVER['SCRIPT_FILENAME'])) {
                $scr_filename = self::normalize($_SERVER['SCRIPT_FILENAME']);
                return self::normalize(substr($scr_filename, 0, -strlen($uri)) . "/$url");
            }

            $count = count(explode('/', $uri)) - 1;
            for ($i = 0, $chdir = ""; $i < $count; $i++)
                $chdir .= "../";
            $chdir = self::normalize($chdir);

            $dir = getcwd();
            if (($dir === false) || !@chdir($chdir))
                return false;
            $rdir = getcwd();
            chdir($dir);
            return ($rdir !== false) ? self::normalize($rdir . "/$url") : false;
        }
    }

/** Normalize the given path. On Windows servers backslash will be replaced
  * with slash. Removes unnecessary double slashes and double dots. Removes
  * last slash if it exists. Examples:
  * path::normalize("C:\\any\\path\\") returns "C:/any/path"
  * path::normalize("/your/path/..//home/") returns "/your/home"
  * @param string $path
  * @return string */

    static function normalize($path) {

        // Backslash to slash convert
        if (strtoupper(substr(PHP_OS, 0, 3)) == "WIN") {
            $path = preg_replace('/([^\\\])\\\+([^\\\])/s', "$1/$2", $path);
            if (substr($path, -1) == "\\") $path = substr($path, 0, -1);
            if (substr($path, 0, 1) == "\\") $path = "/" . substr($path, 1);
        }

        $path = preg_replace('/\/+/s', "/", $path);

        $path = "/$path";
        if (substr($path, -1) != "/")
            $path .= "/";

        $expr = '/\/([^\/]{1}|[^\.\/]{2}|[^\/]{3,})\/\.\.\//s';
        while (preg_match($expr, $path))
            $path = preg_replace($expr, "/", $path);

        $path = substr($path, 0, -1);
        $path = substr($path, 1);
        return $path;
    }

/** Encode URL Path
  * @param string $path
  * @return string */

    static function urlPathEncode($path) {
        $path = self::normalize($path);
        $encoded = "";
        foreach (explode("/", $path) as $dir)
            $encoded .= rawurlencode($dir) . "/";
        $encoded = substr($encoded, 0, -1);
        return $encoded;
    }

/** Decode URL Path
  * @param string $path
  * @return string */

    static function urlPathDecode($path) {
        $path = self::normalize($path);
        $decoded = "";
        foreach (explode("/", $path) as $dir)
            $decoded .= rawurldecode($dir) . "/";
        $decoded = substr($decoded, 0, -1);
        return $decoded;
    }

}

?>