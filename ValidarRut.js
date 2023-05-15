function validarRut(executionContext) {
  formContext = executionContext.getFormContext();
  var rutAttr = formContext.getAttribute("cr8e5_rut");
  if (rutAttr) {
    if (!Fn.validaRut(rutAttr.getValue())) {
      formContext
        .getControl("cr8e5_rut")
        .setNotification("El rut ingresado no es válido", "validationError");
    } else {
      formContext.getControl("cr8e5_rut").clearNotification("validationError");
    }
  }
}

var Fn = {
  // Valida el rut con su cadena completa "XXXXXXXX-X"
  validaRut: function (rutCompleto) {
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto)) return false;
    var tmp = rutCompleto.split("-");
    var digv = tmp[1];
    var rut = tmp[0];
    if (digv == "K") digv = "k";
    return Fn.dv(rut) == digv;
  },
  dv: function (T) {
    var M = 0,
      S = 1;
    for (; T; T = Math.floor(T / 10)) S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
    return S ? S - 1 : "k";
  },
};
