
    /*========================Brief================================
    This file handles: 


    ===============================================================*/
    
    
    let storedDevices = JSON.parse(localStorage.getItem('devices')) || [];
    let deviceId = await getConfigDeviceId();

    let selectedMode, baudrate, parity, stopBit, dataSize, slaveId;
    const deviceIndex = storedDevices.findIndex(device => device.id === deviceId);
        console.log("storedDevices", storedDevices)

    if (deviceIndex !== -1) {
        selectedMode = storedDevices[deviceIndex].mode;
        getSerialData();
    } 

    let slaveIdLabelText = selectedMode === "RTU server mode"? "Slave ID" : "Remote Slave ID";
    document.getElementById("select-baud").value = baudrate;
    document.getElementById("select-parity").value = parity;
    document.getElementById("select-stopbits").value = stopBit;
    document.getElementById("select-datasize").value = dataSize;
    const slaveIdInputItem = document.querySelector('.slave-item');
    const slaveIdInputLabel = document.getElementById('slave-id-span')
    const slaveIdInputField = document.getElementById("slave-id");
    slaveIdInputLabel.textContent = slaveIdLabelText;

    if(isValidInput(slaveId))
        slaveIdInputField.value = slaveId;

    document.getElementById("next-button").addEventListener('click', () => {
        if(checkData(slaveIdInputField.value)){
            saveSerialData();
            window.location.href = "../../views/config/network-config.html"
        }  
    })

    function getSerialData(){
        baudrate = storedDevices[deviceIndex].baudrate;
        parity = storedDevices[deviceIndex].parity;
        stopBit = storedDevices[deviceIndex].stopBits;
        dataSize = storedDevices[deviceIndex].dataSize;
        slaveId = storedDevices[deviceIndex].slaveID;
    }

    function checkData(data){
        let dataValid = true;
        const errorDiv = slaveIdInputItem.querySelector(".error");
        if (errorDiv) {
            errorDiv.remove();  
        }
        if (!data) {
            const newErrorDiv = document.createElement("div");
            newErrorDiv.classList.add("error");
            newErrorDiv.textContent = "Please fill in this field";
            slaveIdInputItem.appendChild(newErrorDiv);
            newErrorDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
            dataValid = false;
        } else if (!isValidInput(data)) {
            const newErrorDiv = document.createElement("div");
            newErrorDiv.classList.add("error");
            newErrorDiv.textContent = "Please check the integrity of the data";
            slaveIdInputItem.appendChild(newErrorDiv);
            newErrorDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
            dataValid = false;
        }
        return dataValid;
    }

    function saveSerialData(){

        storedDevices[deviceIndex].baudrate = document.getElementById("select-baud").value;
        storedDevices[deviceIndex].parity =  document.getElementById("select-parity").value;
        storedDevices[deviceIndex].stopBits =  document.getElementById("select-stopbits").value;
        storedDevices[deviceIndex].dataSize =  document.getElementById("select-datasize").value;

        if(slaveIdInputField.value){
            storedDevices[deviceIndex].slaveID = slaveIdInputField.value;
        }
        localStorage.setItem('devices', JSON.stringify(storedDevices));
    }
    
    function isValidInput(input){
        if(input == "undefined" || input == '[object Object]')
            return false;

        const numValue = Number(input);
        return typeof numValue === 'number' && Number.isInteger(numValue) && numValue >= 0 && numValue <= 255;
    }
    
    document.getElementById("previous-button").addEventListener('click', () => {
        window.location.href = "../../views/config/mode-config.html"
    })



