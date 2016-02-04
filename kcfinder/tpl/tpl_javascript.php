<?php
    NAMESPACE kcfinder;
?>
<script src="js/index.php" type="text/javascript"></script>
<script src="js_localize.php?lng=<?php echo $this->lang ?>" type="text/javascript"></script>
<?php
    IF ($this->opener['name'] == "tinymce"):
?>
<script src="<?php echo $this->config['_tinyMCEPath'] ?>/tiny_mce_popup.js" type="text/javascript"></script>
<?php
    ENDIF;

    IF (file_exists("themes/{$this->config['theme']}/js.php")):
?>
<script src="themes/<?php echo $this->config['theme'] ?>/js.php" type="text/javascript"></script>
<?php
    ENDIF;
?>
<script type="text/javascript">
_.version = "<?php echo self::VERSION ?>";
_.support.zip = <?php echo (class_exists('ZipArchive') && !$this->config['denyZipDownload']) ? "true" : "false" ?>;
_.support.check4Update = <?php echo ((!isset($this->config['denyUpdateCheck']) || !$this->config['denyUpdateCheck']) && (ini_get("allow_url_fopen") || function_exists("http_get") || function_exists("curl_init") || function_exists('socket_create'))) ? "true" : "false" ?>;
_.lang = "<?php echo text::jsValue($this->lang) ?>";
_.type = "<?php echo text::jsValue($this->type) ?>";
_.theme = "<?php echo text::jsValue($this->config['theme']) ?>";
_.access = <?php echo json_encode($this->config['access']) ?>;
_.dir = "<?php echo text::jsValue($this->session['dir']) ?>";
_.uploadURL = "<?php echo text::jsValue($this->config['uploadURL']) ?>";
_.thumbsURL = _.uploadURL + "/<?php echo text::jsValue($this->config['thumbsDir']) ?>";
_.opener = <?php echo json_encode($this->opener) ?>;
_.cms = "<?php echo text::jsValue($this->cms) ?>";
$.$.kuki.domain = "<?php echo text::jsValue($this->config['cookieDomain']) ?>";
$.$.kuki.path = "<?php echo text::jsValue($this->config['cookiePath']) ?>";
$.$.kuki.prefix = "<?php echo text::jsValue($this->config['cookiePrefix']) ?>";
$(function() { _.resize(); _.init(); });
$(window).resize(_.resize);
</script>
