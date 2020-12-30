/** RUTINAS COMUNES PARA EL MANEJO DE AJAX */
$().ajaxSend(function(r,s){
	$("input:button").each(
		function(){
			this.disabled=true;
		}
	);
	$("#divLoading").show();
});

$().ajaxStop(function(r,s){
	$("input:button").each(
		function(){
			this.disabled=false;
		}
	);
	$("#divLoading").fadeOut("fast");
});

$("#msg").ajaxError(function(event, request, settings){
   $(this).append("<li>Error en la pagina " + settings.url + "</li>");
 });

/** RUTINA PARA REALIZAR LA VALIDACION INICIAL DEL TELEFONO*/
function consultaPerfil(){
	var telefono   = $("#telefono").val();
	var region     = $("[@name=asesorRegion]").val();
	var contexto   = $("[@name=asesorContexto]").val();
	var corporativo= $("[@name=asesorCorporativo]").val();
	var idCopDet  = $("[@name=idCopDet]").val();	
	//alert('paso por aqui!!!!!');
	$("#divPerfil").html("");
	$("#divPerfil").load("./consultaPerfil.do", {telefono: telefono, region: region, contexto: contexto, corporativo: corporativo,idCopDet: idCopDet});
}

/********* INICIO--->>>> RUTINAS PARA REALIZAR LA CONSULTA Y VALIDACION DE USUARIO POR CURP ***************/

function validarCurp(opcion,div,dCurp){
	var curp   = $("#"+dCurp).val().toUpperCase();
	if (validaSintaxisCURP(curp,opcion)){
		$("#"+div).html("");
		$("#"+div).load("./validarCurpService.do", {curp: curp, opcion: opcion});
	}else{
		actualizaDatosTemp(curp,$("#tApellido1").val(),$("#tApellido2").val(),$("#tNombre").val(),'FALSE');
		$("#"+div).html("");
	}
}

function validarCurpPorDatos(opcion,div){
	var msj = '';
	limpiaDatos();
	var tApellido1   = $("#tApellido1").val();
	var tApellido2   = $("#tApellido2").val();
	var tNombre   = $("#tNombre").val();
/*	var tGenero   = $('input:radio[name=tGenero]:checked').val();*/
	var tGenero;
	var tGeneroOP   = document.getElementsByName("tGenero");
    for(var i=0;i<tGeneroOP.length;i++)
    {
        if(tGeneroOP[i].checked)
        	tGenero=tGeneroOP[i].value;
    }
    
	var tFechaNac   = $("#tDia").val()+'/'+$("#tMes").val()+'/'+$("#tNac").val();
	var tEntidad   = $("#tEntidad").val();
	msj += validaText('Primer Apellido',tApellido1,true);
	msj += validaText('Segundo Apellido',tApellido2,false);
	msj += validaText('Nombre(s)',tNombre,true);
	msj += validaEntidad(tEntidad);
	msj += validaAnio();
	if(msj.length > 0){
		alert(msj);
		actualizaDatosTemp($("#tCurp").val(),tApellido1,tApellido2,tNombre,'FALSE');
		$("#"+div).html("");
	}else{	
		$("#"+div).html("");
		$("#"+div).load("./validarCurpService.do", {opcion: opcion, tApellido1: tApellido1, tApellido2: tApellido2, tNombre: tNombre, tGenero: tGenero, tFechaNac: tFechaNac, tEntidad: tEntidad });
	}
}

function actualizaDatosCurp(){	
	if($("#tempCurp").val().length > 0 || $("#tempNom").val().length > 0 || $("#tempAp1").val().length > 0 || $("#tempAp2").val().length > 0 ){
		$("#curp").val($("#tempCurp").val());
		$("#nombre").val($("#tempNom").val());
		$("#paterno").val($("#tempAp1").val());
		$("#materno").val($("#tempAp2").val());
		botonesCurpValida();
	}
}

function actualizaDatosCurpDetalleValido(){
	$("#tCurp").val($("#tempCurp").val());
	$("#tNombre").val($("#tempNom").val());
	$("#tApellido1").val($("#tempAp1").val());
	$("#tApellido2").val($("#tempAp2").val());
}

function limpiaDatosCurp(){
	$("#curp").val("");
	$("#nombre").val("");
	$("#paterno").val("");
	$("#materno").val("");
	$("#curp").attr('readonly', false);
	$("#curp").removeClass("disabledbutton");
	$("#nombre").attr('readonly', false);
	$("#nombre").removeClass("disabledbutton");
	$("#paterno").attr('readonly', false);
	$("#paterno").removeClass("disabledbutton");
	$("#materno").attr('readonly', false);
	$("#materno").removeClass("disabledbutton");
	botonesCurpNoValida();
	$("#curp").focus();
}

function errorCurp(errorCurp){
	botonesCurpNoValida();
 	$.prompt(errorCurp , {prefix:'cleanblue',buttons:{Aceptar:true}});
}

/** RUTINA PARA REALIZAR LA CONSULTA DE USUARIO POR CURP DESDE LA VENTANA DETALLE*/
function consultarDetalleCurp(){
	var queryString ='';
	$.ajax(	{
		url:"./consultaDetalladaCURP.do",
		type:"POST",
		data: queryString,
		cache: false,
		success: function mostrarDatosCurp(data){
					var d= $.prompt(data, {prefix:'cleanblue',
						buttons:{Aceptar:true,Cancelar:false},
						callback:function (v,f){
							if(v){	
								actualizaDatosCurp();  
							}else{
								actualizaDatosTemp("","","","","FALSE");
							}
						}
				});}
	});
}

function botonesCurpValida(){
	var validar = $("#validacionPorCurp").val();
	if(validar == "TRUE"){
		$("#divCurpBotones").hide();
		$("#divCurpBotonCancelar").show();
		$("#curp").attr('readonly', true);
		$("#curp").addClass("disabledbutton");
		$("#nombre").attr('readonly', true);
		$("#nombre").addClass("disabledbutton");
		$("#paterno").attr('readonly', true);
		$("#paterno").addClass("disabledbutton");
		$("#materno").attr('readonly', true);
		$("#materno").addClass("disabledbutton");
		$("#contacto").focus();
	}		
}

function botonesCurpNoValida(){
	actualizaDatosTemp("","","","","FALSE");
	$("#divCurpBotones").show();
	$("#divCurpBotonCancelar").hide();
}

function actualizaDatosTemp(curp,ap1,ap2,nom,curpValido){
	$("#tempCurp").val(curp); 
	$("#tempAp1").val(ap1); 
	$("#tempAp2").val(ap2); 
	$("#tempNom").val(nom); 
	$("#validacionPorCurp").val(curpValido);
}

function validaSintaxisCURP(curp,opcion){
	if(curp.length == 18){
		reg = / [A-Z]{4}\d{6}[HM][A-Z]{2}[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9][0-9] /;
		if(curp.search(reg)){
			return true;
		}	
	}
	if(opcion == 'consultaSolicitudCurp')
		$.prompt("El formato de la curp: [" + curp + "] no es valido" , {prefix:'cleanblue',buttons:{Aceptar:true}});	
	else
		alert("El formato de la curp: [ " + curp + " ] no es valido\n");
	
	return false;
}

function validaEntidad(ent){
	if (ent.length <= 0)
		return ">Debe seleccionar una entidad federativa\n";
	else
		return "";
}

function validaText(nom,tx,requerido){
	if (tx.length <= 0){
		if(requerido)
			return ">El campo ["+nom+"] debe contener un valor\n";
	}else{
//		var sum = 0;
//		for(var i=0;i<tx.length;i++){
//			if(tx.charAt(i) == " " ){
//				sum++;
//			}
//		}
		if(tx.indexOf('  ') > 0){
			return ">El campo ["+nom+"] no debe contener espacios en blanco dobles\n";		
		}		
	}
	return "";
}

function soloNumeros(e){
	var charCode = window.Event ? e.which : e.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57)){
		return false;		
	}	  
	return true;
}

function limpiaDatos(){
		$("#tCurp").val( quitaEspaciosDatos($("#tCurp").val().toUpperCase()) );
		$("#tNombre").val( quitaEspaciosDatos($("#tNombre").val().toUpperCase()));
		$("#tApellido1").val( quitaEspaciosDatos($("#tApellido1").val().toUpperCase()));
		$("#tApellido2").val( quitaEspaciosDatos($("#tApellido2").val().toUpperCase()));
}

function quitaEspaciosDatos (myString){
	return myString.replace(/^\s+/g,'').replace(/\s+$/g,'');
}

function validaAnio(){
	var anioJsp = $("#tNac").val(); 
	if(anioJsp.length <= 0 ){
		return ">Debe capturar el año.\n";
	}
	var fechaActual = new Date();
	var anioActual = fechaActual.getFullYear();
	if(anioJsp > anioActual ){
		return ">El año no puede ser mayor al actual.\n";
	}	
	if(anioJsp < (anioActual-120) ){
		return ">El año no puede ser menor al actual menos 120.\n";
	}
	return "";
}


/********* RUTINAS PARA REALIZAR LA CONSULTA Y VALIDACION DE USUARIO POR CURP <<<<-----FIN ***************/



/**VALIDA QUE NO EXISTA UNA SOLICITUD*/
function validaConsulta(){

	if(existeSolicitud!="0" && capturaDatos){
		alert("Ya existe una solicitud abierta con IdPortCOP:"+existeSolicitud+", para el teléfono: "+$("#telefono").val() + ", no puede capturar otra más para esta linea ")
		$("#divPerfil").html("");
		$("#botonAceptar").hide();
	}else if(existeSolicitud=="0" || (existeSolicitud!="0" && !capturaDatos ) ){
		$("#botonAceptar").show();
		if(!capturaDatos){
			llenaSolicitud();	
		}
	}
	
	if (varTipoServicio == 'F'){
		var respuesta  = $.prompt("El telefono pertenece a una serie Fija ¿Esta seguro que el donador es Nextel?", {prefix:'cleanblue',
				 					buttons:{Si:true,NO:false},
				 					callback: function (v,m,f){if(!v){$("#divPerfil").html(""); $("#botonAceptar").hide();}}
				 				});
		/*
		if (! confirm ("¿El telefono ${telefonoTO.telefono} pertenece a Nextel?")){
			$("#divPerfil").html("");
			$("#botonAceptar").hide();
		}
		*/
	}
}

/**FUNCION QUE REALIZA EL LLENADO DE LOS DATOS DE LA SOLICITUD*/

function llenaSolicitud(){	
		if(tipoPersona=="F")
			document.formCaptura.tipoPersona[0].checked=true;
		else if(tipoPersona=="M"){			
			document.formCaptura.tipoPersona[1].checked=true;			
			document.getElementById("nombreEmpresa").value=nombreEmpresa;
		}else if(tipoPersona=="P"){
			document.formCaptura.tipoPersona[2].checked=true;
			document.getElementById("nombreEmpresa").value=nombreEmpresa;	
		}						
		cambiaPersona();
		if(tipoPersona=="F" ||tipoPersona=="M"||tipoPersona=="P"){
			document.getElementById("nombre").value=nombre;
			document.getElementById("paterno").value=apPaterno;
			document.getElementById("materno").value=apMaterno;
		}			
		document.getElementById("contacto").value=contacto;
		document.getElementById("email").value=mail;
		document.getElementById("curp").value=curp;
		
		if(idPlataformaDonante=="1"){			
			document.formCaptura.plataformaDonante[1].selected=true;
			cambioPlataforma();
		}else if(idPlataformaDonante=="2"){
			document.formCaptura.plataformaDonante[2].selected=true;
			cambioPlataforma();
		}
		
		if(idPlataformaReceptora=="1"){
			document.formCaptura.plataformaReceptora[1].selected=true;
			cambioPlataforma("RECEPTOR");
		}else if(idPlataformaReceptora=="2"){
			document.formCaptura.plataformaReceptora[2].selected=true;
			cambioPlataforma("RECEPTOR");
		}
		
		if(mercado=="1"){
			document.formCaptura.contrato[0].selected=true;
		}else if(mercado=="2"){
		 	document.formCaptura.contrato[1].selected=true;
		}								
}


/**AGREGA UN TELEFONO A LA LISTA*/
function agregaTelefono(){
	var numeroPadre = $("#telefono").val()
	var numeroHijo  = $("#agregarLista").val();
	var region      = $("[@name=asesorRegion]").val();
	var mercado     = $("#contrato").val();
	var expresion = /\d{10}/;
	var idOperadorDon =$("#idOperadorDonante").val();
	var telefonoRaiz =$("#telefonoRaiz").val();
	var nickOperadorDonante=$("#nickOperadorDonante").val();
	var modalidadRaiz = $("#modalidadRaiz").val();	
	
	if(!expresion.test(numeroHijo)){
		alert("Número no valido");
	}else if(numeroPadre == numeroHijo){
		alert("El Número ya existe en la lista.");
	}else if($("#tablaListaCorpo input:checkbox[@value=" + numeroHijo + "]").length>0){
		alert("El Número ya existe en la lista.");
	}else{
		var queryString = "telefono=" + numeroHijo 
						+ "&idOperadorDonante="+idOperadorDon
						+ "&telefonoRaiz="+telefonoRaiz
						+ "&nickOperadorDonante="+nickOperadorDonante
						+ "&mercado="+mercado
						+ "&modalidadRaiz="+modalidadRaiz;
		if(mercado=="masivo" || mercado=="precorporativo")
			queryString += "&region=" + region; 
								
		$.ajax(	{
				url:"./agregaTelefono.do",
				type:"POST",
				data: queryString,
				cache: false,
				success: agregaTelefonosPerfil
		});
	}
}



/**Elimina un renglon de la tabla*/	
function quitar(){
	$("#tablaListaCorpo input:checked").each(
		function(){
			var tr = "#" + this.value;
			$(tr).remove();			
			$("#spTotal").html($("#tablaListaCorpo [@name=listaCorpo]").length);
		}
	);
}

function agregaTelefonoRango(){
	if(verificaRango()){
		var telefonoRaiz =$("#telefonoRaiz").val(); 
		var rangoInicial = $("#rangoInicial").val();
		var rangoFinal   =  $("#rangoFinal").val();			
		var region      = $("[@name=asesorRegion]").val();
		var mercado     = $("#contrato").val();
		var idOperadorDon =$("#idOperadorDonante").val();					
		var nickOperadorDonante=$("#nickOperadorDonante").val();	
		var modalidadRaiz = $("#modalidadRaiz").val();	
			
		var queryString = "rangoFinal=" + rangoFinal
						+ "&rangoInicial=" + rangoInicial 
						+ "&idOperadorDonante="+idOperadorDon
						+ "&telefonoRaiz="+telefonoRaiz
						+ "&nickOperadorDonante="+nickOperadorDonante
						+ "&mercado="+mercado
						+ "&modalidadRaiz="+modalidadRaiz;
						
		if(mercado=="masivo" || mercado=="precorporativo")
			queryString += "&region=" + region; 
								
		$.ajax(	{
				url:"./agregaTelefonoRango.do",
				type:"POST",
				data: queryString,
				cache: false,
				success: agregaTelefonosPerfil
		});
		
	}
}

function agregaTelefonoArchivo(){
	
	var options = { 
		url:		"./agregaTelefonoArchivo.do",
		success:	agregaTelefonosPerfil
	};
	
	$("#formCaptura").ajaxSubmit(options);
	return false; // cancel conventional submit
} 

 
function agregaTelefonosPerfil(data){	
	if($(data)[0].id == "tablaListaNueva"){
		var total = $(data)[0].rows.length;	
		for(var i=0;i<total;i++){
			var idRenglon =  $(data)[0].rows[i].id;							
			if(!$("#tablaListaCorpo input:checkbox[@value=" + idRenglon + "]").length>0){			
				var texto = $(data)[0].rows[i].innerHTML;
				$("#tablaListaCorpo tbody").append("<TR id='"+idRenglon+"'>"+texto+"</TR>");
				$("#spTotal").html($("#tablaListaCorpo [@name=listaTelefonos]").length);
			}				
		}
	}else{
		$.prompt(data, {prefix:'cleanblue',
	 					buttons:{Aceptar:true}
	 				});	
	}
}

/**Limpia los campos de Pospago*/
function limpiaPospago(){
	$("#contrato").val("masivo");
	$("#trContrato").hide();
	$("#divRenta").hide();
	$("#divCorporativo").hide();
	limpiaLista();
}

/**Limpia la lista de las lineas excepto el telefonoRaiz*/
function limpiaLista(){
	$("#tablaListaCorpo input:checkbox").each(	  
		function(){			
		  	if(this.value!=$("#telefonoRaiz").val()){		  	
				$("#" + this.value).remove();
			}
		}
	);
	$("#spTotal").html("1");
}

/**Valida el rango de los telefonos*/
function verificaRango(){
	var numero = $("#rangoFinal").val();
	var expresion = /\d{10}/;
	
	if(expresion.test(numero)){
		var fin = parseInt(numero);
		var inicio = parseInt($("#rangoInicial").val());
		if(fin<=inicio){
			alert("El rango final debe ser mayor que el rango inicial.");	
			return false;
		}else{
			return true;
		} 				
	}else{
		alert("El teléfono no debe contener letras.");
		return false;
	}
}
 
/**Cambio de div opara agregar un numero,rango o un archivo*/
function cambiaLista(){
	var rd = $("[@name=rdLista]:checked").val();
	if(rd=="lista"){
		$("#divRango").fadeOut("fast");
		$("#divArchivo").fadeOut("fast");
		$("#divLista").show();		
		$("#spTotal").html($("#tablaListaCorpo [@name=listaTelefonos]").length);
	}else if(rd=="rango"){
		$("#rangoInicial").val($("#telefono").val());
		$("#divLista").fadeOut("fast");
		$("#divArchivo").fadeOut("fast");	
		$("#divRango").show();		
		if($("#rangoFinal").val()!="")
			verificaRango();
	}else if(rd=="archivo"){
		$("#divLista").fadeOut("fast");
		$("#divRango").fadeOut("fast");
		$("#divArchivo").show();
	}
}
 

/**Modifica el Div para realizar la captura de los datos dependiendo de la persona*/
function cambiaPersona(){
	var rd = $("[@name=tipoPersona]:checked").val();
	var ts = $("[@name=tipoSolicitud]:checked").val();
	if(rd=="F"){
		
		$("#trMoral").hide();
	//	$("#trGubernamental").hide();
		$("#trRepresentanteLegal").hide();	
		$("#trFisica").show();
	//	$("#divFechaPortacion").hide();
		$("#divFechaPortacionFisica").show();
		$("#divFechaPortacion").show();
		$("#tdCurpTag").show();
		$("#tdCurpInput").show();
		if(ts=="S"){			
			$("#tdCurpBotones").show();	
		}
	//	$("#divFechaPortacionFisica").show();
	}else if(rd=="M"){
				
		$("#trFisica").show();
	//	$("#trGubernamental").hide();
		$("#trMoral").show();
		$("#trRepresentanteLegal").show();
		$("#divFechaPortacion").show();
		$("#tdCurpTag").hide();
		$("#tdCurpInput").hide();
		$("#tdCurpBotones").hide();
	//	$("#divFechaPortacionFisica").hide();
	}else if(rd=="R"){
	//	$("#trMoral").show();
	//	$("#trFisica").show();
	//	$("#trGubernamental").show();
	//	$("#trRepresentanteLegal").hide();
	}
}
 
function cambiaSolicitud(){
	var rd = $("[@name=tipoSolicitud]:checked").val();
	var tp = $("[@name=tipoPersona]:checked").val();
	if(rd=="S"){
		$("#trSolicitud").show();
		if(tp=="F"){
			$("#tdCurpBotones").show();				
		}
	}else if(rd=="R"){
		$("#trSolicitud").show();
		$("#tdCurpBotones").hide();
	}
}
  
/**Oculta o Muestra los datos para la captura de la renta dependiendo de la plataforma*/
function cambioPlataforma(opcion){
	
	var plataformaReceptora = $("select#plataformaReceptora").val();
	var plataformaDonadora = $("select#plataformaDonante").val();
	var tipoPersona = $("[@name=tipoPersona]:checked").val();
	var fzaVta 	   = $("[@name=asesorFuerzaVentasId]").val();
	var tipoSolicitud = $("[@name=tipoSolicitud]:checked").val();
	
	var nombre   = $("[@name=nombre]").val();
	var paterno  = $("[@name=paterno]").val();
	var materno	 = $("[@name=materno]").val();
	var escenario= $("[@name=escenario]").val();
	
	//considerar que solo se muestran promociones de la primera poblacion
	var poblacion = $("[@name=poblacion]").val();
    var modalidad = $("[@name=modalidad]").val();
    var fvPospago = $("[@name=asesorFuerzaVentasPospago]").val();

	if( nombre == null || nombre==""){
		alert("Debe Introducir el nombre, para seleccionar una Promoción");
		$("#trPromociones").hide();
		limpia_promcion();
	}else if(paterno == null || paterno==""){
		alert("Debe Introducir el apellido paterno, para seleccionar una Promoción");
		$("#trPromociones").hide();
		limpia_promcion();
	}else if(materno == null || materno == ""){
		alert("Debe Introducir el apellido materno, para seleccionar una Promoción");
		$("#trPromociones").hide();
		limpia_promcion();
	}else{
		
		//alert(" plataformaDonadora " + plataformaDonadora + " tipoPersona " + tipoPersona);
		
		limpiaPospago();		
		
		if(plataformaDonadora=="1|POSPAGO"){
			//$("#divRenta").show();
		}

		if((tipoPersona!="F") && (plataformaReceptora == "1|POSPAGO")){
			$("#trContrato").show();
			$("#divCorporativo").show();
		}else if((plataformaDonadora !="1|POSPAGO") && (plataformaReceptora == "1|POSPAGO")){
			$("#trContrato").show();
			$("#divCorporativo").hide();
		}else{
			$("#trContrato").hide();
			$("#divCorporativo").hide();
		}
		//Si se cambia la plataforma receptora busca las promociones 
		if(opcion=="RECEPTOR"){
			
			var region     = $("[@name=asesorRegion]").val();
			var plataforma = plataformaReceptora.split("|");
			var telefono   = $("[@name=telefono]").val();
			var idOperaPropietario =  $("[@name=idOperadorPropietario]").val();
			
			//alert(" plataforma " + plataforma + " tipoPersona " + tipoPersona);
			if(plataforma == null ||  plataforma == "" ){
				//alert("limpia ");
				//alert("Seleccione una plataforma destino");
				$("#trPromociones").hide();	
			}else{
				//Limpia promocion anterior	
				$("#idPromocion").val("");
				$("#descPromocion").val("");
				$("#promocionPlataforma").val("");
				//Lanza consulta de nuevas promociones
				obtienePromociones(region, plataforma[0],telefono,idOperaPropietario,fzaVta,nombre,paterno,materno,tipoPersona,tipoSolicitud,escenario, poblacion, modalidad, fvPospago);
				$("#trPromociones").show();	
			}
		}

	}

}

/**Cambio de contrato*/
function cambioContrato(){
	var contrato = $("select#contrato").val();
	if(contrato == "corporativo"){
		$("#divCorporativo").show();
	}else{
		$("#divCorporativo").fadeOut("fast");
	}
}


/**Funcion para validar que existan todas las poblaciones*/
function validaPoblacion(){
   var poblaciones = document.getElementsByName("listaTelefonos");		
   if(poblaciones!=null){
     for(i=0;i<poblaciones.length;i++){
     	var poblacion = poblaciones[i].value;     	
     	var cadena = poblacion.split("|");     	 
     	if(cadena[1]==""){
     		alert("Debe Seleccionar una población para el número: " + cadena[0]);
     		return false;
     	}
     }	
   }
   return true;
}

/** FUNCIONES QUE ENVIA LA SOLCIITUD */

function sendForm(){
		
	//Valida las poblaciones
	if(! validaPoblacion()) return false;
	
	//Valida la promocion
	if( $("#idPromocion").val() == "") return alert("Debe indicar la promoción a aplicar.");
	
	//Valida las plataformas
	if( $("select#plataformaDonante").val() == "") return alert("Debe indicar la plataforma donante.");
	if( $("select#plataformaReceptora").val() == "") return alert("Debe indicar la plataforma receptora.");
	//if( $("select#plataformaDonante").val() == "1|pospago"){
	//	if(document.getElementById("fechaLimitePago").value == "") return alert("Debe indicar la fecha límite de pago de la factura.");
	//}
	
	$('input:text').each(function(){
		if(this.id != 'email'){
			var val = jQuery.trim(this.value);
			this.value = escape(this.value.toUpperCase());
		}	
	});
	
	var queryString = $('#formCaptura').formSerialize(); 
	// Enviando la generacion del folio
	$.ajax(	{
			url:"./capturaSolicitud.do",
			type:"POST",
			data: queryString,
			cache: false,
			success: generaFolio
	});
}
/**Valida que se haya generado el folio de la solicitud*/
function generaFolio(html){
	// Verificar si hay errores o no
	limpiaCaracteres();
	if(html.indexOf("error")>=0)
		$.prompt(html, {prefix:'cleanblue',
	 					buttons:{Aceptar:true}
	 				});
	else
		$.prompt(html, {prefix:'cleanblue', buttons:{}});
	
}
/***/
function limpiaCaracteres(){
	//Escapando los caracteres especiales
	$('input:text').each(function(){
		var val = jQuery.trim(this.value);
		this.value = unescape(this.value.toUpperCase());	
	});
}

function obtienePromociones(region,plataforma,telefono,idOperaPropietario,fzaVta,nombre,paterno,materno,tipoPersona,tipoSolicitud,escenario,poblacion,modalidad,fvPospago){
	var queryString = "region=" + region
								+"&plataforma="+plataforma
								+"&telefono="+telefono
								+"&idOperaPropietario="+idOperaPropietario
								+"&fzaVta="+fzaVta
								+"&nombre="+encodeURIComponent(nombre)
								+"&paterno="+encodeURIComponent(paterno)
								+"&materno="+encodeURIComponent(materno)
								+"&tipoPersona="+tipoPersona	
								+"&tipoSolicitud="+tipoSolicitud
								+"&escenario="+escenario
								+"&poblacion=" + poblacion
								+"&modalidad=" + modalidad
								+"&fvPospago=" + fvPospago; 	
		$.ajax(	{
				url:"./consultaPromociones.do",
				type:"POST",
				data: queryString,
				cache: false,
				success: muestraPromocion
		});
} 
 
 
function muestraPromocion(html){	
	
	//Detiene Ajax
		$("input:button").each(
		function(){
			this.disabled=false;
		}
	);
	$("#divLoading").fadeOut("fast");
	
	//muetra resultados
	if(html.indexOf("totPromo=")<0){
		lstPromociones = "";
		eval(html);
	}else{
	 	lstPromociones = html;
		cambiaPromocion();
	 }
}

function cambiaPromocion(){	
	if(lstPromociones != "")
		$.prompt(lstPromociones, {prefix:'cleanblue',
	 					buttons:{Aceptar:true}
	 				});
	 /*
	 else
	
	 	$.prompt("No hay promociones disponibles", {prefix:'cleanblue',
	 					buttons:{Aceptar:true}
	 				});
	 */
}

var selectorPromocion = null;

	function establecePromocion(id, descripcion, plataforma, selector){
		
	
		var plataformaReceptora = $("select#plataformaReceptora").val().split("|");
		
		//alert("RE:[" + plataformaReceptora[0] + "] PR:[" + plataforma + "]");
		
		if(plataforma == "" || plataformaReceptora[0] == plataforma){
			$("#idPromocion").val(id);
			$("#descPromocion").val(descripcion);
			$("#promocionPlataforma").val(plataforma);
		}else{
		 	$.prompt("La promocion seleccionada no corresponde a la plataforma receptora", {prefix:'cleanblue',
	 					buttons:{Aceptar:true}
	 				});
		}
		  
		if(selectorPromocion != null){
			selectorPromocion.className="txtSumNormalWhite"
		}
		
		if(selector != null){
			selector.className="txtSumSelect";
			selectorPromocion = selector;
		}
	}
 
	function valida_caracteres(e){ //e --> evento
		 
		//obtiene el valor decimal de la tecla que se oprime
	    tecla = (document.all) ? e.keyCode : e.which; // 2
    
	    //la tecla de retroceso es valida
	    if (tecla==8) return true; // 3 
	    
	    //expresion regular para que se acepten unicamente letras en el campo
	    patron =/[A-Za-zñÑ0-9\s._,-]/; // 4
	    //patron =/[a-zA-Z]/;
	    //convierte el valor decimal del ascii a caracter
	    te = String.fromCharCode(tecla); // 5
	    
	    if(!patron.test(te)){
		 	$.prompt("Está ingresando un caracter no válido: " + te + " .Favor de verificarlo ", {prefix:'cleanblue',
					buttons:{Aceptar:true}
				});
	    	
	    }else{
	    	return patron.test(te); // 6
	    }	
	}
	
	function valida_nombre(e){ //e --> evento
		 
		//obtiene el valor decimal de la tecla que se oprime
	    tecla = (document.all) ? e.keyCode : e.which; // 2
    
	    //la tecla de retroceso es valida
	    if (tecla==8) return true; // 3 
	    
	    //expresion regular para que se acepten unicamente letras en el campo
	    patron =/[A-Za-zñÑ\s_-]/; // 4
	    //convierte el valor decimal del ascii a caracter
	    te = String.fromCharCode(tecla); // 5
	    
	    if(!patron.test(te)){
		 	$.prompt("Está ingresando un caracter no válido: " + te + " .Favor de verificarlo ", {prefix:'cleanblue',
					buttons:{Aceptar:true}
				});
	    	
	    }else{
	    	return patron.test(te); // 6
	    }	
	}
	
	
  function limpia_promcion(){
	  
	  //Reinicia select de plataforma
	  $("select#plataformaReceptora").val("")
	  
		//limpia valores de la promocion
		$("#idPromocion").val("");
		$("#descPromocion").val("");
		
		//limpia los campos de Pospago
		$("#trContrato").hide();
		$("#divCorporativo").hide();
	  
  }
  
  function alertaMismoNombre(alertaNombre){
	  
	 	$.prompt(alertaNombre, {prefix:'cleanblue',
				buttons:{Aceptar:true}
			});
	  
  }
	 
	