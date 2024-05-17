document.addEventListener('DOMContentLoaded', () => {   
   
    const configureButton = document.getElementById("configure-button");
    const diagnoseButton = document.getElementById("diagnose-button");
    
    let selectedDevice;
    function createDeviceUI(usbDevice){
        const deviceId = `${usbDevice.vendorId}-${usbDevice.productId}`;
        listedDevices.push(deviceId);
        const deviceDetailsContainer = document.getElementById('device-container');
        const deviceDetails = document.createElement("div");
        deviceDetails.setAttribute("class", "device-row");
        deviceDetails.setAttribute("id", deviceId);
        deviceDetailsContainer.appendChild(deviceDetails);
        const col1 = document.createElement("div");
        const col2 = document.createElement("div");
        const col3 = document.createElement("div");
        col1.setAttribute("class", "column");
        col2.setAttribute("class", "column");
        col3.setAttribute("class", "column");

        col1.setAttribute("id", "column-1");
        col2.setAttribute("id", "column-2");
        col3.setAttribute("id", "column-3");

        deviceDetails.appendChild(col1);
        deviceDetails.appendChild(col2);
        deviceDetails.appendChild(col3);

        col1.textContent = deviceId;
        col2.textContent = "Unknown";
        const existingDeviceIndex = storedDevices.findIndex(device => device.id === deviceId);
        if(storedDevices && storedDevices !== undefined && storedDevices !== "[object Object]")
        if (existingDeviceIndex !== -1) {
            if(storedDevices[existingDeviceIndex].name !== "")
                col2.textContent = storedDevices[existingDeviceIndex].name;
        } 
        col3.textContent = "Ready"

        deviceDetails.addEventListener('click', () => {
            const devices = document.querySelectorAll(".device-row");
            devices.forEach(device => {
                if(device.id === deviceId){
                    device.classList.add('selected-row');
                    configureButton.disabled = false;  
                    diagnoseButton.disabled = false;
                    selectedDevice = usbDevice;
                }
                else {
                    device.classList.remove('selected-row');
                }
            })
        });
    }

    configureButton.addEventListener("click", () => {
        console.log("configure")
        window.location.href = "../../views/config/general-config.html"
    });
    
    diagnoseButton.addEventListener("click", () => {
        window.location.href = "../../views/diagnos/diagnostics.html"
    })

    document.getElementById("settings-button").addEventListener("click", () => {
    })
});
