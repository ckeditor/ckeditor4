<?php

namespace kcfinder;

chdir("..");
chdir("..");
require "core/autoload.php";
$theme = basename(dirname(__FILE__));
$min = new minifier("css");
$min->minify("cache/theme_$theme.css");

?>