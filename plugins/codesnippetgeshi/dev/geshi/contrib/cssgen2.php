<?php
/**
 *  A simple script which outputs the CSS classes for all languages
 *  supported by GeSHi. You can access it directly to download
 *  the CSS file. On *NIX you can also do a simple `php cssgen.php > geshi.css`.
 *
 *   This file is part of GeSHi.
 *
 *  GeSHi is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  GeSHi is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with GeSHi; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 *
 * @package    geshi
 * @subpackage contrib
 * @author     revulo <revulon@gmail.com>
 * @copyright  2008 revulo
 * @license    http://gnu.org/copyleft/gpl.html GNU GPL
 *
 */

require dirname(dirname(__FILE__)) . DIRECTORY_SEPARATOR . 'geshi.php';
$geshi = new GeSHi;

$languages = array();
if ($handle = opendir($geshi->language_path)) {
    while (($file = readdir($handle)) !== false) {
        $pos = strpos($file, '.');
        if ($pos > 0 && substr($file, $pos) == '.php') {
            $languages[] = substr($file, 0, $pos);
        }
    }
    closedir($handle);
}
sort($languages);

header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="geshi.css"');

echo "/**\n".
     " * GeSHi (C) 2004 - 2007 Nigel McNie, 2007 - 2008 Benny Baumann\n" .
     " * (http://qbnz.com/highlighter/ and http://geshi.org/)\n".
     " */\n";

foreach ($languages as $language) {
    $geshi->set_language($language);
    // note: the false argument is required for stylesheet generators, see API documentation
    $css = $geshi->get_stylesheet(false);
    echo preg_replace('/^\/\*\*.*?\*\//s', '', $css);
}
