function prospecto(){}

prospecto.ValidateRut = (executionContext) => {
    const formContext = executionContext.getFormContext();
    let rutAttr = formContext.getAttribute("cr8e5_rut");
    let rutCont = formContext.getControl("cr8e5_rut");
    if (rutAttr) {
        validateRut(rutCont, rutAttr)
    }
}

function validateRut(control, rut) {
    let valor = cleanRut(rut.getValue())
    let bodyRut = valor.slice(0, -1);
    let dv = valor.slice(-1).toUpperCase();
    // Calcular Dígito Verificador "Método del Módulo 11"
    suma = 0;
    multiplo = 2;
    // Para cada dígito del Cuerpo
    for (i = 1; i <= bodyRut.length; i++) {
        // Obtener su Producto con el Múltiplo Correspondiente
        index = multiplo * valor.charAt(bodyRut.length - i);
        // Sumar al Contador General
        suma = suma + index;
        // Consolidar Múltiplo dentro del rango [2,7]
        if (multiplo < 7) {
            multiplo = multiplo + 1;
        } else {
            multiplo = 2;
        }
    }
    // Calcular Dígito Verificador en base al Módulo 11
    dvEsperado = 11 - (suma % 11);
    // Casos Especiales (0 y K)
    dv = dv == "K" ? 10 : dv;
    dv = dv == 0 ? 11 : dv;

    if (dvEsperado != dv) {
        control.setNotification("El rut ingresado no es válido", "validationError");
    } else {
        rut.setValue(formatRut(rut.getValue()))
        control.clearNotification("validationError");
    }
}

function cleanRut(rut) {
    return typeof rut === 'string'
        ? rut.replace(/^0+|[^0-9kK]+/g, '').toUpperCase()
        : ''
}

function formatRut(rut) {
    rut = cleanRut(rut)
    
    var result = rut.slice(-4, -1) + '-' + rut.substr(rut.length - 1)
    for (var i = 4; i < rut.length; i += 3) {
        result = rut.slice(-3 - i, -i) + '.' + result
    }
    return result;
}