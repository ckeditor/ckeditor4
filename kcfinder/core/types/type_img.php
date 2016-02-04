<?php

/** This file is part of KCFinder project
  *
  *      @desc Image detection class
  *   @package KCFinder
  *   @version 3.12
  *    @author Pavel Tzonkov <sunhater@sunhater.com>
  * @copyright 2010-2014 KCFinder Project
  *   @license http://opensource.org/licenses/GPL-3.0 GPLv3
  *   @license http://opensource.org/licenses/LGPL-3.0 LGPLv3
  *      @link http://kcfinder.sunhater.com
  */

namespace kcfinder;

class type_img {

    public function checkFile($file, array $config) {

        $driver = isset($config['imageDriversPriority'])
            ? image::getDriver(explode(" ", $config['imageDriversPriority'])) : "gd";

        $img = image::factory($driver, $file);

        if ($img->initError)
            return "Unknown image format/encoding.";

        return true;
    }
}

?>