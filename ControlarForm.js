function ControlarForm(executionContext) {
  formContext = executionContext.getFormContext();

  if (formContext.ui.getFormType() == 1) {
    var field = formContext.getControl("cr8e5_ejecutivo");
    if (field) {
      field.setVisible(false);
    }
    var escala = formContext.getControl("Escala");
    if (escala) {
      escala.setVisible(false);
    }
  }
}
