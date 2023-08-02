// const utility = await import('./Utilities/utility.js')
function prospecto() { }

prospecto.onLoad = (executionContext) => {
    const formContext = executionContext.getFormContext();
    // FormType 1 == Create Form
    if (formContext.ui.getFormType() == 1) {
        //Ocultar Escala de tiempo y campo ejecutivo en formulario de creacion
        let data = [
            formContext.getControl("cr8e5_ejecutivo"),
            formContext.getControl("Escala")
        ]
        hideFields(data);
    }
}

prospecto.ValidateRut = (executionContext) => {
    // const utility = await import('./Utilities/utility.js')
    // utility.default.test("HOLA")
    // utility.default.test2("NO FUNCA")
    const formContext = executionContext.getFormContext();
    let rutAttr = formContext.getAttribute("cr8e5_rut");
    let rutCont = formContext.getControl("cr8e5_rut");
    if (rutAttr) {
        validateRut(rutCont, rutAttr)
    }
}

prospecto.clearForm = (primaryControl) => {
    const formContext = primaryControl
    let data = [
        formContext.getAttribute("cr8e5_name"),
        formContext.getAttribute("cr8e5_correo"),
        formContext.getAttribute("cr8e5_rut"),
        formContext.getAttribute("cr8e5_productoaofrecer")
    ]
    clearFields(data)
}

prospecto.sendBenefits = async () => {
    const urlPA = "https://prod-01.brazilsouth.logic.azure.com/workflows/a241a98f7a0f4976a3f13b4aae399017/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=1Rh0ZLzd_mrAQilSs65FZp4WUA2qJTlDJrSNacLbtKU"
    let alert = {
        sucess: {
            text: 'El proceso finalizó correctamente',
            title: 'Correcto',
            confirmButtonLabel: 'Ok'
        },
        error: {
            text: 'Ocurrió un error, intentelo de nuevo. Si el problema persiste contacte con el administrador',
            title: 'Error',
            confirmButtonLabel: 'Aceptar',
        },
        options: {
            height: 200, width: 450
        },
    }
    await callSendBenefits(urlPA, alert)
}

async function callSendBenefits(url, alert) {
    try {
        Xrm.Utility.showProgressIndicator("Please wait...");
        await fetch(url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(""),
            }
        );
        Xrm.Utility.closeProgressIndicator();
        Xrm.Navigation.openAlertDialog(alert.sucess, alert.options);
    } catch (error){
        Xrm.Utility.closeProgressIndicator();
        Xrm.Navigation.openAlertDialog(alert.error, alert.options);
    }
}


function clearFields(data) {
    data.map(element => {
        element ? element.setValue(null) : console.log("Ocurrio un error al limpiar los campos")
    })
}

function hideFields(data) {
    data.map(element => {
        element ? element.setVisible(false) : console.log("Ocurrio un problema")
    })
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