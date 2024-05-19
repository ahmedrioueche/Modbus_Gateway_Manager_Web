       
    /*========================Brief================================
    This file handles: 
        


    ===============================================================*/
 
    localStorage.setItem('defaultDeviceConfig', JSON.stringify(defaultDeviceConfig));

    const container = document.querySelector(".config-content");
    const macAddressInput = document.getElementById("macAddressInput");
    const deviceNameEl = document.getElementById("deviceName");

    //get opened device id
    const deviceId = await getConfigDeviceId();
    //get stored devices
    let storedDevices = JSON.parse(localStorage.getItem('devices')) || [];
    const existingDeviceIndex = storedDevices.findIndex(device => device.id === deviceId);
    const storedMacAddress = storedDevices[existingDeviceIndex].macAddress;
    if (existingDeviceIndex !== -1) {
        console.log("storedDevices[existingDeviceIndex].macAddress", storedDevices[existingDeviceIndex].macAddress)
        if(storedMacAddress)
            macAddressInput.value = formatAddress(storedDevices[existingDeviceIndex].macAddress);
        deviceNameEl.value = storedDevices[existingDeviceIndex].name; 
    } 
    else {
        macAddressInput.value = formatAddress(defaultMacAddress);
        deviceNameEl.value = defaultDeviceConfig.name;
    }

    document.getElementById("next-button").addEventListener("click", () => {
        const macAddressString = macAddressInput.value.trim();
        const macAddress = macAddressString.trim().split(/[:-]/);
        const deviceName = deviceNameEl.value.trim();
        
        console.log("macAddress", macAddress)
        let result = checkUserData(macAddressString, deviceName)
        if(result === status.VALID){
            saveUserData(macAddress, deviceName);
            window.location.href = "admin-network-config.html"
        }
        else {
            const macAddressDiv = document.getElementById("macAddress");
            const errorDivs = container.querySelectorAll(".error");
            if (errorDivs) {
                errorDivs.forEach(errorDiv => {
                    errorDiv.remove();
                })  
            }
    
            const newErrorDiv = document.createElement("div");
            newErrorDiv.classList.add("error");
            if(result === status.VOID){
                newErrorDiv.textContent = "Please fill in this field";
                macAddressDiv.appendChild(newErrorDiv);
            }
            else if(result === status.INVALID){
                newErrorDiv.textContent = "Please check the integrity of the data";
                macAddressDiv.appendChild(newErrorDiv);
            }
        } 
    });


    function checkUserData(macAddress, deviceName){

        var macAddressRegex = /^(([0-9A-Fa-f]{2}|[0-9A-Fa-f]{1})[:-]){5}([0-9A-Fa-f]{2}|[0-9A-Fa-f]{1})$/;
        console.log("macAddress", macAddress)
        if(!macAddress)
            return status.VOID;

        if (!macAddressRegex.test(macAddress)) {
            return status.INVALID;
        }

        return status.VALID;
    }

    function saveUserData(macAddress, deviceName){
        
        if (existingDeviceIndex !== -1) {
            storedDevices[existingDeviceIndex].name = deviceName;
            storedDevices[existingDeviceIndex].macAddress = macAddress;
        }
        else {
            storedDevices.push({ 
                id: deviceId, 
                name: deviceName, 
                mode: "RTU Server Mode",
                baudrate: "9600",
                parity: "None",
                stopBits: "1",
                dataSize: "8",
                macAddress: macAddress,
                slaveID: 5,
                networkIP: defaultDeviceConfig.networkIP,
                networkMask: defaultDeviceConfig.networkMask,
                networkGateway: defaultDeviceConfig.networkGateway,
                remoteIP: defaultDeviceConfig.remoteIP,
            });    
        }
        localStorage.setItem('devices', JSON.stringify(storedDevices));
    }

    async function getConfigDeviceId(){
        const configDevice = await window.serialAPI.getOpenedDevice();
        const deviceId = `${configDevice.vendorId}-${configDevice.productId}`;
        return deviceId;
    }

    function formatAddress(address){
       return address.map(byte => byte.toString(16)).join(':').toUpperCase();
    }
    
    document.getElementById("cancel-button").addEventListener("click", () => {
        window.mainAPI.closeWindow(1); //config window index = 1
    })
