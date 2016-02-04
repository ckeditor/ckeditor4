<?php

/** This file is part of KCFinder project
  *
  *      @desc Load language labels into JavaScript
  *   @package KCFinder
  *   @version 3.12
  *    @author Pavel Tzonkov <sunhater@sunhater.com>
  * @copyright 2010-2014 KCFinder Project
  *   @license http://opensource.org/licenses/GPL-3.0 GPLv3
  *   @license http://opensource.org/licenses/LGPL-3.0 LGPLv3
  *      @link http://kcfinder.sunhater.com
  */

namespace kcfinder;
require "core/autoload.php";

if (!isset($_GET['lng']) || ($_GET['lng'] == 'en') ||
    ($_GET['lng'] != basename($_GET['lng'])) ||
    !is_file("lang/" . $_GET['lng'] . ".php")
) {
    header("Content-Type: text/javascript");
    die;
}

$file = "lang/" . $_GET['lng'] . ".php";
$mtime = @filemtime($file);

if ($mtime)
    httpCache::checkMTime($mtime, "Content-Type: text/javascript");

require $file;
header("Content-Type: text/javascript");

echo "_.labels={";

$i = 0;
foreach ($lang as $english => $native) {
    if (substr($english, 0, 1) != "_") {
        echo "'" . text::jsValue($english) . "':\"" . text::jsValue($native) . "\"";
        if (++$i < count($lang))
            echo ",";
    }
}

echo "}";

?>
