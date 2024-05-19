const randomMacAddress = "3F:5C:DD:56:33:11";

const status =  {
    VALID: "valid",
    INVALID: "invalid",
    VOID: "void",
}

let defaultMacAddress = [0x00, 0x80, 0xE1, 0x00, 0x00, 0x55];
let defaultDeviceConfig = {
    name:"MODBUS Gateway",
    mode: "RTU Server Mode",
    baudrate: "9600",
    parity: "None",
    stopBits: "1",
    dataSize: "8",
    macAddress: defaultMacAddress,
    slaveID: 5,
    networkIP: "192.168.5.10",
    networkMask: "255.255.255.0",
    networkGateway: "192.168.5.1",
    remoteIP: "192.168.5.20",
}

async function getConfigDeviceId(){
    //get config device mac address
    //const configDevice = await getOpenedDevice();
    //const deviceId = `${configDevice.vendorId}-${configDevice.productId}`;
    const deviceMacAddress = randomMacAddress;
    return deviceMacAddress;
}
