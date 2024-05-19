    /*========================Brief================================
    This file handles: 
        -Packet reception via web sockets
        -Menu controls: 
            -start or stop of data streaming
            -packet filtering
            -container cleaning
    ===============================================================*/

    //----------------------Web sockets--------------------------//
    //establish a web socket connection for packet streaming
    const ws = new WebSocket('ws://localhost:8000/ws_endpoint');
    ws.addEventListener('open', function (event) {
        console.log('WebSocket connection established');
    });
    
    // Event handler for receiving messages from WebSocket server
    ws.addEventListener('message', function (event) {
        console.log('Received message from server:', event.data);
        handleReceivedPacket(event.data);
    });
    
    // Event handler for WebSocket connection closed
    ws.addEventListener('close', function (event) {
        console.log('WebSocket connection closed');
    });
    
    // Event handler for WebSocket connection error
    ws.addEventListener('error', function (event) {
        console.error('WebSocket connection error:', event);
    });

    /*--------------------------Data Processing----------------------------*/

    function handleReceivedPacket(packet) {
        //build a packet from received data
        const myPacket = structurePacket(packet);
        //create packet ui
        createPacketUI(myPacket);
    }

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


    //-------------------------------Controls------------------------------------//
    
    const startButtonEl = document.getElementById("start");
    const stopButtonEl = document.getElementById("stop");

    function startButtonClickHandler() {
        console.log("start", START_SIGNAL_URL);
        apiPostData(START_SIGNAL_URL, "start signal");   

        startButtonEl.classList.add("play-button-disabled");
        startButtonEl.removeEventListener("click", startButtonClickHandler);
    
        stopButtonEl.classList.remove("stop-button-disabled");
        stopButtonEl.addEventListener("click", stopButtonClickHandler);
    }
    
    function stopButtonClickHandler() {
        console.log("stop", STOP_SIGNAL_URL);
        apiPostData(STOP_SIGNAL_URL, "stop signal");    
    
        stopButtonEl.classList.add("stop-button-disabled");
        stopButtonEl.removeEventListener("click", stopButtonClickHandler);
    
        startButtonEl.classList.remove("play-button-disabled");
        startButtonEl.addEventListener("click", startButtonClickHandler);
    }

    startButtonEl.addEventListener("click", startButtonClickHandler);
    
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

    document.getElementById("trash").addEventListener("click", ()=> {
        cleanPacketsContainer();
        cleanPacketDetailsContainer();
        packetsBuffer.length = 0;
        startTime = null;
    })

    document.getElementById("save").addEventListener("click", ()=> {
        //savePackets(packetsBuffer);
    })

    document.getElementById("configure-button").addEventListener("click", () => {
        console.log("configure")
        window.location.href = "../../views/config/general-config.html"
    });

    const closeButton = document.getElementById("close-button");
    closeButton.addEventListener("click", ()=> {
        window.location.href = "../../views/main/main.html"
    })

    //---------------------------Sidebar Collapse-----------------------------------//

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

