"use strict";

function initXMLHTTP() {
	var xmlhttp = new XMLHttpRequest();
	var postUrl = "https://math.hackerrank.com/generate";
	xmlhttp.open("POST", postUrl);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

	return xmlhttp;
}

CKEDITOR.dialog.add("latex", function(editor) {
	return {
		title: "Mathematics in TeX",
		minWidth: 350,
		minHeight: 100,
		contents: [
			{
				id: "info",
				elements: [
					{
						id: "equation",
						type: "textarea",
						label: "Write your TeX here"
					},
					{
						id: "documentation",
						type: "html",
						html:
							'<div style="width:100%;text-align:right;margin:-8px 0 10px">' +
							'<a class="cke_mathjax_doc" href="' +
							"http://en.wikibooks.org/wiki/LaTeX/Mathematics" +
							'" target="_black" style="cursor:pointer;color:#00B2CE;text-decoration:underline">' +
							"TeX documentation" +
							"</a>" +
							"</div>"
					}
				]
			}
		],
		buttons: [
			{
				id: "insert",
				label: "Insert TeX",
				type: "button",
				className: "insertButton",
				title: "Insert TeX",
				disabled: false,
				onClick: function() {
					var dialog = CKEDITOR.dialog.getCurrent();
					var imageSrc = dialog.getValueOf("info", "equation");

					// disable insert button
					dialog.disableButton("insert");

					var xmlhttp = initXMLHTTP();
					xmlhttp.onreadystatechange = function() {
						var dataReadyState = 4;
						if (xmlhttp.readyState == dataReadyState && xmlhttp.status == 200) {
							var json = JSON.parse(xmlhttp.responseText);
							var element = editor.document.createElement("img");
							element.setAttribute("src", json.url);
							editor.insertElement(element);

							// Enable back the button and hide the dialog
							dialog.enableButton("insert");
							dialog.hide();
						}
					};
					xmlhttp.send(JSON.stringify({ latex: imageSrc }));
				}
			}
		]
	};
});
