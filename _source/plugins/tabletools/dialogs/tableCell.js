/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.dialog.add( 'cellProperties', function( editor ) {
	var langTable = editor.lang.table;
	var langCell = langTable.cell;
	var langCommon = editor.lang.common;
	var validate = CKEDITOR.dialog.validate;
	var widthPattern = /^(\d+(?:\.\d+)?)(px|%)$/,
		heightPattern = /^(\d+(?:\.\d+)?)px$/;
	var bind = CKEDITOR.tools.bind;

	function spacer() {
		return { type: 'html', html: '&nbsp;' };
	}

	return {
		title: langCell.title,
		minWidth: 480,
		minHeight: 140,
		contents: [
			{
			id: 'info',
			label: langCell.title,
			accessKey: 'I',
			elements: [
				{
				type: 'hbox',
				widths: [ '45%', '10%', '45%' ],
				children: [
					{
					type: 'vbox',
					padding: 0,
					children: [
						{
						type: 'hbox',
						widths: [ '70%', '30%' ],
						children: [
							{
							type: 'text',
							id: 'width',
							label: langTable.width,
							widths: [ '71%', '29%' ],
							labelLayout: 'horizontal',
							validate: validate[ 'number' ]( langCell.invalidWidth ),
							setup: function( selectedCell ) {
								var widthMatch = widthPattern.exec( selectedCell.$.style.width );
								if ( widthMatch )
									this.setValue( widthMatch[ 1 ] );
							},
							commit: function( selectedCell ) {
								var unit = this.getDialog().getValueOf( 'info', 'widthType' );
								if ( this.getValue() !== '' )
									selectedCell.$.style.width = this.getValue() + unit;
								else
									selectedCell.$.style.width = '';
							},
							'default': ''
						},
							{
							type: 'select',
							id: 'widthType',
							labelLayout: 'horizontal',
							widths: [ '0%', '100%' ],
							label: '',
							'default': 'px',
							items: [
								[ langTable.widthPx, 'px' ],
								[ langTable.widthPc, '%' ]
								],
							setup: function( selectedCell ) {
								var widthMatch = widthPattern.exec( selectedCell.$.style.width );
								if ( widthMatch )
									this.setValue( widthMatch[ 2 ] );
							}
						}
						]
					},
						{
						type: 'hbox',
						widths: [ '70%', '30%' ],
						children: [
							{
							type: 'text',
							id: 'height',
							label: langTable.height,
							'default': '',
							widths: [ '71%', '29%' ],
							labelLayout: 'horizontal',
							validate: validate[ 'number' ]( langCell.invalidHeight ),
							setup: function( selectedCell ) {
								var heightMatch = heightPattern.exec( selectedCell.$.style.height );
								if ( heightMatch )
									this.setValue( heightMatch[ 1 ] );
							},
							commit: function( selectedCell ) {
								if ( this.getValue() !== '' )
									selectedCell.$.style.height = this.getValue() + 'px';
								else
									selectedCell.$.style.height = '';
							}
						},
							{
							type: 'html',
							html: langTable.widthPx
						}
						]
					},
						spacer(),
					{
						type: 'select',
						id: 'wordWrap',
						labelLayout: 'horizontal',
						label: langCell.wordWrap,
						widths: [ '50%', '50%' ],
						'default': 'yes',
						items: [
							[ langCell.yes, 'yes' ],
							[ langCell.no, 'no' ]
							],
						commit: function( selectedCell ) {
							if ( this.getValue() == 'no' )
								selectedCell.setAttribute( 'noWrap', 'nowrap' );
							else
								selectedCell.removeAttribute( 'noWrap' );
						}
					},
						spacer(),
					{
						type: 'select',
						id: 'hAlign',
						labelLayout: 'horizontal',
						label: langCell.hAlign,
						widths: [ '50%', '50%' ],
						'default': '',
						items: [
							[ langCommon.notSet, '' ],
							[ langTable.alignLeft, 'left' ],
							[ langTable.alignCenter, 'center' ],
							[ langTable.alignRight, 'right' ]
							],
						setup: function( selectedCell ) {
							this.setValue( selectedCell.getAttribute( 'align' ) || '' );
						},
						commit: function( selectedCell ) {
							if ( this.getValue() )
								selectedCell.setAttribute( 'align', this.getValue() );
							else
								selectedCell.removeAttribute( 'align' );
						}
					},
						{
						type: 'select',
						id: 'vAlign',
						labelLayout: 'horizontal',
						label: langCell.vAlign,
						widths: [ '50%', '50%' ],
						'default': '',
						items: [
							[ langCommon.notSet, '' ],
							[ langCell.alignTop, 'top' ],
							[ langCell.alignMiddle, 'middle' ],
							[ langCell.alignBottom, 'bottom' ],
							[ langCell.alignBaseline, 'baseline' ]
							],
						setup: function( selectedCell ) {
							this.setValue( selectedCell.getAttribute( 'vAlign' ) || '' );
						},
						commit: function( selectedCell ) {
							if ( this.getValue() )
								selectedCell.setAttribute( 'vAlign', this.getValue() );
							else
								selectedCell.removeAttribute( 'vAlign' );
						}
					}
					]
				},
					spacer(),
				{
					type: 'vbox',
					padding: 0,
					children: [
						{
						type: 'select',
						id: 'cellType',
						label: langCell.cellType,
						labelLayout: 'horizontal',
						widths: [ '50%', '50%' ],
						'default': 'td',
						items: [
							[ langCell.data, 'td' ],
							[ langCell.header, 'th' ]
							],
						setup: function( selectedCell ) {
							this.setValue( selectedCell.getName() );
						},
						commit: function( selectedCell ) {
							selectedCell.renameNode( this.getValue() );
						}
					},
						spacer(),
					{
						type: 'text',
						id: 'rowSpan',
						label: langCell.rowSpan,
						labelLayout: 'horizontal',
						widths: [ '50%', '50%' ],
						'default': '',
						validate: validate.integer( langCell.invalidRowSpan ),
						setup: function( selectedCell ) {
							this.setValue( selectedCell.getAttribute( 'rowSpan' ) || '' );
						},
						commit: function( selectedCell ) {
							if ( this.getValue() )
								selectedCell.setAttribute( 'rowSpan', this.getValue() );
							else
								selectedCell.removeAttribute( 'rowSpan' );
						}
					},
						{
						type: 'text',
						id: 'colSpan',
						label: langCell.colSpan,
						labelLayout: 'horizontal',
						widths: [ '50%', '50%' ],
						'default': '',
						validate: validate.integer( langCell.invalidColSpan ),
						setup: function( selectedCell ) {
							this.setValue( selectedCell.getAttribute( 'colSpan' ) || '' );
						},
						commit: function( selectedCell ) {
							if ( this.getValue() )
								selectedCell.setAttribute( 'colSpan', this.getValue() );
							else
								selectedCell.removeAttribute( 'colSpan' );
						}
					},
						spacer(),
					{
						type: 'text',
						id: 'bgColor',
						label: langCell.bgColor,
						labelLayout: 'horizontal',
						widths: [ '50%', '50%' ],
						'default': '',
						setup: function( selectedCell ) {
							this.setValue( selectedCell.getAttribute( 'bgColor' ) || '' );
						},
						commit: function( selectedCell ) {
							if ( this.getValue() )
								selectedCell.setAttribute( 'bgColor', this.getValue() );
							else
								selectedCell.removeAttribute( 'bgColor' );
						}
					},
						{
						type: 'text',
						id: 'borderColor',
						label: langCell.borderColor,
						labelLayout: 'horizontal',
						widths: [ '50%', '50%' ],
						'default': '',
						setup: function( selectedCell ) {
							this.setValue( selectedCell.getAttribute( 'borderColor' ) || '' );
						},
						commit: function( selectedCell ) {
							if ( this.getValue() )
								selectedCell.setAttribute( 'borderColor', this.getValue() );
							else
								selectedCell.removeAttribute( 'borderColor' );
						}
					}
					]
				}
				]
			}
			]
		}
		],
		onShow: function() {
			this.cells = CKEDITOR.plugins.tabletools.getSelectedCells( this._.editor.getSelection() );
			this.setupContent( this.cells[ 0 ] );
		},
		onOk: function() {
			var cells = this.cells
			for ( var i = 0; i < cells.length; i++ )
				this.commitContent( cells[ i ] );
		}
	};
});
