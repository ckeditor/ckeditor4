<?php

/** This file is part of KCFinder project
  *
  *      @desc Abstract image driver class
  *   @package KCFinder
  *   @version 3.12
  *    @author Pavel Tzonkov <sunhater@sunhater.com>
  * @copyright 2010-2014 KCFinder Project
  *   @license http://opensource.org/licenses/GPL-3.0 GPLv3
  *   @license http://opensource.org/licenses/LGPL-3.0 LGPLv3
  *      @link http://kcfinder.sunhater.com
  */

namespace kcfinder;

abstract class image {
    const DEFAULT_JPEG_QUALITY = 75;

/** Image resource or object
  * @var mixed */
    protected $image;

/** Image width in pixels
  * @var integer */
    protected $width;

/** Image height in pixels
  * @var integer */
    protected $height;

/** Init error
  * @var bool */
    protected $initError = false;

/** Driver specific options
  * @var array */
    protected $options = array();


/** Magic method which allows read-only access to all protected or private
  * class properties
  * @param string $property
  * @return mixed */

    final public function __get($property) {
        return property_exists($this, $property) ? $this->$property : null;
    }


/** Constructor. Parameter $image should be:
  *   1. An instance of image driver class (copy instance).
  *   2. An image represented by the type of the $image property
  *      (resource or object).
  *   3. An array with two elements. First - width, second - height.
  *      Creates a blank image.
  *   4. A filename string. Get image form file.
  * Second paramaeter is used by pass some specific image driver options
  * @param mixed $image
  * @param array $options */

    public function __construct($image, array $options=array()) {
        $this->image = $this->width = $this->height = null;
        $imageDetails = $this->buildImage($image);

        if ($imageDetails !== false)
            list($this->image, $this->width, $this->height) = $imageDetails;
        else
            $this->initError = true;
        $this->options = $options;
    }


/** Factory pattern to load selected driver. $image and $options are passed
  * to the constructor of the image driver
  * @param string $driver
  * @param mixed $image
  * @return object */

    final static function factory($driver, $image, array $options=array()) {
        $class = __NAMESPACE__ . "\\image_$driver";
        return new $class($image, $options);
    }


/** Checks if the drivers in the array parameter could be used. Returns first
  * found one
  * @param array $drivers
  * @return string */

    final static function getDriver(array $drivers=array('gd')) {
        foreach ($drivers as $driver) {
            if (!preg_match('/^[a-z0-9\_]+$/i', $driver))
                continue;
            $class = __NAMESPACE__ . "\\image_$driver";
            if (class_exists($class) && method_exists($class, "available")) {
                eval("\$avail = $class::available();");
                if ($avail) return $driver;
            }
        }
        return false;
    }


/** Returns an array. Element 0 - image resource. Element 1 - width. Element 2 - height.
  * Returns FALSE on failure.
  * @param mixed $image
  * @return array */

    final protected function buildImage($image) {
        $class = get_class($this);

        if ($image instanceof $class) {
            $width = $image->width;
            $height = $image->height;
            $img = $image->image;

        } elseif (is_array($image)) {
            list($key, $width) = each($image);
            list($key, $height) = each($image);
            $img = $this->getBlankImage($width, $height);

        } else
            $img = $this->getImage($image, $width, $height);

        return ($img !== false)
            ? array($img, $width, $height)
            : false;
    }


/** Returns calculated proportional width from the given height
  * @param integer $resizedHeight
  * @return integer */

    final public function getPropWidth($resizedHeight) {
        $width = round(($this->width * $resizedHeight) / $this->height);
        if (!$width) $width = 1;
        return $width;
    }


/** Returns calculated proportional height from the given width
  * @param integer $resizedWidth
  * @return integer */

    final public function getPropHeight($resizedWidth) {
        $height = round(($this->height * $resizedWidth) / $this->width);
        if (!$height) $height = 1;
        return $height;
    }


/** Checks if PHP needs some extra extensions to use the image driver. This
  * static method should be implemented into driver classes like abstract
  * methods
  * @return bool */
    static function available() { return false; }

/** Checks if file is an image. This static method should be implemented into
  * driver classes like abstract methods
  * @param string $file
  * @return bool */
    static function checkImage($file) { return false; }

/** Resize image. Should return TRUE on success or FALSE on failure
  * @param integer $width
  * @param integer $height
  * @return bool */
    abstract public function resize($width, $height);

/** Resize image to fit in given resolution. Should returns TRUE on success
  * or FALSE on failure. If $background is set, the image size will be
  * $width x $height and the empty spaces (if any) will be filled with defined
  * color. Background color examples: "#5f5", "#ff67ca", array(255, 255, 255)
  * @param integer $width
  * @param integer $height
  * @param mixed $background
  * @return bool */
    abstract public function resizeFit($width, $height, $background=false);

/** Resize and crop the image to fit in given resolution. Returns TRUE on
  * success or FALSE on failure
  * @param mixed $src
  * @param integer $offset
  * @return bool */
    abstract public function resizeCrop($width, $height, $offset=false);


/** Rotate image
  * @param integer $angle
  * @param string $background
  * @return bool */
    abstract public function rotate($angle, $background="#000000");

    abstract public function flipHorizontal();

    abstract public function flipVertical();

/** Apply a PNG or GIF watermark to the image. $top and $left parameters sets
  * the offset of the watermark in pixels. Boolean and NULL values are possible
  * too. In default case (FALSE, FALSE) the watermark should be applyed to
  * the bottom right corner. NULL values means center aligning. If the
  * watermark is bigger than the image or it's partialy or fully outside the
  * image, it shoudn't be applied
  * @param string $file
  * @param mixed $top
  * @param mixed $left
  * @return bool */
    abstract public function watermark($file, $left=false, $top=false);

/** Should output the image. Second parameter is used to pass some options like
  *   'file' - if is set, the output will be written to a file
  *   'quality' - compression quality
  * It's possible to use extra specific options required by image type ($type)
  * @param string $type
  * @param array $options
  * @return bool */
    abstract public function output($type='jpeg', array $options=array());

/** This method should create a blank image with selected size. Should returns
  * resource or object related to the created image, which will be passed to
  * $image property
  * @param integer $width
  * @param integer $height
  * @return mixed */
    abstract protected function getBlankImage($width, $height);

/** This method should create an image from source image. Only first parameter
  * ($image) is input. Its type should be filename string or a type of the
  * $image property. See the constructor reference for details. The
  * parametters $width and $height are output only. Should returns resource or
  * object related to the created image, which will be passed to $image
  * property
  * @param mixed $image
  * @param integer $width
  * @param integer $height
  * @return mixed */
    abstract protected function getImage($image, &$width, &$height);

}

?>