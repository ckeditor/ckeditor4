<?php

echo 'CONTENT_TYPE: ' . $_SERVER["CONTENT_TYPE"];

// If data are uploaded directly:
// $postdata = file_get_contents("php://input");
// echo "Name: " . $_SERVER['HTTP_X_FILE_NAME'] . "<br />";
// echo $postdata;


// If data are uploaded as form:
$uploaddir = './uploadedfiles/';
$uploadfile = $uploaddir . basename($_FILES['upload']['name']);

echo 'Here is some more debugging info:';
print_r($_FILES);

echo $uploadfile;

if (move_uploaded_file($_FILES['upload']['tmp_name'], $uploadfile)) {
    echo "File is valid, and was successfully uploaded.\n";
} else {
    echo "Possible file upload attack!\n";
}