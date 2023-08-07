function ofrecer() {
    const ids = document.querySelector('input[name="pro"]:checked');
    if (ids != null) {
        const redoc = document.getElementById(ids.value.split('_')[0]).value
        const id = ids.value.split('_')
        var body = {
            idpro: id[0],
            idcli: id[1],
            redoc: redoc
        }
        OfrecerPowerAutomate(body)
    }
}

async function OfrecerPowerAutomate(body = '') {
    try {
        await fetch(
            "https://prod-00.brazilsouth.logic.azure.com:443/workflows/20edc70aede1486ebd6dcd31b2a37e53/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ec7VDWnqX9qe6HM4tOA-T1rdXgmi-lWl2JKw6KJOPYA",
            {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );
        alert('alertmsgsuccess')
    } catch (error) {
        alert('alertmsgfail')
        console.log(`Flow Call finished with error. Status code: ${error}`);
    }
}

const alert = (classname) => {
    const alert = document.getElementById(classname)
    alert.style.display = "block"
    alert.style.animation = "fade-in 3s"
    setTimeout(() => {
        alert.style.animation = "fade-out 3s"
        alert.style.display = "block"
        alert.onanimationend = () => {
            alert.style.display = "none"
        }
    }, 5000)
    
}