<?php

/** This file is part of KCFinder project
  *
  *      @desc ImageMagick image driver class
  *   @package KCFinder
  *   @version 3.12
  *    @author Pavel Tzonkov <sunhater@sunhater.com>
  * @copyright 2010-2014 KCFinder Project
  *   @license http://opensource.org/licenses/GPL-3.0 GPLv3
  *   @license http://opensource.org/licenses/LGPL-3.0 LGPLv3
  *      @link http://kcfinder.sunhater.com
  */

namespace kcfinder;

class image_imagick extends image {

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
            $size = $this->image->getImageGeometry();
        } catch (\Exception $e) {
            return false;
        }

        if ($background === false) {
            $this->width = $size['width'];
            $this->height = $size['height'];
            return true;

        } else {
            try {
                $this->image->setImageBackgroundColor($background);
                $x = -round(($width - $size['width']) / 2);
                $y = -round(($height - $size['height']) / 2);
                $this->image->extentImage($width, $height, $x, $y);
            } catch (\Exception $e) {
                return false;
            }
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
            $this->image->rotateImage(new \ImagickPixel($background), $angle);
            $size = $this->image->getImageGeometry();
        } catch (\Exception $e) {
            return false;
        }
        $this->width = $size['width'];
        $this->height = $size['height'];
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
            $wm = new \Imagick($file);
            $size = $wm->getImageGeometry();
        } catch (\Exception $e) {
            return false;
        }

        $w = $size['width'];
        $h = $size['height'];
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
            $this->image->compositeImage($wm, \Imagick::COMPOSITE_DEFAULT, $x, $y);
        } catch (\Exception $e) {
            return false;
        }
        return true;
    }


    // ABSTRACT PROTECTED METHODS

    protected function getBlankImage($width, $height) {
        try {
            $img = new \Imagick();
            $img->newImage($width, $height, "none");
            $img->setImageCompressionQuality(100);
        } catch (\Exception $e) {
            return false;
        }
        return $img;
    }

    protected function getImage($image, &$width, &$height) {

        if (is_object($image) && ($image instanceof image_imagick)) {
            try {
                $image->image->setImageCompressionQuality(100);
            } catch (\Exception $e) {
                return false;
            }
            $width = $image->width;
            $height = $image->height;
            return $image->image;

        } elseif (is_object($image) && ($image instanceof \Imagick)) {
            try {
                $image->setImageCompressionQuality(100);
                $size = $image->getImageGeometry();
            } catch (\Exception $e) {
                return false;
            }
            $width = $size['width'];
            $height = $size['height'];
            return $image;

        } elseif (is_string($image)) {
            try {
                $image = new \Imagick($image);
                $image->setImageCompressionQuality(100);
                $size = $image->getImageGeometry();
            } catch (\Exception $e) {
                return false;
            }
            $width = $size['width'];
            $height = $size['height'];
            return $image;

        } else
            return false;
    }


    // PSEUDO-ABSTRACT STATIC METHODS

    static function available() {
        return class_exists("\\Imagick");
    }

    static function checkImage($file) {
        try {
            $img = new \Imagick($file);
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
            $this->image->setImageCompression(\Imagick::COMPRESSION_JPEG);
            $this->image->setImageCompressionQuality($quality);
        } catch (\Exception $e) {
            return false;
        }
        return true;
    }

}

?>