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
    public function __construct($basePath){
        if(file_exists($basePath.'ckeditor.js')){
            $this->basePath = $basePath;
        }else{
            throw new Exception('no ckeditor found in base path '.$basePath.'ckeditor.js');
        }
    }
    
    protected function append($file){
        $ckFile = 'ckeditor.js';
        file_put_contents($this->basePath.$ckFile, PHP_EOL.file_get_contents($file),  FILE_APPEND );
        $this->log($file);
    }
    
    protected function log($message){
        var_dump($message);
    }
    
    public function compilePlugins($plugins = array()){
        
        $lang = 'en';
        $ckFile = 'ckeditor.js';
        $bakDir = $this->basePath.'bak/';
        
        if(!is_dir($bakDir)){
            mkdir($bakDir);
        }
        
        if(file_exists($bakDir.$ckFile)){
            copy($bakDir.$ckFile, $this->basePath.$ckFile);
        }else{
            copy($this->basePath.$ckFile, $bakDir.$ckFile);
        }
        
        foreach($plugins as $plugin){
            
            $pluginFile = $this->basePath.'plugins/'.$plugin.'/plugin.js';
            if(file_exists($pluginFile)){
                 $this->append($pluginFile);
            }
            
            foreach(glob($this->basePath.'plugins/'.$plugin.'/dialogs/*.js') as $dialog){
                $this->append($dialog);
            }
            
            $langFile = $this->basePath.'plugins/'.$plugin.'/lang/'.$lang.'.js';
            if(file_exists($langFile)){
                $this->append($langFile);
            }
            
            $langFile = $this->basePath.'plugins/'.$plugin.'/dialogs/lang/'.$lang.'.js';
            if(file_exists($langFile)){
                $this->append($langFile);
            }
            
        }
    }
}

$one = new One(dirname(__FILE__).'/release/ckeditor/');
$one->compilePlugins(array(
    'autogrow',
    'link', 
    'clipboard',
    'specialchar'
    ));

