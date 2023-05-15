function form_onload(executionContext) {
    var formContext = executionContext.getFormContext();
    //Alerta de error
    var alertOptions = { height: 200, width: 450 };
    var alertStringsERROR = {
        text: "Existe un problema en este momento, porfavor intente mas tarde o contacte con el soporte",
        title: "Error",
        confirmButtonLabel: "Aceptar",
    };

    if (formContext.ui.getFormType() == 2) {
        var wrControl = formContext.getControl("WebResource_Ofertas");
        var getId = formContext.data.entity.getId().replace("{", "").replace("}", "");
        var products = []
        if (wrControl) {
            wrControl.getContentWindow().then(
                function (contentWindow) {
                    var request = new ApiParameters(getId)
                    Xrm.WebApi.online.execute(request)
                    .then(function (result) {
                        if (result.ok) {
                            return result.json()
                        }
                    })
                    .then(function (response) {
                        response.productos.forEach(pro => {
                            products.push({ id: pro.cr8e5_productoaofrecerid, cliente: response.idcliente ,name: pro.cr8e5_name, expiration: pro["cr8e5_fechavigencia@OData.Community.Display.V1.FormattedValue"] })
                        })
                        contentWindow.setDataTable(products);
                    })
                    .catch((err) => {
                        console.log(err)
                        Xrm.Navigation.openAlertDialog(alertStringsERROR, alertOptions);
                    });
                }
            )
        }
    }

    function ApiParameters(id,) {
        this.id = id;
        this.getMetadata = function () {
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
        };
    }
}
