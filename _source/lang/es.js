/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Spanish language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Constains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'es' ] = {
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'ltr',

	/*
	 * Screenreader titles. Please note that screenreaders are not always capable
	 * of reading non-English words. So be careful while translating it.
	 */
	editorTitle: 'Rich text editor, %1', // MISSING

	// Toolbar buttons without dialogs.
	source: 'Fuente HTML',
	newPage: 'Nueva Página',
	save: 'Guardar',
	preview: 'Vista Previa',
	cut: 'Cortar',
	copy: 'Copiar',
	paste: 'Pegar',
	print: 'Imprimir',
	underline: 'Subrayado',
	bold: 'Negrita',
	italic: 'Cursiva',
	selectAll: 'Seleccionar Todo',
	removeFormat: 'Eliminar Formato',
	strike: 'Tachado',
	subscript: 'Subíndice',
	superscript: 'Superíndice',
	horizontalrule: 'Insertar Línea Horizontal',
	pagebreak: 'Insertar Salto de Página',
	unlink: 'Eliminar Vínculo',
	undo: 'Deshacer',
	redo: 'Rehacer',

	// Common messages and labels.
	common: {
		browseServer: 'Ver Servidor',
		url: 'URL',
		protocol: 'Protocolo',
		upload: 'Cargar',
		uploadSubmit: 'Enviar al Servidor',
		image: 'Imagen',
		flash: 'Flash',
		form: 'Formulario',
		checkbox: 'Casilla de Verificación',
		radio: 'Botones de Radio',
		textField: 'Campo de Texto',
		textarea: 'Area de Texto',
		hiddenField: 'Campo Oculto',
		button: 'Botón',
		select: 'Campo de Selección',
		imageButton: 'Botón Imagen',
		notSet: '<No definido>',
		id: 'Id',
		name: 'Nombre',
		langDir: 'Orientación',
		langDirLtr: 'Izquierda a Derecha (LTR)',
		langDirRtl: 'Derecha a Izquierda (RTL)',
		langCode: 'Cód. de idioma',
		longDescr: 'Descripción larga URL',
		cssClass: 'Clases de hojas de estilo',
		advisoryTitle: 'Título',
		cssStyle: 'Estilo',
		ok: 'OK',
		cancel: 'Cancelar',
		generalTab: 'General',
		advancedTab: 'Avanzado',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Insertar Caracter Especial',
		title: 'Seleccione un caracter especial'
	},

	// Link dialog.
	link: {
		toolbar: 'Insertar/Editar Vínculo', // IE6 BUG: A title called "Link" in an <A> tag would invalidate its padding!!
		menu: 'Editar Vínculo',
		title: 'Vínculo',
		info: 'Información de Vínculo',
		target: 'Destino',
		upload: 'Cargar',
		advanced: 'Avanzado',
		type: 'Tipo de vínculo',
		toAnchor: 'Referencia en esta página',
		toEmail: 'E-Mail',
		target: 'Destino',
		targetNotSet: '<No definido>',
		targetFrame: '<marco>',
		targetPopup: '<ventana emergente>',
		targetNew: 'Nueva Ventana(_blank)',
		targetTop: 'Ventana primaria (_top)',
		targetSelf: 'Misma Ventana (_self)',
		targetParent: 'Ventana Padre (_parent)',
		targetFrameName: 'Nombre del Marco Destino',
		targetPopupName: 'Nombre de Ventana Emergente',
		popupFeatures: 'Características de Ventana Emergente',
		popupResizable: 'Resizable', // MISSING
		popupStatusBar: 'Barra de Estado',
		popupLocationBar: 'Barra de ubicación',
		popupToolbar: 'Barra de Herramientas',
		popupMenuBar: 'Barra de Menú',
		popupFullScreen: 'Pantalla Completa (IE)',
		popupScrollBars: 'Barras de desplazamiento',
		popupDependent: 'Dependiente (Netscape)',
		popupWidth: 'Anchura',
		popupLeft: 'Posición Izquierda',
		popupHeight: 'Altura',
		popupTop: 'Posición Derecha',
		id: 'Id', // MISSING
		langDir: 'Orientación',
		langDirNotSet: '<No definido>',
		langDirLTR: 'Izquierda a Derecha (LTR)',
		langDirRTL: 'Derecha a Izquierda (RTL)',
		acccessKey: 'Clave de Acceso',
		name: 'Nombre',
		langCode: 'Orientación',
		tabIndex: 'Indice de tabulación',
		advisoryTitle: 'Título',
		advisoryContentType: 'Tipo de Contenido',
		cssClasses: 'Clases de hojas de estilo',
		charset: 'Fuente de caracteres vinculado',
		styles: 'Estilo',
		selectAnchor: 'Seleccionar una referencia',
		anchorName: 'Por Nombre de Referencia',
		anchorId: 'Por ID de elemento',
		emailAddress: 'Dirección de E-Mail',
		emailSubject: 'Título del Mensaje',
		emailBody: 'Cuerpo del Mensaje',
		noAnchors: '(No hay referencias disponibles en el documento)',
		noUrl: 'Por favor tipee el vínculo URL',
		noEmail: 'Por favor tipee la dirección de e-mail'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Referencia',
		menu: 'Propiedades de Referencia',
		title: 'Propiedades de Referencia',
		name: 'Nombre de la Referencia',
		errorName: 'Por favor, complete el nombre de la Referencia'
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Buscar y Reemplazar',
		find: 'Buscar',
		replace: 'Reemplazar',
		findWhat: 'Texto a buscar:',
		replaceWith: 'Reemplazar con:',
		notFoundMsg: 'El texto especificado no ha sido encontrado.',
		matchCase: 'Coincidir may/min',
		matchWord: 'Coincidir toda la palabra',
		matchCyclic: 'Match cyclic', // MISSING
		replaceAll: 'Reemplazar Todo',
		replaceSuccessMsg: '%1 occurrence(s) replaced.' // MISSING
	},

	// Table Dialog
	table: {
		toolbar: 'Tabla',
		title: 'Propiedades de Tabla',
		menu: 'Propiedades de Tabla',
		deleteTable: 'Eliminar Tabla',
		rows: 'Filas',
		columns: 'Columnas',
		border: 'Tamaño de Borde',
		align: 'Alineación',
		alignNotSet: '<No establecido>',
		alignLeft: 'Izquierda',
		alignCenter: 'Centrado',
		alignRight: 'Derecha',
		width: 'Anchura',
		widthPx: 'pixeles',
		widthPc: 'porcentaje',
		height: 'Altura',
		cellSpace: 'Esp. e/celdas',
		cellPad: 'Esp. interior',
		caption: 'Título',
		summary: 'Síntesis',
		headers: 'Encabezados',
		headersNone: 'Ninguno',
		headersColumn: 'Primera columna',
		headersRow: 'Primera fila',
		headersBoth: 'Ambas',
		invalidRows: 'Number of rows must be a number greater than 0.', // MISSING
		invalidCols: 'Number of columns must be a number greater than 0.', // MISSING
		invalidBorder: 'Border size must be a number.', // MISSING
		invalidWidth: 'Table width must be a number.', // MISSING
		invalidHeight: 'Table height must be a number.', // MISSING
		invalidCellSpacing: 'Cell spacing must be a number.', // MISSING
		invalidCellPadding: 'Cell padding must be a number.', // MISSING

		cell: {
			menu: 'Celda',
			insertBefore: 'Insertar celda a la izquierda',
			insertAfter: 'Insertar celda a la derecha',
			deleteCell: 'Eliminar Celdas',
			merge: 'Combinar Celdas',
			mergeRight: 'Combinar a la derecha',
			mergeDown: 'Combinar hacia abajo',
			splitHorizontal: 'Dividir la celda horizontalmente',
			splitVertical: 'Dividir la celda verticalmente',
			title: 'Cell Properties', // MISSING
			cellType: 'Cell Type', // MISSING
			rowSpan: 'Rows Span', // MISSING
			colSpan: 'Columns Span', // MISSING
			wordWrap: 'Word Wrap', // MISSING
			hAlign: 'Horizontal Alignment', // MISSING
			vAlign: 'Vertical Alignment', // MISSING
			alignTop: 'Top', // MISSING
			alignMiddle: 'Middle', // MISSING
			alignBottom: 'Bottom', // MISSING
			alignBaseline: 'Baseline', // MISSING
			bgColor: 'Background Color', // MISSING
			borderColor: 'Border Color', // MISSING
			data: 'Data', // MISSING
			header: 'Header', // MISSING
			yes: 'Yes', // MISSING
			no: 'No', // MISSING
			invalidWidth: 'Cell width must be a number.', // MISSING
			invalidHeight: 'Cell height must be a number.', // MISSING
			invalidRowSpan: 'Rows span must be a whole number.', // MISSING
			invalidColSpan: 'Columns span must be a whole number.' // MISSING
		},

		row: {
			menu: 'Fila',
			insertBefore: 'Insertar fila en la parte superior',
			insertAfter: 'Insertar fila en la parte inferior',
			deleteRow: 'Eliminar Filas'
		},

		column: {
			menu: 'Columna',
			insertBefore: 'Insertar columna a la izquierda',
			insertAfter: 'Insertar columna a la derecha',
			deleteColumn: 'Eliminar Columnas'
		}
	},

	// Button Dialog.
	button: {
		title: 'Propiedades de Botón',
		text: 'Texto (Valor)',
		type: 'Tipo',
		typeBtn: 'Boton',
		typeSbm: 'Enviar',
		typeRst: 'Reestablecer'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Propiedades de Casilla',
		radioTitle: 'Propiedades de Botón de Radio',
		value: 'Valor',
		selected: 'Seleccionado'
	},

	// Form Dialog.
	form: {
		title: 'Propiedades de Formulario',
		menu: 'Propiedades de Formulario',
		action: 'Acción',
		method: 'Método',
		encoding: 'Encoding', // MISSING
		target: 'Destino',
		targetNotSet: '<No definido>',
		targetNew: 'Nueva Ventana(_blank)',
		targetTop: 'Ventana primaria (_top)',
		targetSelf: 'Misma Ventana (_self)',
		targetParent: 'Ventana Padre (_parent)'
	},

	// Select Field Dialog.
	select: {
		title: 'Propiedades de Campo de Selección',
		selectInfo: 'Información',
		opAvail: 'Opciones disponibles',
		value: 'Valor',
		size: 'Tamaño',
		lines: 'Lineas',
		chkMulti: 'Permitir múltiple selección',
		opText: 'Texto',
		opValue: 'Valor',
		btnAdd: 'Agregar',
		btnModify: 'Modificar',
		btnUp: 'Subir',
		btnDown: 'Bajar',
		btnSetValue: 'Establecer como predeterminado',
		btnDelete: 'Eliminar'
	},

	// Textarea Dialog.
	textarea: {
		title: 'Propiedades de Area de Texto',
		cols: 'Columnas',
		rows: 'Filas'
	},

	// Text Field Dialog.
	textfield: {
		title: 'Propiedades de Campo de Texto',
		name: 'Nombre',
		value: 'Valor',
		charWidth: 'Caracteres de ancho',
		maxChars: 'Máximo caracteres',
		type: 'Tipo',
		typeText: 'Texto',
		typePass: 'Contraseña'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Propiedades de Campo Oculto',
		name: 'Nombre',
		value: 'Valor'
	},

	// Image Dialog.
	image: {
		title: 'Propiedades de Imagen',
		titleButton: 'Propiedades de Botón de Imagen',
		menu: 'Propiedades de Imagen',
		infoTab: 'Información de Imagen',
		btnUpload: 'Enviar al Servidor',
		url: 'URL',
		upload: 'Cargar',
		alt: 'Texto Alternativo',
		width: 'Anchura',
		height: 'Altura',
		lockRatio: 'Proporcional',
		resetSize: 'Tamaño Original',
		border: 'Borde',
		hSpace: 'Esp.Horiz',
		vSpace: 'Esp.Vert',
		align: 'Alineación',
		alignLeft: 'Izquierda',
		alignAbsBottom: 'Abs inferior',
		alignAbsMiddle: 'Abs centro',
		alignBaseline: 'Línea de base',
		alignBottom: 'Pie',
		alignMiddle: 'Centro',
		alignRight: 'Derecha',
		alignTextTop: 'Tope del texto',
		alignTop: 'Tope',
		preview: 'Vista Previa',
		alertUrl: 'Por favor escriba la URL de la imagen',
		linkTab: 'Vínculo',
		button2Img: 'Do you want to transform the selected image button on a simple image?', // MISSING
		img2Button: 'Do you want to transform the selected image on a image button?' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'Propiedades de Flash',
		propertiesTab: 'Properties', // MISSING
		title: 'Propiedades de Flash',
		chkPlay: 'Autoejecución',
		chkLoop: 'Repetir',
		chkMenu: 'Activar Menú Flash',
		chkFull: 'Allow Fullscreen', // MISSING
		scale: 'Escala',
		scaleAll: 'Mostrar todo',
		scaleNoBorder: 'Sin Borde',
		scaleFit: 'Ajustado',
		access: 'Script Access', // MISSING
		accessAlways: 'Always', // MISSING
		accessSameDomain: 'Same domain', // MISSING
		accessNever: 'Never', // MISSING
		align: 'Alineación',
		alignLeft: 'Izquierda',
		alignAbsBottom: 'Abs inferior',
		alignAbsMiddle: 'Abs centro',
		alignBaseline: 'Línea de base',
		alignBottom: 'Pie',
		alignMiddle: 'Centro',
		alignRight: 'Derecha',
		alignTextTop: 'Tope del texto',
		alignTop: 'Tope',
		quality: 'Quality', // MISSING
		windowMode: 'Window mode', // MISSING
		flashvars: 'Variables for Flash', // MISSING
		bgcolor: 'Color de Fondo',
		width: 'Anchura',
		height: 'Altura',
		hSpace: 'Esp.Horiz',
		vSpace: 'Esp.Vert',
		validateSrc: 'Por favor tipee el vínculo URL',
		validateWidth: 'Width must be a number.', // MISSING
		validateHeight: 'Height must be a number.', // MISSING
		validateHSpace: 'HSpace must be a number.', // MISSING
		validateVSpace: 'VSpace must be a number.' // MISSING
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Ortografía',
		title: 'Spell Check', // MISSING
		notAvailable: 'Sorry, but service is unavailable now.', // MISSING
		errorLoading: 'Error loading application service host: %s.', // MISSING
		notInDic: 'No se encuentra en el Diccionario',
		changeTo: 'Cambiar a',
		btnIgnore: 'Ignorar',
		btnIgnoreAll: 'Ignorar Todo',
		btnReplace: 'Reemplazar',
		btnReplaceAll: 'Reemplazar Todo',
		btnUndo: 'Deshacer',
		noSuggestions: '- No hay sugerencias -',
		progress: 'Control de Ortografía en progreso...',
		noMispell: 'Control finalizado: no se encontraron errores',
		noChanges: 'Control finalizado: no se ha cambiado ninguna palabra',
		oneChange: 'Control finalizado: se ha cambiado una palabra',
		manyChanges: 'Control finalizado: se ha cambiado %1 palabras',
		ieSpellDownload: 'Módulo de Control de Ortografía no instalado. ¿Desea descargarlo ahora?'
	},

	smiley: {
		toolbar: 'Emoticons',
		title: 'Insertar un Emoticon'
	},

	elementsPath: {
		eleTitle: '%1 element' // MISSING
	},

	numberedlist: 'Numeración',
	bulletedlist: 'Viñetas',
	indent: 'Aumentar Sangría',
	outdent: 'Disminuir Sangría',

	justify: {
		left: 'Alinear a Izquierda',
		center: 'Centrar',
		right: 'Alinear a Derecha',
		block: 'Justificado'
	},

	blockquote: 'Cita',

	clipboard: {
		title: 'Pegar',
		cutError: 'La configuración de seguridad de este navegador no permite la ejecución automática de operaciones de cortado. Por favor use el teclado (Ctrl+X).',
		copyError: 'La configuración de seguridad de este navegador no permite la ejecución automática de operaciones de copiado. Por favor use el teclado (Ctrl+C).',
		pasteMsg: 'Por favor pegue dentro del cuadro utilizando el teclado (<STRONG>Ctrl+V</STRONG>); luego presione <STRONG>OK</STRONG>.',
		securityMsg: 'Debido a la configuración de seguridad de su navegador, el editor no tiene acceso al portapapeles. Es necesario que lo pegue de nuevo en esta ventana.'
	},

	pastefromword: {
		toolbar: 'Pegar desde Word',
		title: 'Pegar desde Word',
		advice: 'Por favor pegue dentro del cuadro utilizando el teclado (<STRONG>Ctrl+V</STRONG>); luego presione <STRONG>OK</STRONG>.',
		ignoreFontFace: 'Ignorar definiciones de fuentes',
		removeStyle: 'Remover definiciones de estilo'
	},

	pasteText: {
		button: 'Pegar como Texto Plano',
		title: 'Pegar como Texto Plano'
	},

	templates: {
		button: 'Plantillas',
		title: 'Contenido de Plantillas',
		insertOption: 'Reemplazar el contenido actual',
		selectPromptMsg: 'Por favor selecciona la plantilla a abrir en el editor<br>(el contenido actual se perderá):',
		emptyListMsg: '(No hay plantillas definidas)'
	},

	showBlocks: 'Mostrar bloques',

	stylesCombo: {
		label: 'Estilo',
		voiceLabel: 'Styles', // MISSING
		panelVoiceLabel: 'Select a style', // MISSING
		panelTitle1: 'Block Styles', // MISSING
		panelTitle2: 'Inline Styles', // MISSING
		panelTitle3: 'Object Styles' // MISSING
	},

	format: {
		label: 'Formato',
		voiceLabel: 'Format', // MISSING
		panelTitle: 'Formato',
		panelVoiceLabel: 'Select a paragraph format', // MISSING

		tag_p: 'Normal',
		tag_pre: 'Con formato',
		tag_address: 'Dirección',
		tag_h1: 'Encabezado 1',
		tag_h2: 'Encabezado 2',
		tag_h3: 'Encabezado 3',
		tag_h4: 'Encabezado 4',
		tag_h5: 'Encabezado 5',
		tag_h6: 'Encabezado 6',
		tag_div: 'Normal (DIV)'
	},

	font: {
		label: 'Fuente',
		voiceLabel: 'Font', // MISSING
		panelTitle: 'Fuente',
		panelVoiceLabel: 'Select a font' // MISSING
	},

	fontSize: {
		label: 'Tamaño',
		voiceLabel: 'Font Size', // MISSING
		panelTitle: 'Tamaño',
		panelVoiceLabel: 'Select a font size' // MISSING
	},

	colorButton: {
		textColorTitle: 'Color de Texto',
		bgColorTitle: 'Color de Fondo',
		auto: 'Automático',
		more: 'Más Colores...'
	},

	colors: {
		'000': 'Black',
		'800000': 'Maroon',
		'8B4513': 'Saddle Brown',
		'2F4F4F': 'Dark Slate Gray',
		'008080': 'Teal',
		'000080': 'Navy',
		'4B0082': 'Indigo',
		'696969': 'Dim Gray',
		'B22222': 'Fire Brick',
		'A52A2A': 'Brown',
		'DAA520': 'Golden Rod',
		'006400': 'Dark Green',
		'40E0D0': 'Turquoise',
		'0000CD': 'Medium Blue',
		'800080': 'Purple',
		'808080': 'Gray',
		'F00': 'Red',
		'FF8C00': 'Dark Orange',
		'FFD700': 'Gold',
		'008000': 'Green',
		'0FF': 'Cyan',
		'00F': 'Blue',
		'EE82EE': 'Violet',
		'A9A9A9': 'Dark Gray',
		'FFA07A': 'Light Salmon',
		'FFA500': 'Orange',
		'FFFF00': 'Yellow',
		'00FF00': 'Lime',
		'AFEEEE': 'Pale Turquoise',
		'ADD8E6': 'Light Blue',
		'DDA0DD': 'Plum',
		'D3D3D3': 'Light Grey',
		'FFF0F5': 'Lavender Blush',
		'FAEBD7': 'Antique White',
		'FFFFE0': 'Light Yellow',
		'F0FFF0': 'Honeydew',
		'F0FFFF': 'Azure',
		'F0F8FF': 'Alice Blue',
		'E6E6FA': 'Lavender',
		'FFF': 'White'
	},

	scayt: {
		title: 'Spell Check As You Type', // MISSING
		enable: 'Enable SCAYT', // MISSING
		disable: 'Disable SCAYT', // MISSING
		about: 'About SCAYT', // MISSING
		toggle: 'Toggle SCAYT', // MISSING
		options: 'Options', // MISSING
		langs: 'Languages', // MISSING
		moreSuggestions: 'More suggestions', // MISSING
		ignore: 'Ignore', // MISSING
		ignoreAll: 'Ignore All', // MISSING
		addWord: 'Add Word', // MISSING
		emptyDic: 'Dictionary name should not be empty.', // MISSING
		optionsTab: 'Options', // MISSING
		languagesTab: 'Languages', // MISSING
		dictionariesTab: 'Dictionaries', // MISSING
		aboutTab: 'About' // MISSING
	},

	about: {
		title: 'About CKEditor', // MISSING
		moreInfo: 'For licensing information please visit our web site:', // MISSING
		copy: 'Copyright &copy; $1. All rights reserved.' // MISSING
	},

	maximize: 'Maximize' // MISSING
};
