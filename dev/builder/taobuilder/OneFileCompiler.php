<?php
/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2015 (original work) Open Assessment Technologies SA (under the project TAO-PRODUCT);
 *
 */

/**
 * The compiler is complementary to the builder.
 *
 * It optimizes the ck package for TAO.
 * 1. reduce the plugin files to a minimum
 * 2. merge all required js files into a single one
 * 3. keep the TAO skin only
 *
 * @author Sam <sam@taotesting.com>
 */
class OneFileCompiler
{
    /**
     * The name of the main ckeditor js file
     */
    const CKFile = 'ckeditor.js';

    /**
     * The language the xkeditor will be compiled in
     * @var string
     */
    protected $lang = 'en';

    /**
     * The directory were the initial ck minified source is located
     * @var string
     */
    protected $basePath = '';

    /**
     * The directory were the compiled and optimized ck file will be
     * @var string
     */
    protected $outputPath = '';

    /**
     * The constructor
     *
     * @param string $basePath
     * @param string $outputPath
     * @param string $lang
     * @throws Exception when the basePath does not contain the main ckeditor.js file
     */
    public function __construct($basePath, $outputPath, $lang = 'en'){
        $this->lang = $lang;
        if(file_exists($basePath.self::CKFile)){
            $this->basePath = $basePath;
            $this->outputPath = $outputPath;
        }else{
            throw new Exception('no ckeditor found in base path '.$basePath.self::CKFile);
        }
    }

    /**
     * Append the content of the given file to the output ckeditor.js file
     *
     * @param string $file
     */
    protected function append($file){
        file_put_contents($this->outputPath.self::CKFile, PHP_EOL.file_get_contents($file), FILE_APPEND);
        $this->log($file);
    }

    /**
     * Some logging mechanism
     *
     * @param string $message
     */
    protected function log($message){
//        var_dump($message);
    }

    /**
     * Compile the core js files into the output ckeditor.js file
     */
    protected function compileCore(){
        $this->append($this->basePath.'lang/en.js');
        $this->append($this->basePath.'config.js');
        $this->append($this->basePath.'styles.js');
        $this->append($this->basePath.'adapters/jquery.js');
    }

    /**
     * Compile the plugin js files into the output ckeditor.js file
     * @param array $plugins the plugins to be compiled
     */
    protected function compilePlugins($plugins = array()){

        foreach($plugins as $plugin){

            $pluginFile = $this->basePath.'plugins/'.$plugin.'/plugin.js';
            if(file_exists($pluginFile)){
                $this->append($pluginFile);
            }

            foreach(glob($this->basePath.'plugins/'.$plugin.'/dialogs/*.js') as $dialog){
                $this->append($dialog);
            }

            $langFile = $this->basePath.'plugins/'.$plugin.'/lang/'.$this->lang.'.js';
            if(file_exists($langFile)){
                $this->append($langFile);
            }

            $langFile = $this->basePath.'plugins/'.$plugin.'/dialogs/lang/'.$this->lang.'.js';
            if(file_exists($langFile)){
                $this->append($langFile);
            }
        }
    }

    /**
     * Get the resources in the given directory recursively.
     * The resources are classified according the three types : js, css and img
     *
     * @param string $dirname
     * @param array $exclusions the folder or files to be excluded during directory scanning
     * @return array
     */
    protected function getDirectoryResources($dirname, $exclusions = array()){
        $files = array(
            'js' => array(),
            'css' => array(),
            'img' => array()
        );

        if(is_dir($dirname)){
            foreach(scandir($dirname) as $file){
                if($file == '.' || $file == '..' || in_array($file, $exclusions)){
                    continue;
                }
                $file = $dirname.$file;
                if(is_dir($file)){
                    $files = array_merge_recursive($files, $this->getDirectoryResources($file.'/'));
                }else{
                    if(substr($file, -3) == '.js'){
                        $files['js'][] = $file;
                    }else if(substr($file, -4) == '.css'){
                        $files['css'][] = $file;
                    }else if(preg_match('/(\.png|\.jpg)$/', $file)){
                        $files['img'][] = $file;
                    }
                }
            }
        }

        return $files;
    }

    /**
     * Get the resources for the plugins
     *
     * @param string $basePath
     * @param array $plugins
     * @return array
     */
    protected function getPluginsResources($basePath, $plugins = array()){
        $files = array();
        foreach($plugins as $plugin){
            $files = array_merge_recursive($files, $this->getDirectoryResources($basePath.'plugins/'.$plugin.'/'));
        }
        $files['img'][] = $basePath.'plugins/icons.png';
        $files['img'][] = $basePath.'plugins/icons_hidpi.png';
        return $files;
    }

    /**
     * Get the resources for the ck core
     *
     * @param string $basePath
     * @return array
     */
    protected function getCoreResources($basePath){
        $files = $this->getDirectoryResources($basePath.'skins/tao/', array('css')); //skip the css folder
        $files = array_merge_recursive($files, $this->getDirectoryResources($basePath.'adapters/'));
        $files['css'][] = $basePath.'contents.css';
        return $files;
    }

    /**
     * Prepare the compilation
     */
    protected function compileInit(){
        //init the compilation by copying the main ckeditor.js file into the destination path
        $this->copy($this->basePath.self::CKFile, $this->outputPath.self::CKFile);
    }

    /**
     * Finish the compilation
     *
     * @param array $plugins
     */
    protected function compileFinish($plugins = array()){

        //copy resource file to destination
        $resources = $this->getOriginalResources($plugins);
        foreach($resources['css'] as $resource){
            $this->copy($this->basePath.$resource, $this->outputPath.$resource);
        }
        foreach($resources['img'] as $resource){
            $this->copy($this->basePath.$resource, $this->outputPath.$resource);
        }

        //empty the icons in tao skin
        $this->copy($this->outputPath.'skins/tao/images/icons.png', $this->outputPath.'skins/tao/icons-hl.png');
        $this->copy($this->outputPath.'skins/tao/images/icons.png', $this->outputPath.'skins/tao/icons.png');
        $this->copy($this->outputPath.'skins/tao/images/icons.png', $this->outputPath.'skins/tao/icons_hidpi-hl.png');
        $this->copy($this->outputPath.'skins/tao/images/icons.png', $this->outputPath.'skins/tao/icons_hidpi.png');
        $this->copy($this->outputPath.'skins/tao/images/icons.png', $this->outputPath.'plugins/icons.png');
        $this->copy($this->outputPath.'skins/tao/images/icons.png', $this->outputPath.'plugins/icons_hidpi.png');
    }

    /**
     * Launch the compilation
     *
     * @param array $plugins
     */
    public function compile($plugins = array()){

        $this->compileInit();
        $this->compileCore();
        $this->compilePlugins($plugins);
        $this->compileFinish($plugins);
    }

    /**
     * Finish the compilation
     *
     * @param array $plugins
     */
    public function getOriginalResources($plugins){
        $resources = array_merge_recursive($this->getCoreResources($this->basePath), $this->getPluginsResources($this->basePath, $plugins));
        return array_map(function($file){
            return str_replace($this->basePath, '', $file);
        }, $resources);
    }

    /**
     * Finish the compilation
     *
     * @param array $plugins
     */
    public function getOutputResources($plugins){
        $resources = array_merge_recursive($this->getCoreResources($this->outputPath), $this->getPluginsResources($this->outputPath, $plugins));
        return array_map(function($file){
            return str_replace($this->outputPath, '', $file);
        }, $resources);
    }

    /**
     * Copy a file
     *
     * @param string $source
     * @param string $destination
     * @return boolean
     */
    protected function copy($source, $destination){

        if(!is_readable($source)){
            return false;
        }

        // Check for System File
        $basename = basename($source);
        if($basename[0] === '.'){
            return false;
        }

        // Simple copy for a file
        if(is_file($source)){
            // get path info of destination.
            $destInfo = pathinfo($destination);
            if(isset($destInfo['dirname']) && !is_dir($destInfo['dirname'])){
                if(!mkdir($destInfo['dirname'], 0777, true)){
                    return false;
                }
            }

            return copy($source, $destination);
        }else{
            //is_dir == true
            //
            // Make destination directory
            if(!is_dir($destination)){
                mkdir($destination, 0777, true);
            }

            // Loop through the folder
            $dir = dir($source);
            while(false !== $entry = $dir->read()){
                // Skip pointers
                if($entry === '.' || $entry === '..'){
                    continue;
                }

                // Deep copy directories
                return $this->copy("${source}/${entry}", "${destination}/${entry}");
            }

            // Clean up
            $dir->close();
            return true;
        }
    }

}
