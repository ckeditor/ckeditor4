<?php
$dir = dirname(__FILE__).'/';
require_once $dir.'taobuilder/OneFileCompiler.php';

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
    'taoqtitable',
    'taounderline',
    'taohighlight',
    'taoqtiinclude'
);

$one = new OneFileCompiler($dir.'release/ckeditor/', $dir.'release/ckeditor-reduced/', 'en');
$one->compile($plugins);
$res = $one->getOutputResources($plugins);
print_r(json_encode($res));
