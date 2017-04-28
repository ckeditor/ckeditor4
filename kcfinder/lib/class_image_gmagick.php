<?php

/** This file is part of KCFinder project
  *
  *      @desc GraphicsMagick image driver class
  *   @package KCFinder
  *   @version 3.12
  *    @author Pavel Tzonkov <sunhater@sunhater.com>
  * @copyright 2010-2014 KCFinder Project
  *   @license http://opensource.org/licenses/GPL-3.0 GPLv3
  *   @license http://opensource.org/licenses/LGPL-3.0 LGPLv3
  *      @link http://kcfinder.sunhater.com
  */

namespace kcfinder;

class image_gmagick extends image {

    static $MIMES = array(
        //'tif' => "image/tiff"
    );


    // ABSTRACT PUBLIC METHODS

    public function resize($width, $height) {//
        if (!$width) $width = 1;
        if (!$height) $height = 1;
        try {
            $this->image->scaleImage($width, $height);
        } catch (\Exception $e) {
            return false;
        }
        $this->width = $width;
        $this->height = $height;
        return true;
    }

    public function resizeFit($width, $height, $background=false) {//
        if (!$width) $width = 1;
        if (!$height) $height = 1;

        try {
            $this->image->scaleImage($width, $height, true);
            $w = $this->image->getImageWidth();
            $h = $this->image->getImageHeight();
        } catch (\Exception $e) {
            return false;
        }

        if ($background === false) {
            $this->width = $w;
            $this->height = $h;
            return true;

        } else {
            try {
                $this->image->setImageBackgroundColor($background);
                $x = round(($width - $w) / 2);
                $y = round(($height - $h) / 2);
                $img = new \Gmagick();
                $img->newImage($width, $height, $background);
                $img->compositeImage($this->image, 1, $x, $y);
            } catch (\Exception $e) {
                return false;
            }
            $this->image = $img;
            $this->width = $width;
            $this->height = $height;
            return true;
        }
    }

    public function resizeCrop($width, $height, $offset=false) {
        if (!$width) $width = 1;
        if (!$height) $height = 1;

        if (($this->width / $this->height) > ($width / $height)) {
            $h = $height;
            $w = ($this->width * $h) / $this->height;
            $y = 0;
            if ($offset !== false) {
                if ($offset > 0)
                    $offset = -$offset;
                if (($w + $offset) <= $width)
                    $offset = $width - $w;
                $x = $offset;
            } else
                $x = ($width - $w) / 2;

        } else {
            $w = $width;
            $h = ($this->height * $w) / $this->width;
            $x = 0;
            if ($offset !== false) {
                if ($offset > 0)
                    $offset = -$offset;
                if (($h + $offset) <= $height)
                    $offset = $height - $h;
                $y = $offset;
            } else
                $y = ($height - $h) / 2;
        }

        $x = round($x);
        $y = round($y);
        $w = round($w);
        $h = round($h);
        if (!$w) $w = 1;
        if (!$h) $h = 1;

        try {
            $this->image->scaleImage($w, $h);
            $this->image->cropImage($width, $height, -$x, -$y);
        } catch (\Exception $e) {
            return false;
        }

        $this->width = $width;
        $this->height = $height;
        return true;
    }

    public function rotate($angle, $background="#000000") {
        try {
            $this->image->rotateImage($background, $angle);
            $w = $this->image->getImageWidth();
            $h = $this->image->getImageHeight();
        } catch (\Exception $e) {
            return false;
        }
        $this->width = $w;
        $this->height = $h;
        return true;
    }

    public function flipHorizontal() {
        try {
            $this->image->flopImage();
        } catch (\Exception $e) {
            return false;
        }
        return true;
    }

    public function flipVertical() {
        try {
            $this->image->flipImage();
        } catch (\Exception $e) {
            return false;
        }
        return true;
    }

    public function watermark($file, $left=false, $top=false) {
        try {
            $wm = new \Gmagick($file);
            $w = $wm->getImageWidth();
            $h = $wm->getImageHeight();
        } catch (\Exception $e) {
            return false;
        }

        $x =
            ($left === true) ? 0 : (
            ($left === null) ? round(($this->width - $w) / 2) : (
            (($left === false) || !preg_match('/^\d+$/', $left)) ? ($this->width - $w) : $left));
        $y =
            ($top === true) ? 0 : (
            ($top === null) ? round(($this->height - $h) / 2) : (
            (($top === false) || !preg_match('/^\d+$/', $top)) ? ($this->height - $h) : $top));

        if ((($x + $w) > $this->width) ||
            (($y + $h) > $this->height) ||
            ($x < 0) || ($y < 0)
        )
            return false;

        try {
            $this->image->compositeImage($wm, 1, $x, $y);
        } catch (\Exception $e) {
            return false;
        }
        return true;
    }


    // ABSTRACT PROTECTED METHODS

    protected function getBlankImage($width, $height) {
        try {
            $img = new \Gmagick();
            $img->newImage($width, $height, "none");
        } catch (\Exception $e) {
            return false;
        }
        return $img;
    }

    protected function getImage($image, &$width, &$height) {

        if (is_object($image) && ($image instanceof image_gmagick)) {
            $width = $image->width;
            $height = $image->height;
            return $image->image;

        } elseif (is_object($image) && ($image instanceof \Gmagick)) {
            try {
                $w = $image->getImageWidth();
                $h = $image->getImageHeight();
            } catch (\Exception $e) {
                return false;
            }
            $width = $w;
            $height = $h;
            return $image;

        } elseif (is_string($image)) {
            try {
                $image = new \Gmagick($image);
                $w = $image->getImageWidth();
                $h = $image->getImageHeight();
            } catch (\Exception $e) {
                return false;
            }
            $width = $w;
            $height = $h;
            return $image;

        } else
            return false;
    }


    // PSEUDO-ABSTRACT STATIC METHODS

    static function available() {
        return class_exists("Gmagick");
    }

    static function checkImage($file) {
        try {
            $img = new \Gmagick($file);
        } catch (\Exception $e) {
            return false;
        }
        return true;
    }


    // INHERIT METHODS

    public function output($type="jpeg", array $options=array()) {
        $type = strtolower($type);
        try {
            $this->image->setImageFormat($type);
        } catch (\Exception $e) {
            return false;
        }
        $method = "optimize_$type";
        if (method_exists($this, $method) && !$this->$method($options))
            return false;

        if (!isset($options['file'])) {
            if (!headers_sent()) {
                $mime = isset(self::$MIMES[$type]) ? self::$MIMES[$type] : "image/$type";
                header("Content-Type: $mime");
            }
            echo $this->image;

        } else {
            $file = $options['file'] . ".$type";
            try {
                $this->image->writeImage($file);
            } catch (\Exception $e) {
                @unlink($file);
                return false;
            }

            if (!@rename($file, $options['file'])) {
                @unlink($file);
                return false;
            }
        }

        return true;
    }


    // OWN METHODS

    protected function optimize_jpeg(array $options=array()) {
        $quality = isset($options['quality']) ? $options['quality'] : self::DEFAULT_JPEG_QUALITY;
        try {
            $this->image->setCompressionQuality($quality);
        } catch (\Exception $e) {
            return false;
        }
        return true;
    }

}

?>