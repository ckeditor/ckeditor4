<?php

/**
 * Another GeSHi example script
 *
 * Configure your Apache server with 'AcceptPathInfo true' and something like
 * 'Alias /viewmysource /var/www/geshi/contrib/aliased.php'. Don't forget
 * to protect this alias as necessary.
 *
 * Usage - visit /viewmysource/file.name.ext to see that file with syntax
 * highlighting, where "viewmysource" is the name of the alias you set up.
 * You can use this without an alias too, just by visiting
 * aliased.php/file.name.ext.
 *
 * @author  Ross Golder <ross@golder.org>
 * @version $Id: aliased.php 2533 2012-08-15 18:49:04Z benbe $
 */

// Your config here
define("SOURCE_ROOT", "/var/www/your/source/root/");

// Assume you've put geshi in the include_path already
require_once("geshi.php");

// Get path info
$path = SOURCE_ROOT.$_SERVER['PATH_INFO'];

// Check for dickheads trying to use '../' to get to sensitive areas
$base_path_len = strlen(SOURCE_ROOT);
$real_path = realpath($path);
if(strncmp($real_path, SOURCE_ROOT, $base_path_len)) {
    exit("Access outside acceptable path.");
}

// Check file exists
if(!file_exists($path)) {
    exit("File not found ($path).");
}

// Prepare GeSHi instance
$geshi = new GeSHi();
$geshi->set_language('text');
$geshi->load_from_file($path);
$geshi->set_header_type(GESHI_HEADER_PRE);
$geshi->enable_classes();
$geshi->enable_line_numbers(GESHI_FANCY_LINE_NUMBERS, 10);
$geshi->set_overall_style('color: #000066; border: 1px solid #d0d0d0; background-color: #f0f0f0;', true);
$geshi->set_line_style('font: normal normal 95% \'Courier New\', Courier, monospace; color: #003030;', 'font-weight: bold; color: #006060;', true);
$geshi->set_code_style('color: #000020;', 'color: #000020;');
$geshi->set_link_styles(GESHI_LINK, 'color: #000060;');
$geshi->set_link_styles(GESHI_HOVER, 'background-color: #f0f000;');
$geshi->set_header_content('Source code viewer - ' . $path . ' - ' . $geshi->get_language_name());
$geshi->set_header_content_style('font-family: Verdana, Arial, sans-serif; color: #808080; font-size: 70%; font-weight: bold; background-color: #f0f0ff; border-bottom: 1px solid #d0d0d0; padding: 2px;');
$geshi->set_footer_content('Parsed in <TIME> seconds,  using GeSHi <VERSION>');
$geshi->set_footer_content_style('font-family: Verdana, Arial, sans-serif; color: #808080; font-size: 70%; font-weight: bold; background-color: #f0f0ff; border-top: 1px solid #d0d0d0; padding: 2px;');

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <title>Source code viewer - <?php echo $path; ?> - <?php $geshi->get_language_name(); ?></title>
    <style type="text/css">
    <!--
    <?php
        // Output the stylesheet. Note it doesn't output the <style> tag
    echo $geshi->get_stylesheet();
    ?>
    html {
        background-color: #f0f0f0;
    }
    body {
        font-family: Verdana, Arial, sans-serif;
        margin: 10px;
        border: 2px solid #e0e0e0;
        background-color: #fcfcfc;
        padding: 5px;
    }
    h2 {
        margin: .1em 0 .2em .5em;
        border-bottom: 1px solid #b0b0b0;
        color: #b0b0b0;
        font-weight: normal;
        font-size: 150%;
    }
    h3 {
        margin: .1em 0 .2em .5em;
        color: #b0b0b0;
        font-weight: normal;
        font-size: 120%;
    }
    #footer {
        text-align: center;
        font-size: 80%;
        color: #a9a9a9;
    }
    #footer a {
        color: #9999ff;
    }
    textarea {
        border: 1px solid #b0b0b0;
        font-size: 90%;
        color: #333;
        margin-left: 20px;
    }
    select, input {
        margin-left: 20px;
    }
    p {
        font-size: 90%;
        margin-left: .5em;
    }
    -->
    </style>
</head>
<body>
<?php
// The fun part :)
echo $geshi->parse_code();
?>
<hr/>
</body>
</html>
