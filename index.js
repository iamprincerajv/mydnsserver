const dgram = require("node:dgram");
const dnsPacket = require("dns-packet");
const server = dgram.createSocket("udp4");

const db = {
    "devprince.in": {
        type: "A",
        data: "1.2.3.4"
    },
    "google.com": {
        type: "CNAME",
        data: "hashnode.network"
    }
}

server.on("message", (msg, rInfo) => {
    const incomingReq = dnsPacket.decode(msg);
    const ipfromDB = db[incomingReq.questions[0].name];

    if(ipfromDB) {
        const ans = dnsPacket.encode({
            id: incomingReq.id,
            type: "response",
            flags: dnsPacket.AUTHORITATIVE_ANSWER,
            questions: incomingReq.questions,
            answers: [{
                type: ipfromDB.type,
                name: incomingReq.questions[0].name,
                class: "IN",
                data: ipfromDB.data
            }]
        });
    
        server.send(ans, rInfo.port, rInfo.address);
    }

    console.log({
        question: incomingReq.questions[0].name,
        rInfo
    });
})

server.bind(53, () => console.log("DNS Server is running at ppor 53"));