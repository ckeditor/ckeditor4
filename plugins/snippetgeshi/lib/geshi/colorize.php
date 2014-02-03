<?php

include_once 'geshi.php';

$json_string = file_get_contents( 'php://input' );
$json_object = json_decode( $json_string );

$geshi = new GeSHi( $json_object->html, $json_object->lang );

echo $geshi->parse_code();