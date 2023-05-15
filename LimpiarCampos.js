function limpiarCampos(primaryControl) {
  var formContext = primaryControl;
  var nombre = formContext.getAttribute("cr8e5_name").setValue(null);
  var correo = formContext.getAttribute("cr8e5_correo").setValue(null);
  var rut = formContext.getAttribute("cr8e5_rut").setValue(null);
  var producto = formContext
    .getAttribute("cr8e5_productoaofrecer")
    .setValue(null);
}
