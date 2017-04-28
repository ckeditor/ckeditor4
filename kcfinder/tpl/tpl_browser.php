<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>KCFinder: /<?php echo $this->session['dir'] ?></title>
<link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
<?php INCLUDE "tpl/tpl_css.php" ?>
<?php INCLUDE "tpl/tpl_javascript.php" ?>
</head>
<body>
<div id="resizer"></div>
<div id="menu"></div>
<div id="clipboard"></div>
<div id="all">

<div id="left">
    <div id="folders"></div>
</div>

<div id="right">

    <div id="toolbar">
        <div>
        <a href="kcact:upload"><span><?php echo $this->label("Upload") ?></span></a>
        <a href="kcact:refresh"><span><?php echo $this->label("Refresh") ?></span></a>
        <a href="kcact:settings"><span><?php echo $this->label("Settings") ?></span></a>
        <a href="kcact:maximize"><span><?php echo $this->label("Maximize") ?></span></a>
        <a href="kcact:about"><span><?php echo $this->label("About") ?></span></a>
        <div id="loading"></div>
        </div>
    </div>

    <div id="settings">

    <div>
    <fieldset>
    <legend><?php echo $this->label("View:") ?></legend>
        <table summary="view" id="view"><tr>
        <th><input id="viewThumbs" type="radio" name="view" value="thumbs" /></th>
        <td><label for="viewThumbs">&nbsp;<?php echo $this->label("Thumbnails") ?></label> &nbsp;</td>
        <th><input id="viewList" type="radio" name="view" value="list" /></th>
        <td><label for="viewList">&nbsp;<?php echo $this->label("List") ?></label></td>
        </tr></table>
    </fieldset>
    </div>

    <div>
    <fieldset>
    <legend><?php echo $this->label("Show:") ?></legend>
        <table summary="show" id="show"><tr>
        <th><input id="showName" type="checkbox" name="name" /></th>
        <td><label for="showName">&nbsp;<?php echo $this->label("Name") ?></label> &nbsp;</td>
        <th><input id="showSize" type="checkbox" name="size" /></th>
        <td><label for="showSize">&nbsp;<?php echo $this->label("Size") ?></label> &nbsp;</td>
        <th><input id="showTime" type="checkbox" name="time" /></th>
        <td><label for="showTime">&nbsp;<?php echo $this->label("Date") ?></label></td>
        </tr></table>
    </fieldset>
    </div>

    <div>
    <fieldset>
    <legend><?php echo $this->label("Order by:") ?></legend>
        <table summary="order" id="order"><tr>
        <th><input id="sortName" type="radio" name="sort" value="name" /></th>
        <td><label for="sortName">&nbsp;<?php echo $this->label("Name") ?></label> &nbsp;</td>
        <th><input id="sortType" type="radio" name="sort" value="type" /></th>
        <td><label for="sortType">&nbsp;<?php echo $this->label("Type") ?></label> &nbsp;</td>
        <th><input id="sortSize" type="radio" name="sort" value="size" /></th>
        <td><label for="sortSize">&nbsp;<?php echo $this->label("Size") ?></label> &nbsp;</td>
        <th><input id="sortTime" type="radio" name="sort" value="date" /></th>
        <td><label for="sortTime">&nbsp;<?php echo $this->label("Date") ?></label> &nbsp;</td>
        <th><input id="sortOrder" type="checkbox" name="desc" /></th>
        <td><label for="sortOrder">&nbsp;<?php echo $this->label("Descending") ?></label></td>
        </tr></table>
    </fieldset>
    </div>

    </div>

    <div id="files">
        <div id="content"></div>
    </div>
</div>
<div id="status"><span id="fileinfo">&nbsp;</span></div>
</div>
</body>
</html>
