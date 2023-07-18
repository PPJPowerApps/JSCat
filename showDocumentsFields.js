function onload(executionContext) {
    const context = executionContext.getFormContext()
    const guidstate = "cr8e5_estado_documento"
    const guidcomment = "cr8e5_comentario_documento"
    const stateValue = context.getAttribute(guidstate)
    const commentValue = context.getAttribute(guidcomment)
    const stateVisible = context.getControl(guidstate)
    const commentVisible = context.getControl(guidcomment)

    console.log(stateValue.getValue())
    if (stateValue.getValue()!=null) {
        stateVisible.setVisible(true)
    }
    if (commentValue.getValue()!=null) {
        commentVisible.setVisible(true)
    }
}