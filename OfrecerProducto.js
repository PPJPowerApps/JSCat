function ofrecer() {
    const value = document.querySelector('input[name="pro"]:checked');
    if (value != null) {
        OfrecerPowerAutomate(value.value)
    }
}

async function OfrecerPowerAutomate(id) {
    const ids = id.split('_')
    var proclie = {
        idpro: ids[0],
        idcli: ids[1]
    }
    try {
        await fetch(
            "https://prod-00.brazilsouth.logic.azure.com/workflows/20edc70aede1486ebd6dcd31b2a37e53/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ec7VDWnqX9qe6HM4tOA-T1rdXgmi-lWl2JKw6KJOPYA",
            {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(proclie),
            }
        );
        console.log("Flow call finished Ok");
    } catch (error) {
        console.log(`Flow Call finished with error. Status code: ${error}`);
    }
}