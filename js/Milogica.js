/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Ingresar una funcion a la libreria Jquery
 * @returns {undefined}
 */
jQuery.fn.LimpiarFor = function () {
    $(this).each(function () {
        this.reset();
    });
};
// do something on document ready
$(document).ready(function () {
    function MIAjax(request, parametros, ejecucion) {
        $.ajax({
            // la URL para la petición
            url: request,
            // la información a enviar
            // (también es posible utilizar una cadena de datos)
            data: parametros,
            // especifica si será una petición POST o GET
            type: 'POST',
            // el tipo de información que se espera de respuesta
            dataType: 'html',
            // código a ejecutar si la petición es satisfactoria;
            // la respuesta es pasada como argumento a la función
            success: function (datos) {
                ejecucion(datos);
            },
            // código a ejecutar si la petición falla;
            // son pasados como argumentos a la función
            // el objeto de la petición en crudo y código de estatus de la petición
            error: function (xhr, status) {
                alert('Disculpe, existió un problema');
            },
            // código a ejecutar sin importar si la petición falló o no
            complete: function (xhr, status) {
                //  alert('Petición realizada');
            }
        });
    }

    function alerta(pVMsn) {
        $("#LosMensajes").html(pVMsn + "<br><br><button id='cerrarDialog' class='btn btn-info'>Cerrar Ventana</button>");

        $("#cerrarDialog").unbind("click").click(function () {
            $(".ui-dialog-titlebar-close").trigger("click");
        });

        $("#dialog").dialog();
    }

    function validarFor(formulario, reglas, mensajes, metodo, toptip) {
        $("#" + formulario).validate({
            rules: reglas,
            messages: mensajes,
            //    errorLabelContainer: "#summary",
            //   wrapper: "li",
            tooltip_options: toptip,
            submitHandler: function () {
                metodo();
            }
        });
    }



    function traerindex() {
        var request = "cIndex.php";
        var parametros = "A=1";
        var ejecucion = function (datos) {
            document.getElementById("contenido").innerHTML = datos;
        };
        MIAjax(request, parametros, ejecucion);
    }

    $("#aIndex").click(function () {
        traerindex();
    });



    function llenarSelec() {
        var limite = localStorage.length;
        for (var i = 0; i < limite; i++) {
            var code = localStorage.key(i);
            console.log(localStorage.getItem(code));
            var curso = JSON.parse(localStorage.getItem(code));
            if (curso.type == "cur") {
                $("#fkcurso").append("<option value='" + curso.id + "'>" + curso.nombre + "</option>");
            }
        }
    }
    function llenarSelec2() {
        var limite = localStorage.length;
        for (var i = 0; i < limite; i++) {
            var code = localStorage.key(i);
            console.log(localStorage.getItem(code));
            var genero = JSON.parse(localStorage.getItem(code));
            if (genero.type == "gen") {
                $("#genero").append("<option value='" + genero.id + "'>" + genero.nombre + "</option>");
            }
        }
    }

    $("#aForm").click(function () {
        var request = "Formulario.php";
        var parametros = "A=1";
        var ejecucion = function (datos) {
            document.getElementById("contenido").innerHTML = datos;

            llenarSelec();
            llenarSelec2();

            var reglas = {CC: {required: true, number: true, digits: true}, nom: {required: true, maxlength: 70}, correo: {required: true, email: true}, ccorreo: {equalTo: "#correo"}, fkcurso: {required: true, number: true}, genero: {required: true}};
            var mensajes = {CC: {required: "La CC es Obligatoria", number: "La cc es un numero", digits: "La CC no puede tener ni puntos ni comas"}, ccorreo: {equalTo: "Debe ingresar el mismo valor del campo superior a este campo"}};
            var metodo = function () {
                // alert("Los datos fueron ingresados segun lo solicitado");
                var cc = $("#CC").val();
                var nom = $("#nom").val();
                var correo = $("#correo").val();
                var curso = $("#fkcurso").val();
                var genero = $("#genero").val();

                var Persona = {
                    cc: cc,
                    nom: nom,
                    correo: correo,
                    curso: curso,
                    genero: genero,
                    type: "per"
                };
                if (gbCurso == null) {
                    localStorage.setItem(localStorage.length, JSON.stringify(Persona));
                    $("#limpiar").trigger("click");
                    alerta("El usuario <b>" + Persona.nom + "</b> fue almacenado");
                } else {
                    localStorage.setItem(gbCode, JSON.stringify(Persona));
                    alerta("El usuario <b>" + Persona.nom + "</b> fue Modificado");
                    $("#alista").trigger("click");
                }
                gbCode = null;
                gbCurso = null;
            };
            var toptip = {
                cc: {html: false, placement: 'left'},
                nom: {placement: 'left', html: true},
                correo: {placement: 'right', html: true}
            };
            validarFor("registro", reglas, mensajes, metodo, toptip);
        };
        MIAjax(request, parametros, ejecucion);
    });

    $("#alista").click(function () {
        var request = "listado.php";
        var parametros = "a=1";
        var ejecutar = function (datos) {
            $("#contenido").html(datos);

            var limite = localStorage.length;
            var contador = 1;
            for (var i = 0; i < limite; i++) {
                var code = localStorage.key(i);
                var persona = JSON.parse(localStorage.getItem(code));
                if (persona.type == "per") {
                    var tr = $("<tr></tr>");
                    tr.append("<td>" + contador + "</td>");
                    tr.append("<td>" + persona.cc + "</td>");
                    tr.append("<td>" + persona.nom + "</td>");
                    tr.append("<td>" + persona.correo + "</td>");
                    tr.append("<td>" + getCurso(persona.curso).nombre + "</td>");
                    tr.append("<td>" + getGenero(persona.genero).nombre + "</td>");
                    tr.append("<td class='mimouse mod' code='" + code + "'>Modificar</td>");
                    tr.append("<td class='mimouse eli' code='" + code + "'>Eliminar</td>");
                    $("#conTabla").append(tr);
                    contador = contador + 1;
                }
            }
            eliminar(".eli");
            modifocar(".mod");
        };
        MIAjax(request, parametros, ejecutar);
    });

    traerindex();

    function eliminar(pvEleme) {
        $(pvEleme).click(function () {
            var code = $(this).attr("code");
            localStorage.removeItem(code);
            $(this).parent().remove();
        });
    }
    var gbCurso = null;
    var gbCode = null;

    function modifocar(pvEleme) {
        $(pvEleme).click(function () {
            gbCode = $(this).attr("code");
            gbCurso = JSON.parse(localStorage.getItem(gbCode));

            $("#aForm").trigger("click");
            setTimeout(function () {
                $("#regis").fadeOut(0);
                $("#modifi").fadeIn(0);
                $("#CC").val(gbCurso.cc);
                $("#nom").val(gbCurso.nom);
                $("#correo").val(gbCurso.correo);
                $("#ccorreo").val(gbCurso.correo);
                $("#fkcurso").val(gbCurso.curso);
                $("#genero").val(gbCurso.genero);
            }, 500);
        });
    }
    /*
     $("#genero").click(function () {
         var seleccion = document.getElementById('genero');
         seleccion.addEventListener('change',function(){
             var selectedOption = this.options[seleccion.selectedIndex];
             console.log(selectedOption.value + ': ' + selectedOption.text);
         });
     };*/
     
    function getCurso(pvID) {
        var limite = localStorage.length;
        for (var i = 0; i < limite; i++) {
            var code = localStorage.key(i);
            console.log(localStorage.getItem(code));
            var curso = JSON.parse(localStorage.getItem(code));
            if (curso.type == "cur" && curso.id == pvID) {
                return curso;
            }
        }
        return null;
    }
    function getGenero(pvID) {
        var limite = localStorage.length;
        for (var i = 0; i < limite; i++) {
            var code = localStorage.key(i);
            console.log(localStorage.getItem(code));
            var genero = JSON.parse(localStorage.getItem(code));
            if (genero.type == "gen" && genero.id == pvID) {
                return genero;
            }
        }
        return null;
    }

    var curso1 = {
        nombre: "curso1",
        id: 1,
        type: "cur"
    };
    localStorage.setItem(localStorage.length, JSON.stringify(curso1));
    var curso2 = {
        nombre: "curso2",
        id: 2,
        type: "cur"
    };
    
     localStorage.setItem(localStorage.length, JSON.stringify(curso2));
     var genero1 = {
     nombre: "Femenino",
     id: 3,
     type: "gen"
     };
     localStorage.setItem(localStorage.length, JSON.stringify(genero1));
     var genero2 = {
     nombre: "Masculino",
     id: 4,
     type: "gen"
     };
     localStorage.setItem(localStorage.length, JSON.stringify(genero2));
     var genero3 = {
     nombre: "LGTBI",
     id: 5,
     type: "gen"
     };
     localStorage.setItem(localStorage.length, JSON.stringify(genero3));

});


