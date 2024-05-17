/*========================Brief================================
This file handles: 
    -Packet reception
    -Packet breakdown
    -Packet display

===============================================================*/

document.addEventListener("DOMContentLoaded", async () => {
    /*
    let packetsBuffer = []; let startTime; 
    window.serialAPI.getPacketData(recPacket => {
        if(!startTime)
            startTime = Date.now();
        
        const relativeArrivalTime = ((Date.now() - startTime)/1000).toFixed(6);

        let packetDataObj = {};
        let recPacketLength = recPacket.length; 
        const type = recPacket[0];
        const functionCode = recPacket[2];

        if(type === 14) {//0xE error
            handleError(recPacket[1], relativeArrivalTime); //error type
        }
        else {
            let basePacketDataObj = {
                "packetSource": "",
                "packetDestination": "",
                "Slave ID": formatField(recPacket[1]),
                "Function Code": formatField(recPacket[2]),
                "Exception Code": functionCode > 128 ? formatField(recPacket[3]) : "",
                "CRC": formatTwoByteValue(recPacket[recPacketLength - 2], recPacket[recPacketLength - 1])
            };
        
            switch (type) {
                case 1: // SOURCE = RTU CLIENT
                    basePacketDataObj.packetSource = "RTU Client";
                    basePacketDataObj.packetDestination = "RTU Server";
            
                    if (recPacketLength > 6 && functionCode < 128) { //If not an exception (128 = 0x80)
                        basePacketDataObj["Starting Address"] = formatTwoByteValue(recPacket[3], recPacket[4]);
                        basePacketDataObj["Quantity"] = formatTwoByteValue(recPacket[5], recPacket[6]);
                    }
                    break;
            
                case 2: // SOURCE = RTU SERVER
                    basePacketDataObj.packetSource = "RTU Server";
                    basePacketDataObj.packetDestination = "RTU Client";
            
                    if (recPacketLength > 6 && functionCode < 128) {
                        basePacketDataObj["Bytes To Follow"] = formatField(recPacket[3]);
                        basePacketDataObj["Data"] = formatData(recPacket.slice(4, recPacketLength - 2));
                    }
                    break;
            
                case 3: // SOURCE TCP CLIENT
                    basePacketDataObj.packetSource = "TCP Client";
                    basePacketDataObj.packetDestination = "TCP Server";
            
                    if (recPacketLength > 6 && functionCode < 128) {
                        basePacketDataObj = {
                            ...basePacketDataObj,
                            "Transaction ID": formatTwoByteValue(recPacket[1], recPacket[2]),
                            "Protocol ID": formatTwoByteValue(recPacket[3], recPacket[4]),
                            "Message Length": formatTwoByteValue(recPacket[5], recPacket[6]),
                            "Unit ID": formatField(recPacket[7]),
                            "Function Code": formatField(recPacket[8]),
                            "Starting Address": formatTwoByteValue(recPacket[9], recPacket[10]),
                            "Quantity": formatField(recPacket[11])
                        };
                    }
                    break;
            
                case 4: // SOURCE TCP SERVER
                    basePacketDataObj.packetSource = "TCP Server";
                    basePacketDataObj.packetDestination = "TCP Client";
            
                    if (recPacketLength > 6 && functionCode < 128) {
                        basePacketDataObj = {
                            ...basePacketDataObj,
                            "Transaction ID": formatTwoByteValue(recPacket[1], recPacket[2]),
                            "Protocol ID": formatTwoByteValue(recPacket[3], recPacket[4]),
                            "Message Length": formatTwoByteValue(recPacket[5], recPacket[6]),
                            "Unit ID": formatField(recPacket[7]),
                            "Function Code": formatField(recPacket[8]),
                            "Data": formatData(recPacket.slice(9, recPacketLength-2))
                        };
                    }
                    break;
            }
            packetDataObj = basePacketDataObj;
            
            //organize packet data
            const packetDestination = (type === 1) ? `${packetDataObj["packetDestination"]} ID = ${packetDataObj["Slave ID"]}` :
            (type === 3 && mbMode === "RTU Server Mode") ? `${packetDataObj["packetDestination"]} IP = ${remoteIP}` :
            (type === 3 || type === 4) ? `${packetDataObj["packetDestination"]} IP = ${networkIP}` :
            packetDataObj["packetDestination"];

            const packetSource = (type === 2) ? `${packetDataObj["packetSource"]} ID = ${packetDataObj["Slave ID"]}` : (type === 3 && mbMode === "RTU Server Mode") ? `${packetDataObj["packetSource"]} IP = ${networkIP}` :
            (type === 4 && mbMode === "RTU Server Mode") ? `${packetDataObj["packetSource"]} IP = ${remoteIP}` :
            packetDataObj["packetSource"];

            const myRawData = recPacket.slice(1).map(byte => (byte < 16 ? '0' : '') + byte.toString(16).toUpperCase()).join(' ');
            const rawData = functionCode > 128 ? myRawData + " Exception!" : myRawData;
            const packet = {
                type: type,
                number: packetsBuffer.length + 1,
                time: relativeArrivalTime,
                source: packetSource,
                destination: packetDestination,
                length: recPacketLength - 1, 
                rawData: rawData,
                packetData: packetDataObj,
            }

            //add packet to packetBuffer
            packetsBuffer.push(packet);
            //create packet ui
            createPacketUI(packet);
        }
    })
*/
    let packetData1 = {
        "packetSource": "TCP Client",
        "packetDestination": "TCP Server",
        "Slave ID": "3",
        "Function Code": "01",
        "Starting Address": "0x22FF",
        "Quantity": "10",
        "Exception Code": null,
        "CRC": "CA 34 E6 56",
        "Transaction ID": "1",
        "Protocol ID": "1",
        "Message Length": 10,
        "Unit ID": "2",
        "Data": "23 86 03 F9 D2 A9 45 45"
    };

    let packetData2 = {
        "packetSource": "RTU Client",
        "packetDestination": "RTU Server",
        "Slave ID": "3",
        "Function Code": "02",
        "Starting Address": "0x22FF",
        "Quantity": "10",
        "Exception Code": null,
        "CRC": "BA 34 E6 56",
        "Transaction ID": "2",
        "Protocol ID": "1",
        "Message Length": 10,
        "Unit ID": "2",
        "Data": "23 86 03 F9 D2 A9 45 45"
    };

    let packetData3 = {
        "packetSource": "RTU Server",
        "packetDestination": "RTU Client",
        "Slave ID": "3",
        "Function Code": "03",
        "Starting Address": "0x22FF",
        "Quantity": "10",
        "Exception Code": null,
        "CRC": "AA 34 E6 56",
        "Transaction ID": "3",
        "Protocol ID": "1",
        "Message Length": 10,
        "Unit ID": "2",
        "Data": "23 86 03 F9 D2 A9 45 45"
    };

    let packetData4 = {
        "packetSource": "TCP Server",
        "packetDestination": "TCP Client",
        "Slave ID": "3",
        "Function Code": "04",
        "Starting Address": "0x22FF",
        "Quantity": "10",
        "Exception Code": null,
        "CRC": "CA 34 E6 56",
        "Transaction ID": "4",
        "Protocol ID": "1",
        "Message Length": 10,
        "Unit ID": "2",
        "Data": "23 86 03 F9 D2 A9 45 45"
    };

    // Create packets with distinct packetData objects
    const packet1 = {
        type: 1,
        number: 1,
        time: 0.00001,
        source: "TCP Client",
        destination: "TCP SERVER",
        length: "22", 
        rawData: "FF D4 23 AE 11 55",
        packetData: packetData1,
    };

    const packet2 = {
        type: 2,
        number: 2,
        time: 0.000010,
        source: "RTU CLIENT",
        destination: "RTU SERVER",
        length: "22", 
        rawData: "FF D4 23 AE 11 55",
        packetData: packetData2,
    };

    const packet3 = {
        type: 3,
        number: 3,
        time: 0.004060,
        source: "RTU SERVER",
        destination: "RTU CLIENT",
        length: "22", 
        rawData: "FF D4 23 AE 11 55",
        packetData: packetData3,
    };

    const packet4 = {
        type: 4,
        number: 4,
        time: 0.020250,
        source: "TCP SERVER",
        destination: "TCP CLIENT",
        length: "22", 
        rawData: "FF D4 23 AE 11 55",
        packetData: packetData4,
    };

    createPacketUI(packet1);
    createPacketUI(packet2);
    createPacketUI(packet3);
    createPacketUI(packet4);
    createPacketUI(packet1);
    createPacketUI(packet2);
    createPacketUI(packet3);
    createPacketUI(packet4);
    createPacketUI(packet1);
    createPacketUI(packet2);
    createPacketUI(packet3);
    createPacketUI(packet4);
    createPacketUI(packet1);
    createPacketUI(packet2);
    createPacketUI(packet3);
    createPacketUI(packet4);


    function createPacketUI(packet){
        const packetContainer = document.getElementById("packet-container");
        const packetEl = document.createElement("div");
        const numberEl = document.createElement("div");
        const timeEl = document.createElement("div");
        const sourceEl = document.createElement("div");
        const destinationEl = document.createElement("div");
        const lengthEl = document.createElement("div");
        const dataEl = document.createElement("div");
    
        packetEl.setAttribute("class", "packet-row");
        packetEl.setAttribute("id", "packet");
        
        colorPacketRow(packet, packetEl);
        packetEl.addEventListener("click", ()=>{

        })

        packetEl.addEventListener("mouseover", ()=>{
            console.log("mouseover")
            fillPacketDataUI(packet);
        })
    
        const packetElements = [numberEl, timeEl, sourceEl, destinationEl, lengthEl, dataEl];
        packetElements.forEach((element, index) => {
            element.setAttribute("class", "column");
            element.setAttribute("id", `column-${index+1}`);
        });
        packetContainer.appendChild(packetEl); 
        packetEl.scrollIntoView({ behavior: 'auto', block: 'start' });
        packetElements.forEach((element, index) => {
            const propertyName = Object.keys(packet)[index+1]; // Get property name from object
            let propertyValue = packet[propertyName]; // Access property value by name
            if (propertyName === "source" || propertyName === "destination") {
                const lines = propertyValue.split("IP = ");
                propertyValue = lines.join("<br>IP = ");
            }
            element.innerHTML = propertyValue; 
            packetEl.appendChild(element);
        })
        const columns = document.querySelectorAll(".column");
        columns.forEach(column => {
            column.style.fontSize = "0.8rem"; 
        });
    }
    
    function colorPacketRow(packet, packetEl){
        if(packet.length > 2 && packet.packetData && packet.packetData["Exception Code"]){
            packetEl.classList.add('type-5');
            return;
        }
        switch(packet.type){
            case 1:
                packetEl.classList.add('type-1');
                break;  
            case 2:
                packetEl.classList.add('type-2');
                break;
            case 3:
                packetEl.classList.add('type-3');
                break;
            case 4:
                packetEl.classList.add('type-4');
                break;
            default:
                packetEl.classList.add('default');
        }
    }
    
    function handleError(errorType, arrivalTime){
        let error = "ERROR: Gateway Failed to communicate with ";
        switch(errorType){
            case 225: //0xE1 RTU_CLIENT_ERROR
                error += "RTU Client"
                break;
            case 226: //0xE1 RTU_SERVER_ERROR
                error += "RTU Server"
                break;
            case 227: //0xE1 TCP_CLIENT_ERROR
                error += "TCP Client"
                break;
            case 228: //0xE1 TCP_SERVER_ERROR
               error += "TCP Server"
                break;
        }

        const packet =  {
            number: packetsBuffer.length + 1,
            time: arrivalTime,
            error: error,
        }

        packetsBuffer.push(packet);
        createErrorPacketUI(packet);
    }

    function createErrorPacketUI(packet){
        const packetContainer = document.getElementById("packet-container");
        const packetEl = document.createElement("div");
        const packetErrorText = document.createElement("span");
        const numberEl = document.createElement("div");
        const timeEl = document.createElement("div");

        packetEl.setAttribute("class", "packet-row");
        packetEl.classList.add("packet-error");

        numberEl.setAttribute("class", "column");
        numberEl.setAttribute("id", "column-1");

        timeEl.setAttribute("class", "column");
        timeEl.setAttribute("id", "column-2");

        packetErrorText.setAttribute("class", "packet-error-span");
        packetErrorText.textContent = packet.error;
        packetEl.style.backgroundColor = "rgb(246, 42, 42)";
        packetEl.style.color = "white";

        numberEl.innerHTML = packet.number;   
        timeEl.innerHTML = packet.time;

        packetEl.appendChild(numberEl);
        packetEl.appendChild(timeEl);
        packetEl.appendChild(packetErrorText);
        packetContainer.appendChild(packetEl);
    }

    //=======================Packet details===========================//
        const modbusFunctionCodes = {
          1: "Read Coils",
          2: "Read Discrete Inputs",
          3: "Read Holding Registers",
          4: "Read Input Registers",
          5: "Write Single Coil",
          6: "Write Single Holding Register",
          15: "Write Multiple Coils",
          16: "Write Multiple Holding Registers"
        };
      
        const modbusExceptionCodes = {
          1: "Illegal Function",
          2: "Illegal Data Address",
          3: "Illegal Data Value",
          4: "Server Device Failure",
          5: "Acknowledge",
          6: "Server Device Busy",
          10: "Gateway Path Unavailable",
          11: "Gateway Target Device Failed to Respond"
        };

    const container = document.querySelector(".packet-details");
    
    // Function to fill packet data in the UI
    function fillPacketDataUI(packet) {
        console.log("packet in packet", packet)
        container.innerHTML = "";
        const table = document.createElement('table');
        let counter = 0;
        for (const key in packet.packetData) {
            if (Object.hasOwnProperty.call(packet.packetData, key)) {
                if (counter > 1) {
                    let normalValue, exceptionText = "";
                    const value = packet.packetData[key];

                    if (value && key !== "CRC") {
                        const row = document.createElement('tr');
                        const labelCell = document.createElement('td');
                        const valueCell = document.createElement('td');
                        valueCell.textContent = value;
                        labelCell.innerHTML = `<strong>${key}</strong>`;

                        row.appendChild(labelCell);
                        row.appendChild(valueCell);
                        table.appendChild(row);

                        // Check for an exception
                        if (key === "Function Code") {
                            if (value > 80) {
                                normalValue = value - 80;
                                exceptionText = " Exception: Couldn't";
                            } else {
                                normalValue = parseInt(value.toString(), 10);
                            }
                            console.log("normalValue", normalValue)
                            valueCell.textContent += exceptionText + " " + modbusFunctionCodes[normalValue];
                        }

                        if (key === "Exception Code") {
                            normalValue = parseInt(value.toString(), 10);
                            valueCell.textContent += " " + modbusExceptionCodes[normalValue];
                        }
                    }
                }
                counter++;
            }
        }

        // Let CRC be last
        if (packet.packetData.hasOwnProperty("CRC")) {
            const crcValue = packet.packetData["CRC"];
            if (crcValue) {
                const crcRow = document.createElement('tr');
                const crcLabelCell = document.createElement('td');
                const crcValueCell = document.createElement('td');

                crcLabelCell.innerHTML = `<strong>CRC</strong>`;
                crcValueCell.textContent = crcValue;

                crcRow.appendChild(crcLabelCell);
                crcRow.appendChild(crcValueCell);
                table.appendChild(crcRow);
            }
        }
        container.appendChild(table);
    }

    //=================================================================//
  
    const searchIcon = document.querySelector(".search img");
    const searchBarForm = document.querySelector(".diag-filter");
    const searchBar = document.getElementById("input");
    let isFilterOn = false;
    let searchQuery;
    let filteredPacketBuffer;

    searchIcon.addEventListener("click", () => {
        searchBarForm.classList.toggle("show-search");
        if(isFilterOn){
            cleanPacketsContainer();
            packetsBuffer.forEach(packet => {
                console.log("packet", packet)
                console.log("packet length", packet.length)
                if(packet.error)
                    createErrorPacketUI(packet);
                else
                    createPacketUI(packet);
            })
            isFilterOn = false;
        }
        searchBar.value = "";
    });

    searchBarForm.addEventListener("submit", (e) => {
        e.preventDefault();
    });

    searchBar.addEventListener("input", (e) => {
        e.preventDefault();
        filteredPacketBuffer = [];
        isFilterOn = true;
        searchQuery = searchBar.value.toLowerCase().trim();    
        filteredPacketBuffer = packetsBuffer.filter(packet => {
            return Object.values(packet).some(prop => {
                return String(prop).toLowerCase().includes(searchQuery);
            });
        });
        
        cleanPacketsContainer();
        filteredPacketBuffer.forEach(packet => {
            console.log("packet", packet)
            console.log("packet length", packet.length)
            if(packet.error)
               createErrorPacketUI(packet);
            else
              createPacketUI(packet);
        })
    })

    function cleanPacketsContainer(){
        const packets = document.querySelectorAll(".packet-row");
        packets.forEach(packet => {
            packet.remove();
        })
    }

    const startButtonEl = document.getElementById("start");
    const stopButtonEl = document.getElementById("stop");

    function startButtonClickHandler() {
        console.log("device", device)
        window.serialAPI.sendStartSignal(device);
    
        startButtonEl.classList.add("play-button-disabled");
        startButtonEl.removeEventListener("click", startButtonClickHandler);
    
        stopButtonEl.classList.remove("stop-button-disabled");
        stopButtonEl.addEventListener("click", stopButtonClickHandler);
    }
    
    function stopButtonClickHandler() {
        window.serialAPI.sendStopSignal(device);
    
        stopButtonEl.classList.add("stop-button-disabled");
        stopButtonEl.removeEventListener("click", stopButtonClickHandler);
    
        startButtonEl.classList.remove("play-button-disabled");
        startButtonEl.addEventListener("click", startButtonClickHandler);
    }

    startButtonEl.addEventListener("click", startButtonClickHandler);
    
    function formatField(value) {
        return `${(value < 16 ? '0' : '')}${value.toString(16).toUpperCase()}`;
    }
    
    function formatTwoByteValue(byte1, byte2) {
        const decimalValue = (byte1 << 8) | byte2;
        return `${formatField(byte1)} ${formatField(byte2)} (${decimalValue})`;
    }
    
    function formatAddress(byte1, byte2) {
        return formatTwoByteValue(byte1, byte2);
    }
    
    function formatData(dataArray) {
        return `${dataArray.map(byte => formatField(byte)).join(' ')} (${dataArray.join(' ')})`;
    }
    
    document.getElementById("trash").addEventListener("click", ()=> {
        cleanPacketsContainer();
        packetsBuffer.length = 0;
        startTime = null;
    })

    document.getElementById("save").addEventListener("click", ()=> {
        window.serialAPI.sendPackets(packetsBuffer);
    })

    document.getElementById("configure-button").addEventListener("click", () => {
        console.log("configure")
        window.location.href = "../../views/config/general-config.html"
    });

    const closeButton = document.getElementById("close-button");
    closeButton.addEventListener("click", ()=> {
        window.location.href = "../../views/main/main.html"
    })

    const collapseButton = document.getElementById("collapse-button");
    const sideBarEl =  document.querySelector(".sidebar");
    const logoEl =  document.querySelector(".logo");
    const ulEl = document.querySelector('ul');
    const diagTableEl = document.querySelector('.diagnostics-container');
    const packetDetailtTableEl = document.querySelector(".packet-details-main-container");
    collapseButton.addEventListener("click", ()=> {
        sideBarEl.classList.toggle("collapsed");
        logoEl.classList.toggle("collapsed");
        ulEl.classList.toggle("collapsed");
        collapseButton.classList.toggle("collapsed");
        diagTableEl.classList.toggle("collapsed");
        closeButton.classList.toggle("collapsed");
        packetDetailtTableEl.classList.toggle("collapsed");
    })
});

//TODO:
    //fix controls ui
    //fix packet details ui
    //send and receive data via usb
