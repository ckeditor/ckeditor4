/**
 * Plugin que insere o valor selecionado por extenso.
 */

CKEDITOR.plugins.add( 'extenso',
{
	init: function( editor )
	{
		editor.addCommand( 'inserirExtenso',
			{
				exec : function( editor )
				{
					var str=editor.getSelection().getSelectedText();
					
					if (infraValidarDin(str)) {
			
						var ex = [
							["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"],
							["dez", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"],
							["cem", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"],
							["mil", "milhão", "bilhão", "trilhão", "quadrilhão", "quintilhão", "sextilhão", "setilhão", "octilhão", "nonilhão", "decilhão", "undecilhão", "dodecilhão", "tredecilhão", "quatrodecilhão", "quindecilhão", "sedecilhão", "septendecilhão", "octencilhão", "nonencilhão"]
						];
						var a, n, v, i, n = str.replace( /[^,\d]/g, "").split(","), e = " e ", $ = "real", d = "centavo", sl;
						for(var f = n.length - 1, l, j = -1, r = [], st = [], t = ""; ++j <= f; st = []){
							j && (n[j] = (("." + n[j]) * 1).toFixed(2).slice(2));
							if(!(a = (v = n[j]).slice((l = v.length) % 3).match(/\d{3}/g), v = l % 3 ? [v.slice(0, l % 3)] : [], v = a ? v.concat(a) : v).length) continue;
							for(a = -1, l = v.length; ++a < l; t = ""){
								if(!(i = v[a] * 1)) continue;
								i % 100 < 20 && (t += ex[0][i % 100]) ||
								i % 100 + 1 && (t += ex[1][(i % 100 / 10 >> 0) - 1] + (i % 10 ? e + ex[0][i % 10] : ""));
								st.push((i < 100 ? t : !(i % 100) ? ex[2][i == 100 ? 0 : i / 100 >> 0] : (ex[2][i / 100 >> 0] + e + t)) +
								((t = l - a - 2) > -1 ? " " + (i > 1 && t > 0 ? ex[3][t].replace("ão", "ões") : ex[3][t]) : ""));
							}
							if((v[l-1]*1)%100 ==0 && (v[l-1]*1>0)) {e2=e;} else {l>1 && v[l-2]*1==0 ? e2=", " : e2=" ";}
							a = ((sl = st.length) > 1 ? (a = st.pop(), st.join(", ") + e2 + a) : st.join("") || ((!j && (n[j + 1] * 1 > 0) || r.length) ? "" : ex[0][0]));
							a && r.push(a + " " + (v.join("") * 1 > 1 ? j ? d + "s" : (/0{6,}$/.test(n[0]) ? "de " : "") + $.replace("l", "is") : j ? d : $));
						}
						editor.insertHtml(str+' ('+r.join(e)+')');
						
					} else {
						str.trim().length==0 ?
						  alert ('Selecione o valor para preencher por extenso. Use . para separar milhar e , para casas decimais.'):
							alert ('Valor inválido.');
					}					
				}
			});
		editor.ui.addButton( 'Extenso',
		{
			// Toolbar button tooltip.
			label: 'Inserir valor por extenso',
			// Reference to the plugin command name.
			command: 'inserirExtenso',
			// Button's icon file path.
			icon: this.path + 'images/extenso.png'
		} );
	}
} );