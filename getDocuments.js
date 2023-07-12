const form_onload = (executionContext) => {
    var formContext = executionContext.getFormContext();

    if (formContext.ui.getFormType() == 2) {
        var wrControl = formContext.getControl("WebResource_documents");
        var getId = formContext.data.entity.getId().replace("{", "").replace("}", "");
        if (wrControl) {
            wrControl.getContentWindow().then(
                function (contentWindow) {
                    callFlow(getId, contentWindow)
                }
            )
                .catch(err => {
                console.error(err)
            })
        }
    }
}

const callFlow = async (id, content) => {
    var documents = []
    const guid = {
        guidClienteProducto: id
    }
    try {
        const response = await fetch(
            "https://prod-30.brazilsouth.logic.azure.com/workflows/b913b0a08f9c41c5a412d76ccfd8a5b0/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=FCSVCyq-1P1zobkZwxZ3-z5bKcVXaHdy8CzijskrsCE",
            {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(guid),
            }
        );
        response.json().then(result => {
            result.forEach(ele => {
                documents.push({ name: ele.name, state: ele.state, comment: ele.comment, modified: ele.modified, url: ele.url })
            })
            content.setDataTable(documents)
        })
        .catch(err => {
            console.error(err)
        })
    } catch (err) {
        console.error(err)
    }
}