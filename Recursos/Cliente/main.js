function cliente() { }

cliente.onLoad = async (executionContext) => {
    const formContext = executionContext.getFormContext()
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
    //FormType 2 == Update Form
    if (formContext.ui.getFormType() == 2) {
        //Muestra u oculta los campos de estado del documento y comentario
        showDocumentFieldState(formContext)
        //Llama a la lista de productos no ofertados
        let wrControl = formContext.getControl("WebResource_Ofertas");
        let getId = formContext.data.entity.getId().replace("{", "").replace("}", "");
        const request = new apiParameters(getId)
        const response = await getProducts(request, alert)
        if (wrControl) {
            const wr = getWebControl(wrControl, alert)
            
        }
    }
}

function showDocumentFieldState(formContext) {
    let data = {
        state: 'cr8e5_estado_documento',
        comment: 'cr8e5_comentario_documento'
    }
    const stval = formContext.getAttribute(data.state)
    const stvis = formContext.getControl(data.state)
    const comval = formContext.getAttribute(data.comment)
    const comvis = formContext.getControl(data.comment)

    stval != null ? stvis.setVisible(true) : stvis.setVisible(false)
    comval != null ? comvis.setVisible(true) : comvis.setVisible(false)
}

async function getWebControl(wrControl, alert) {
    try {
        const response = await wrControl.getContentWindow()
        return response
    } catch (error) {
        console.log(error)
        Xrm.Navigation.openAlertDialog(alert.error, alert.options)
    }
}

async function getProducts(request, alert) {
    try {
        const result = await Xrm.WebApi.online.execute(request)
        const response = await result.json()
        return response.productos
    } catch (error) {
        console.log(error)
        Xrm.Navigation.openAlertDialog(alert.error, alert.options)
    }
}

function apiParameters(id) {
    this.id = id
}

apiParameters.prototype.getMetaData = () => {
    return {
        operationName: "cr8e5_apiproductoscliente",
        boundParameter: null,
        parameterTypes: {
            id: {
                typeName: "Edm.Guid",
                structuralProperty: 5
            }
        },
        operationType: 0,
    };
}