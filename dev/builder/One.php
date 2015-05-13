<?php
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of one
 *
 * @author sam
 */
class One
{

    const CKFile = 'ckeditor.js';

    protected $lang = 'en';
    protected $basePath = '';
    protected $outputPath = '';

    public function __construct($basePath, $outputPath, $lang = 'en'){
        $this->lang = $lang;
        if(file_exists($basePath.self::CKFile)){
            $this->basePath = $basePath;
            $this->outputPath = $outputPath;
        }else{
            throw new Exception('no ckeditor found in base path '.$basePath.self::CKFile);
        }
    }

    protected function append($file){
        file_put_contents($this->outputPath.self::CKFile, PHP_EOL.file_get_contents($file), FILE_APPEND);
        $this->log($file);
    }

    protected function log($message){
//        var_dump($message);
    }

    protected function compileCore(){
        $this->append($this->basePath.'lang/en.js');
        $this->append($this->basePath.'config.js');
        $this->append($this->basePath.'styles.js');
        $this->append($this->basePath.'adapters/jquery.js');
    }

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

    protected function getDirectoryResources($dirname, $exclusions = array()){
        $files = array(
            'js' => array(),
            'css' => array(),
            'img' => array()
        );
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

        return $files;
    }

    protected function getPluginsResources($basePath, $plugins){
        $files = array();
        foreach($plugins as $plugin){
            $files = array_merge_recursive($files, $this->getDirectoryResources($basePath.'plugins/'.$plugin.'/'));
        }
        $files['img'][] = $basePath.'plugins/icons.png';
        $files['img'][] = $basePath.'plugins/icons_hidpi.png';
        return $files;
    }

    protected function getCoreResources($basePath){
        $files = array();
        $files = array_merge_recursive($files, $this->getDirectoryResources($basePath.'skins/tao/', array('scss', 'css'))); //skip scss and css folders
        $files = array_merge_recursive($files, $this->getDirectoryResources($basePath.'adapters/'));
        return $files;
    }

    protected function compileInit(){
        //init the compilation by copying the main ckeditor.js file into the destination path
        $this->copy($this->basePath.self::CKFile, $this->outputPath.self::CKFile);
    }

    protected function compileFinish($plugins){

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

    public function compile($plugins){

        $this->compileInit();
        $this->compileCore();
        $this->compilePlugins($plugins);
        $this->compileFinish($plugins);
    }

    public function getOriginalResources($plugins){
        $resources = array_merge_recursive($this->getCoreResources($this->basePath), $this->getPluginsResources($this->basePath, $plugins));
        return array_map(function($file){
            return str_replace($this->basePath, '', $file);
        }, $resources);
    }

    public function getOutputResources($plugins){
        $resources = array_merge_recursive($this->getCoreResources($this->outputPath), $this->getPluginsResources($this->outputPath, $plugins));
        return array_map(function($file){
            return str_replace($this->outputPath, '', $file);
        }, $resources);
    }

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
$plugins = array(
    'autogrow',
    'clipboard',
    'colordialog',
    'link',
    'magicline',
    'placeholder',
    'sourcedialog',
    'specialchar',
    'taoqtiimage',
    'taoqtimaths',
    'taoqtimedia',
    'taounderline',
    'taoqtiinclude'
);
$one = new One(dirname(__FILE__).'/release/ckeditor/', dirname(__FILE__).'/release/ckeditor-reduced/', 'en');
$one->compile($plugins);
$res = $one->getOutputResources($plugins);
var_dump($res);

