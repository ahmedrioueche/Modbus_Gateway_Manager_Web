document.addEventListener('DOMContentLoaded', async () => {
    const randomMacAddress = "3F:5C:DD:56:33:11";
    let storedDevices = JSON.parse(localStorage.getItem('devices')) || [];
    console.log("storedDevices", storedDevices)
    let deviceId = await getConfigDeviceId();
    const modeElements = document.getElementsByName("mode");
    const existingDeviceIndex = storedDevices.findIndex(device => device.id === deviceId);
    if (existingDeviceIndex !== -1) {
        getSelectedMode(storedDevices[existingDeviceIndex].mode);
    } 

    function getSelectedMode(selectedMode) {
        for (let i = 0; i < modeElements.length; i++) {
            let modeLabel = document.querySelector(`[for=${modeElements[i].id}]`).textContent;
            if (selectedMode === modeLabel) {
                console.log("match")
                modeElements[i].checked = true;
            }
        }
    }
    
    function saveSelectedMode() {
        let selectedMode; let selectedModeLabel;
        for (let i = 0; i < modeElements.length; i++) {
            if (modeElements[i].checked) {
                selectedMode = modeElements[i].value;
                selectedModeLabel = document.querySelector(`[for=${modeElements[i].id}]`);
                console.log("checked:", selectedModeLabel.textContent);
                storedDevices[existingDeviceIndex].mode = selectedModeLabel.textContent;
            }
        }
        localStorage.setItem('devices', JSON.stringify(storedDevices));
    }

    document.getElementById("next-button").addEventListener("click", () => {
        saveSelectedMode();
        window.location.href = "../../views/config/serial-config.html"
    });
    
    document.getElementById("previous-button").addEventListener("click", () => {
        window.location.href = "../../views/config/general-config.html"
    })
});

