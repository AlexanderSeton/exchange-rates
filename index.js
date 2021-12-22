const cron = require("node-cron");
const fetch = require("node-fetch");
const convertData = require("xml-js");

let data;
let todayData;

async function fetchData() {
    const response = await fetch("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml");
    const xmlString = await response.text();
    const result1 = convertData.xml2json(xmlString, {compact: true});
    const result2 = await JSON.parse(result1);
    const tempData = await result2["gesmes:Envelope"]["Cube"]["Cube"];
    const mappedData = await tempData.map((weekData) => {
        const daysData = weekData["Cube"];
        const tempOutput = [];
        const weekDate = weekData["_attributes"]["time"];
        // console.log(weekDate); // test
        tempOutput.push({"date": weekDate});
        for (let day of daysData) {
            const tempDay = day["_attributes"];
            console.log(tempDay); // test
            tempOutput.push(tempDay);
        }
        console.log(tempOutput); // test
    });
    data = mappedData;
    // today's data
    const tempTodayData = await data[0];
    todayData = tempTodayData;
}
    
// cron.schedule("0 1 * * *", function() {
//     console.log("Running this function every day at 1am");
// })

function exchangeRate(date, currency1, currency2) {
}

function  convert(date, currency1, amount1, currency2, amount2) {
}

// get initial data
fetchData();
setTimeout(() => {
    // console.log(data);
    // console.log(todayData);
}, 1000)
