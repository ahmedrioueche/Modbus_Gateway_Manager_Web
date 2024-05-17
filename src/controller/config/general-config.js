document.addEventListener("DOMContentLoaded", async ()=> {
    const randomMacAddress = "3F:5C:DD:56:33:11";
    let deviceId = await getConfigDeviceId();
    let storedDevices = JSON.parse(localStorage.getItem('devices')) || [];
    let defaultDeviceConfig = JSON.parse(localStorage.getItem('defaultDeviceConfig')) || [];
    console.log("defaultDeviceConfig", defaultDeviceConfig)
    console.log("storedDevices", storedDevices);

    let deviceMacAddress = randomMacAddress
    let deviceName = null;
    let deviceIP = null;
    
    const existingDeviceIndex = storedDevices.findIndex(device => device.id === deviceId);
    if (existingDeviceIndex !== -1) {

        deviceMacAddress = storedDevices[existingDeviceIndex].macAddress;
        deviceName = storedDevices[existingDeviceIndex].name;
        deviceIP =  storedDevices[existingDeviceIndex].networkIP;
        document.getElementById("input3").value = deviceName;
        document.getElementById("input2").value = deviceIP;

    } 
    document.getElementById("input1").value = deviceId;

    function saveConfigDevice(){
        //save device's name and id in deviceList in local storage
        let deviceName = document.getElementById("input2").value;
        const existingDeviceIndex = storedDevices.findIndex(device => device.id === deviceId);

        if (existingDeviceIndex !== -1) {
            storedDevices[existingDeviceIndex].name = deviceName;
        } else {
            storedDevices.push({ 
                id: deviceMacAddress, 
                manufId: defaultDeviceConfig.manufId, 
                name: deviceName, 
                mode: "RTU Server Mode",
                baudrate: "9600",
                parity: "None",
                stopBits: "1",
                dataSize: "8",
                macAddress: deviceMacAddress,
                //slaveID: defaultDeviceConfig.slaveID,
                //networkIP: defaultDeviceConfig.networkIP,
                //networkMask: defaultDeviceConfig.networkMask,
                //networkGateway: defaultDeviceConfig.networkGateway,
                //remoteIP: defaultDeviceConfig.remoteIP,
                slaveID: "4",
                networkIP: "192.168.2.1",
                networkMask: "255.255.255.1",
                networkGateway: "192.168.2.2",
                remoteIP: "192.168.2.10",
            });       
        }
        localStorage.setItem('devices', JSON.stringify(storedDevices));
    }

    async function getConfigDeviceId(){
        //get config device mac address
        //const configDevice = await getOpenedDevice();
        //const deviceId = `${configDevice.vendorId}-${configDevice.productId}`;
        const deviceMacAddress = randomMacAddress;
        return deviceMacAddress;
    }

    document.getElementById("next-button").addEventListener("click", () => {
        saveConfigDevice();
        window.location.href = "../../views/config/mode-config.html"
    });
    
    document.getElementById("cancel-button").addEventListener("click", () => {
        window.location.href = "../../views/main/main.html"
    })
    
    document.getElementById("factory-reset-button").addEventListener("click", () => {
       
    })

});
