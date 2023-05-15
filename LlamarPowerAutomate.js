async function CallPowerAutomate() {
  //Generamos la variables del cuadro de dialogo que se abrirá en caso correcto.
  var alertStrings = {
    text: "El proceso finalizó correctamente",
    title: "CORRECTO",
    confirmButtonLabel: "Ok",
  };
  var alertOptions = { height: 200, width: 450 };
  //Generamos la variables del cuadro de dialogo que se abrirá en caso de error.
  var alertStringsERROR = {
    text: "Ocurrió un error, intentelo de nuevo. Si el problema persiste contacte con el administrador",
    title: "ERROR",
    confirmButtonLabel: "Aceptar",
  };
  var alertOptionsERROR = { height: 200, width: 450 };
  Xrm.Utility.showProgressIndicator("Please wait...");
  //Haremos la llamada a nuestro Power Automate.
  try {
    await fetch(
      "https://prod-01.brazilsouth.logic.azure.com/workflows/a241a98f7a0f4976a3f13b4aae399017/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=1Rh0ZLzd_mrAQilSs65FZp4WUA2qJTlDJrSNacLbtKU",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(""),
      }
    );
    console.log("Flow call finished Ok");
    Xrm.Utility.closeProgressIndicator();
    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
  } catch (error) {
    Xrm.Utility.closeProgressIndicator();
    console.log(`
    Flow Call finished with error. Status code: ${error}
    `);
    Xrm.Navigation.openAlertDialog(alertStringsERROR, alertOptionsERROR);
  }
}
