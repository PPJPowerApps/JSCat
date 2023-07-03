async function callAction(executionContext) {
    formContext = executionContext.getFormContext();
    // Formtype 2 = Update Form
    if (formContext.ui.getFormType() == 2) { 
        var proAttr = formContext.getAttribute("cr8e5_productoaofrecer").getValue();
        var getId = formContext.data.entity.getId().replace("{", "").replace("}", "");

        var alertOptions = { height: 200, width: 450 };

        var alertStringsAlert = {
            text: "Este producto ya se ha ofrecido anteriormente, porfavor intente con uno diferente",
            title: "Alerta",
            confirmButtonLabel: "Aceptar",
        };

        var alertStringsERROR = {
            text: "Existe un problema en este momento, porfavor intente mas tarde o contacte con el soporte",
            title: "Error",
            confirmButtonLabel: "Aceptar",
        };

        if (proAttr != null) {
            proAttr = proAttr[0].id.replace("{", "").replace("}", "")
            var request = new new_ApiParameters(getId, proAttr, proAttr)

            Xrm.WebApi.online.execute(request)
                .then(function (result) {
                    if (result.ok) {
                        return result.json()
                    }
                })
                .then(function (response) {
                    if (!response.respuesta) {
                        Xrm.Navigation.openAlertDialog(alertStringsAlert, alertOptions);
                        formContext.getAttribute("cr8e5_productoaofrecer").setValue(null);
                    }
                })
                .catch((err) => {
                    console.log(err)
                    Xrm.Navigation.openAlertDialog(alertStringsERROR, alertOptions);

                });
        }

        function new_ApiParameters(entity,proAttr) {
            this.entity = entity;
            this.proAttr = proAttr;

            this.getMetadata = function () {
                return {
                    operationName: "api_productos",
                    boundParameter: null,
                    parameterTypes: {
                        entity: {
                            typeName: "Edm.String",
                            structuralProperty: 1,
                        },
                        proAttr: {
                            typeName: "Edm.String",
                            structuralProperty: 1,
                        }
                    },
                    operationType: 0,
                };
            };
        }
    }
}