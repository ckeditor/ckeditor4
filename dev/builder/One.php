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

    public function __construct($basePath, $lang = 'en'){
        $this->lang = $lang;
        if(file_exists($basePath.'ckeditor.js')){
            $this->basePath = $basePath;
        }else{
            throw new Exception('no ckeditor found in base path '.$basePath.'ckeditor.js');
        }
    }

    protected function append($file){
        file_put_contents($this->basePath.self::CKFile, PHP_EOL.file_get_contents($file), FILE_APPEND);
        $this->log($file);
    }

    protected function log($message){
//        var_dump($message);
    }

    protected function backup(){
        $bakDir = $this->basePath.'bak/';

        if(!is_dir($bakDir)){
            mkdir($bakDir);
        }

        if(file_exists($bakDir.self::CKFile)){
            copy($bakDir.self::CKFile, $this->basePath.self::CKFile);
        }else{
            copy($this->basePath.self::CKFile, $bakDir.self::CKFile);
        }
    }

    protected function compileCore(){
        $this->append($this->basePath.'lang/en.js');
        $this->append($this->basePath.'config.js');
        $this->append($this->basePath.'styles.js');
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

    protected function getResources($dirname){
        $files = array(
            'js' => array(),
            'css' => array(),
            'img' => array()
        );
        foreach(scandir($dirname) as $file){
            if($file == '.' || $file == '..'){
                continue;
            }
            $file = $dirname .$file;
            if(is_dir($file)){
                $files = array_merge_recursive($files, $this->getResources($file.'/'));
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

    public function getPluginsResources($plugins){
        $files = array();
        foreach($plugins as $plugin){
            $files = array_merge_recursive($files, $this->getResources($this->basePath.'plugins/'.$plugin.'/'));
        }
        return $files;
    }

    public function compile($plugins){
        $this->backup();
        $this->compileCore();
        $this->compilePlugins($plugins);
    }

}
$plugins = array(
    'autogrow',
    'link',
    'clipboard',
    'specialchar'
);
$one = new One(dirname(__FILE__).'/release/ckeditor/', 'en');
$one->compile($plugins);
$res = $one->getPluginsResources($plugins);
var_dump($res);

