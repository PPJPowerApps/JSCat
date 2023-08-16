
function prospecto() { }


let logicalNames = {
    ejecutivo: 'cr8e5_ejecutivo',
    productoaofrecer: 'cr8e5_productoaofrecer',
    escala: 'Escala',
    rut: 'cr8e5_rut',
    nombre: 'cr8e5_name',
    correo: 'cr8e5_correo',
    customApiName: 'cr8e5_apiprospectoproductosofrecidos',
}

prospecto.onLoad = (executionContext) => {
    const formContext = executionContext.getFormContext();
    // FormType 1 == Create Form
    if (formContext.ui.getFormType() == 1) {
        //Ocultar Escala de tiempo y campo ejecutivo en formulario de creacion
        let data = [
            formContext.getControl(logicalNames.ejecutivo),
            formContext.getControl(logicalNames.escala)
        ]
        hideFields(data);
    }
}

prospecto.CheckProductOffer = async (executionContext) => {
    const formContext = executionContext.getFormContext();
    //FormType 2 == Update Form
    if (formContext.ui.getFormType() == 2) {
        var proAttr = formContext.getAttribute(logicalNames.productoaofrecer).getValue();
        var getId = formContext.data.entity.getEntityReference();
        let alert = {
            sucess: {
                text: 'Este producto ya se ha ofrecido anteriormente, porfavor intente con uno diferente',
                title: 'Alerta', confirmButtonLabel: 'Aceptar'
            },
            error: {
                text: 'Ocurrió un error, intentelo de nuevo. Si el problema persiste contacte con el administrador',
                title: 'Error', confirmButtonLabel: 'Aceptar',
            },
            options: {
                height: 200, width: 450
            },
        }
        if (proAttr != null) {
            const request = new checkProductOffered(getId, proAttr[0])
            const check = await callCheckProductOffer(request, alert)
            if (!check.respuesta) {
                Xrm.Navigation.openAlertDialog(alert.sucess, alert.options)
                formContext.getAttribute(logicalNames.productoaofrecer).setValue(null)
            }
        }
    }
}

prospecto.ValidateRut = (executionContext) => {
    const formContext = executionContext.getFormContext();
    let rutAttr = formContext.getAttribute(logicalNames.rut);
    let rutCont = formContext.getControl(logicalNames.rut);
    if (rutAttr) {
        validateRut(rutCont, rutAttr)
    }
}

prospecto.clearForm = (primaryControl) => {
    const formContext = primaryControl
    let data = [
        formContext.getAttribute(logicalNames.nombre),
        formContext.getAttribute(logicalNames.correo),
        formContext.getAttribute(logicalNames.rut),
        formContext.getAttribute(logicalNames.productoaofrecer)
    ]
    clearFields(data)
}

prospecto.sendBenefits = async () => {
    const urlPA = "https://prod-01.brazilsouth.logic.azure.com/workflows/a241a98f7a0f4976a3f13b4aae399017/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=1Rh0ZLzd_mrAQilSs65FZp4WUA2qJTlDJrSNacLbtKU"
    let alert = {
        sucess: {
            text: 'El proceso finalizó correctamente', title: 'Correcto', confirmButtonLabel: 'Ok'
        },
        error: {
            text: 'Ocurrió un error, intentelo de nuevo. Si el problema persiste contacte con el administrador',
            title: 'Error', confirmButtonLabel: 'Aceptar',
        },
        options: {
            height: 200, width: 450
        },
    }
    await callSendBenefits(urlPA, alert)
}

async function callSendBenefits(url, alert, body = '') {
    try {
        Xrm.Utility.showProgressIndicator("Please wait...");
        await fetch(url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );
        Xrm.Utility.closeProgressIndicator();
        Xrm.Navigation.openAlertDialog(alert.sucess, alert.options);
    } catch (error){
        Xrm.Utility.closeProgressIndicator();
        Xrm.Navigation.openAlertDialog(alert.error, alert.options);
    }
}

async function callCheckProductOffer(request, alert) {
    try {
        const result = await Xrm.WebApi.online.execute(request)
        const response = await result.json()
        return response
    } catch (error) {
        console.log(error)
        Xrm.Navigation.openAlertDialog(alert.error, alert.options)
    }
}

function checkProductOffered(entity, proAttr) {
    this.entity = entity;
    this.proAttr = proAttr;
}

checkProductOffered.prototype.getMetadata = () => {
    return {
        operationName: logicalNames.customApiName,
        boundParameter: null,
        parameterTypes: {
            entity: {
                typeName: "mscrm.cr8e5_prospecto",
                structuralProperty: 5,
            },
            proAttr: {
                typeName: "mscrm.cr8e5_productoaofrecer",
                structuralProperty: 5,
            }
        },
        operationType: 0,
    };
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
