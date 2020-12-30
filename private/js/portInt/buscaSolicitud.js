var dInicial = null, dFinal = null;
var calHoy = new Date();
var yHoy = calHoy.getFullYear();
var mHoy = calHoy.getMonth();
var dayHoy = calHoy.getDate();
var miPerfil = null;
var idEstatus = null;

/* Funciones de Update de calendario */
function calInicial(cal){
	dInicial = cal.date;
}

function calFinal(cal){
	dFinal = cal.date;
}

// Funciones para el PostCreate,
function postCreateFin(cal){
	if(dInicial!=null){
		if(dInicial>cal.date){
			var tmp = new Date(dInicial.getTime());
			cal.setDate(dInicial);
			dInicial = tmp;
		}
	}
}

// Funcion que inabilita dias del calendario
function diasFechaInicial(date, y, m, d){
	if(dFinal==null) return false;
	if(date>dFinal) return true;
}

function diasFechaFinal(date, y, m, d){
	if(dInicial==null) return false;
	if(date<dInicial) return true;
}




function checaRadio(idRadio){
	var radio = document.getElementById(idRadio);
	radio.checked = "ckecked";	
	visibilidadFiltro(idRadio);
}

function visibilidadFiltro(radio){
	if(radio.value=="filtro" || radio=="chkFiltro"){
		document.frmBuscaSolicitud.telefono.value="";
		document.frmBuscaSolicitud.idCop.value="";
		$("#tablaFiltro").show();
	}else{
		$("#tablaFiltro").hide();
		if(radio.value=="idCop"){
			document.frmBuscaSolicitud.telefono.value="";
		}
		//Debe ser búsqueda por telefono
		else{document.frmBuscaSolicitud.idCop.value="";}
	}
}

// Manejo global ajax
$().ajaxSend(function(r,s){
	$('input:text').each(function(){
		var val = jQuery.trim(this.value);
		this.value = escape(this.value.toUpperCase());	
	});
	$("input:button").each(
		function(){
			this.disabled=true;
		}
	);
	$("#divLoading").show();
	//document.frmBuscaSolicitud.btnSubmit.disabled=true;
	$('#btnSubmit').attr('disabled','-1')
});

$().ajaxStop(function(r,s){
	$("input:button").each(
		function(){
			this.disabled=false;
		}
	);
	$("#divLoading").fadeOut("fast");
	ctrEstatusBloquear();
});

$("#msg").ajaxError(function(event, request, settings){
   $(this).append("<li>Error en la pagina " + settings.url + "</li>");
 });
 
function enviaDetalleSolicitud(idCop){	
	//el formulario obtiene los datos de la busqueda	
	$('#idCopDet').val(jQuery.trim(idCop));
	//$('#urlOrigenDet').val(document.getElementById("urlOrigen").value);
	//$('#liberaFolioDet').val("true");
	document.getElementById("frmDetalle").submit();
}

function enviaHistoricoEstatus(idCop,tel){
	//limpiar el Div
	$("#divHistoricoEstatus").html("");
	idCop = jQuery.trim(idCop);
	$("#divHistoricoEstatus").load("./historicoEstatus.do", {idCop: idCop , tel: tel});
	
	/*se muestran los div's correspondientes*/
		$("#divDetalleHistorico").show();
	/*se oculta el formulario */
		$("#tablaForm").hide();
		
	
}
$(document).ready(function() {
	$("tr").css("height", "23px");
 });
 
 function cierraDetalle(){
 	$("#divDetalleHistorico").fadeOut("fast");
 	$("#tablaForm").show();
 	//document.frmBuscaSolicitud.btnSubmit.disabled=false;
 	$('#btnSubmit').removeAttr('disabled')
 }
 
 //recuerda los parametros de busqueda realizados
 function verPaneles(perfil){
 //inicializa la variable perfil
 miPerfil=perfil
 //evalua si se tiene que bloquear el control
 ctrEstatusBloquear();
 //verifica si se hizo una búsqueda
 	 if(document.frmDetalle.pathDestino !=null &&
 	 	document.frmDetalle.pathDestino.value!=""){
 	
 	 	//tipo de busqueda relizada
 		//i=0 parametro portabilidad
 		//i=1 telefono
 		//i=2 filtrado por un criterio   
 	    var i=document.frmDetalle.chkCriterioDet.value.toUpperCase();	
		
		switch(i){
			case 'IDCOP'://busqueda por idCop
			case '0':
					document.frmBuscaSolicitud.telefono.value="";
					document.frmBuscaSolicitud.chkCriterio[0].checked=true;
					$("#tablaFiltro").hide();
				break;
			case 'TELEFONO':
			case '1':
					document.frmBuscaSolicitud.chkCriterio[1].checked=true;
					document.frmBuscaSolicitud.idCop.value="";
					$("#tablaFiltro").hide();
				break;
			case 'FILTRO':
			case '2':
					document.frmBuscaSolicitud.chkCriterio[2].checked=true;
					document.frmBuscaSolicitud.telefono.value="";
					document.frmBuscaSolicitud.idCop.value="";
					$("#tablaFiltro").show();
					$("#tablaForm").show();
				break;
		}
		 $("#divHistoricoEstatus").show();
		 
		//limpia el formulario auxiliar
		limpiarFormDetalle(); 	
		
		//$("#divBuscaSolicitud").show();
		
		document.getElementById("divBuscaSolicitud").style.visibility="visible";
	 }
 }//fin de la funcion
 
 
 function limpiarFormDetalle(){
	 try{
		 	for(var j=0;j<document.frmDetalle.length;j++){
					document.frmDetalle[j].value="";
			}
		}catch(exception){}	
 }//fin de la funcion
 
 //desabilita el combo para que se pueda enviar su valor al servidor
 //establece como visible al div: "divBuscaSolicitud"
 function verTablaResultado(){
 	document.frmBuscaSolicitud.idStMovimiento.disabled=false;
 	document.frmBuscaSolicitud.region.disabled=false;
// 	document.getElementById("divBuscaSolicitud").style.visibility="visible";
 }
 
function ctrEstatusBloquear(){

	if(document.frmBuscaSolicitud.region!=null)
		 document.frmBuscaSolicitud.region.disabled=true;
	
} 
 
 
 function cambioOpcionMasiva(){
	if(document.frmBuscaSolicitud.rdBusqueda[0].checked){
		limpiarFile();
		document.getElementById("divlistaTelefono").style.visibility="visible";
		document.getElementById("divlistaTelefono").style.display="block";
		document.getElementById("divArchivoTelefono").style.visibility="hidden";
		document.getElementById("divArchivoTelefono").style.display="none";
	}else if(document.frmBuscaSolicitud.rdBusqueda[1].checked){
		document.getElementById("listaTelefono").value="";
		document.getElementById("divlistaTelefono").style.visibility="hidden";
		document.getElementById("divlistaTelefono").style.display="none";
		document.getElementById("divArchivoTelefono").style.visibility="visible";
		document.getElementById("divArchivoTelefono").style.display="block";		
	}
}

function limpiarFile()	{
	f = document.getElementById("listaTelefonoFile");
	nuevoFile = document.createElement("input");
	nuevoFile.id = f.id;
	nuevoFile.type = "file";
	nuevoFile.name = "archivo";
	nuevoFile.value = "";
	nuevoFile.onchange = f.onchange;
	nodoPadre = f.parentNode;
	nodoSiguiente = f.nextSibling;
	nodoPadre.removeChild(f);
	(nodoSiguiente == null) ? nodoPadre.appendChild(nuevoFile):
		nodoPadre.insertBefore(nuevoFile, nodoSiguiente);
}