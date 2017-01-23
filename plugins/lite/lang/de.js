CKEDITOR.plugins.setLang( 'lite', 'de', {
	TOGGLE_TRACKING: "Überarbeitungsmodus umschalten",
	TOGGLE_SHOW: "Überarbeitungsmodus umschalten",
	ACCEPT_ALL: "Alle Änderungen annehmen",
	REJECT_ALL: "Alle Änderungen ablehnen",
	ACCEPT_ONE: "Änderung annehmen",
	REJECT_ONE: "Änderung ablehnen",
	START_TRACKING: "Überarbeitungsmodus einschalten",
	STOP_TRACKING: "Überarbeitungsmodus ausschalten",
	PENDING_CHANGES: "Das Dokument beinhaltet Überarbeitungen.\nBitte annehmen oder ablehnen bevor der Überarbeitungsmodus beendet wird.",
	HIDE_TRACKED: "Änderungen ausblenden",
	SHOW_TRACKED: "Äderungen anzeigen",
	CHANGE_TYPE_ADDED: "hinzugefügt",
	CHANGE_TYPE_DELETED: "gelöscht",
	MONTHS: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
	NOW: "jetzt",
	MINUTE_AGO: "vor 1 Minute",
	MINUTES_AGO: "vor xMinutes Minuten",
	BY: "von",
	ON: "am",
	AT: "um",
	
	LITE_LABELS_DATE: function (day, month, year)
	{
		if(typeof(year) != 'undefined') {
			year = ", " + year;
		}
		else {
			year = "";
		}
		return day + ". " + this.MONTHS[month] + year;
	}
});

