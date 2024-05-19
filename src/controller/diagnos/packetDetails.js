/*========================Brief================================
This file handles: 
    -rendering packet details data

===============================================================*/

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

function cleanPacketDetailsContainer(){
    container.innerHTML = "";
}