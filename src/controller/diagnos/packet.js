/*========================Brief================================
This file handles: 
    -Packet structuring
    -Packet UI display  
    -Data exporting

===============================================================*/

let packetsBuffer = []; let startTime; 
function structurePacket(packet){
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
        }
}


    /*-----------------------------------UI-----------------------------------------*/
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

function savePackets(packetsBuffer){
    
}
