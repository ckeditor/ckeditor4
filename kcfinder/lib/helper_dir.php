<?php

/** This file is part of KCFinder project
  *
  *      @desc Directory helper class
  *   @package KCFinder
  *   @version 3.12
  *    @author Pavel Tzonkov <sunhater@sunhater.com>
  * @copyright 2010-2014 KCFinder Project
  *   @license http://opensource.org/licenses/GPL-3.0 GPLv3
  *   @license http://opensource.org/licenses/LGPL-3.0 LGPLv3
  *      @link http://kcfinder.sunhater.com
  */

namespace kcfinder;

class dir {

/** Checks if the given directory is really writable. The standard PHP
  * function is_writable() does not work properly on Windows servers
  * @param string $dir
  * @return bool */

    static function isWritable($dir) {
        $dir = path::normalize($dir);
        if (!is_dir($dir))
            return false;
        $i = 0;
        do {
            $file = "$dir/is_writable_" . md5($i++);
        } while (file_exists($file));
        if (!@touch($file))
            return false;
        unlink($file);
        return true;
    }

/** Recursively delete the given directory. Returns TRUE on success.
  * If $firstFailExit parameter is true (default), the method returns the
  * path to the first failed file or directory which cannot be deleted.
  * If $firstFailExit is false, the method returns an array with failed
  * files and directories which cannot be deleted. The third parameter
  * $failed is used for internal use only.
  * @param string $dir
  * @param bool $firstFailExit
  * @param array $failed
  * @return mixed */

    static function prune($dir, $firstFailExit=true, array $failed=null) {
        if ($failed === null) $failed = array();
        $files = self::content($dir);
        if ($files === false) {
            if ($firstFailExit)
                return $dir;
            $failed[] = $dir;
            return $failed;
        }

        foreach ($files as $file) {
            if (is_dir($file)) {
                $failed_in = self::prune($file, $firstFailExit, $failed);
                if ($failed_in !== true) {
                    if ($firstFailExit)
                        return $failed_in;
                    if (is_array($failed_in))
                        $failed = array_merge($failed, $failed_in);
                    else
                        $failed[] = $failed_in;
                }
            } elseif (!@unlink($file)) {
                if ($firstFailExit)
                    return $file;
                $failed[] = $file;
            }
        }

        if (!@rmdir($dir)) {
            if ($firstFailExit)
                return $dir;
            $failed[] = $dir;
        }

        return count($failed) ? $failed : true;
    }

/** Get the content of the given directory. Returns an array with filenames
  * or FALSE on failure
  * @param string $dir
  * @param array $options
  * @return mixed */

    static function content($dir, array $options=null) {

        $defaultOptions = array(
            'types' => "all",   // Allowed: "all" or possible return values
                                // of filetype(), or an array with them
            'addPath' => true,  // Whether to add directory path to filenames
            'pattern' => '/./', // Regular expression pattern for filename
            'followLinks' => true
        );

        if (!is_dir($dir) || !is_readable($dir))
            return false;

        if (strtoupper(substr(PHP_OS, 0, 3)) == "WIN")
            $dir = str_replace("\\", "/", $dir);
        $dir = rtrim($dir, "/");

        $dh = @opendir($dir);
        if ($dh === false)
            return false;

        if ($options === null)
            $options = $defaultOptions;

        foreach ($defaultOptions as $key => $val)
            if (!isset($options[$key]))
                $options[$key] = $val;

        $files = array();
        while (($file = @readdir($dh)) !== false) {

            if (($file == '.') || ($file == '..') ||
                !preg_match($options['pattern'], $file)
            )
                continue;

            $fullpath = "$dir/$file";
            $type = filetype($fullpath);

            // If file is a symlink, get the true type of its destination
            if ($options['followLinks'] && ($type == "link"))
                $type = filetype(realpath($fullpath));

            if (($options['types'] === "all") || ($type === $options['types']) ||
                (is_array($options['types']) && in_array($type, $options['types']))
            )
                $files[] = $options['addPath'] ? $fullpath : $file;
        }
        closedir($dh);
        usort($files, array(__NAMESPACE__ . "\\dir", "fileSort"));
        return $files;
    }

    static function fileSort($a, $b) {
        if (function_exists("mb_strtolower")) {
            $a = mb_strtolower($a);
            $b = mb_strtolower($b);
        } else {
            $a = strtolower($a);
            $b = strtolower($b);
        }
        if ($a == $b) return 0;
        return ($a < $b) ? -1 : 1;
    }
}

?>