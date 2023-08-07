function cliente() { }

let logicalNames = {
    webResource: 'WebResource_Ofertas',
    estadoDocumento: 'cr8e5_estado_documento',
    comentarioDocumento: 'cr8e5_comentario_documento',
    customApiName: 'cr8e5_apiproductoscliente'
}

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
}

cliente.showDocumentField = (executionContext) => {
    const formContext = executionContext.getFormContext()
    showDocumentFieldState(formContext)
}

cliente.loadWebProducts = async (executionContext) => {
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
        //Llama a la lista de productos no ofertados
        await populateWebOffer(formContext, alert)
    }
}

async function populateWebOffer(formContext, alert) {
    let data = []
    let wrControl = formContext.getControl("WebResource_Ofertas");
    let getId = formContext.data.entity.getId().replace("{", "").replace("}", "")
    const request = new getProducts(getId)
    const response = await callCustomApi(request, alert)
    response.productos.forEach(pro => {
        data.push({ id: pro.cr8e5_productoaofrecerid, cliente: response.idcliente ,name: pro.cr8e5_name, expiration: pro["cr8e5_fechavigencia@OData.Community.Display.V1.FormattedValue"] })
    })
    if (wrControl) {
        const wr = await getWebControl(wrControl, alert)
        wr.setDataTable(data)
    }
}

function showDocumentFieldState(formContext) {
    const stval = formContext.getAttribute(logicalNames.estadoDocumento)
    const stvis = formContext.getControl(logicalNames.estadoDocumento)
    const comval = formContext.getAttribute(logicalNames.comentarioDocumento)
    const comvis = formContext.getControl(logicalNames.comentarioDocumento)

    stval.getValue() != null ? stvis.setVisible(true) : stvis.setVisible(false)
    comval.getValue() != null ? comvis.setVisible(true) : comvis.setVisible(false)
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

async function callCustomApi(request, alert) {
    try {
        const result = await Xrm.WebApi.online.execute(request)
        const response = await result.json()
        return response
    } catch (error) {
        console.log(error)
        Xrm.Navigation.openAlertDialog(alert.error, alert.options)
    }
}

function getProducts(id) {
    this.id = id
}

getProducts.prototype.getMetadata = () => {
    return {
        operationName: logicalNames.customApiName,
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