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
    const mappedData = await tempData.map((dData) => {
        const daysData = dData["Cube"];
        const tempOutput = [];
        const weekDate = dData["_attributes"]["time"];
        tempOutput.push({"date": weekDate});
        for (let day of daysData) {
            const tempDay = day["_attributes"];
            tempOutput.push(tempDay);
        }
        return tempOutput;
    });
    data = mappedData;
    // today's data
    const tempTodayData = await data[0];
    todayData = tempTodayData;
}
    
// cron.schedule("0 1 * * *", function() {
//     console.log("Fetching new exchange rates data (fetch function executed every day at 1am)");
//     fetchData();
// })

function exchangeRate(date, currency1, currency2) {
    try {
        date = date.substr(0, 10);
        currency1 = String(currency1).toUpperCase();
        currency2 = String(currency2).toUpperCase();
        let specifiedDayData;
        for (let dayData of data) {
            if (dayData[0]["date"] === date) {
                console.log("Found date:", date);
                specifiedDayData = dayData;
                // console.log(specifiedDayData)
            }
        }
        for (let currencyData of specifiedDayData) {
            if (currency1 === "EUR") {
                if (currencyData["currency"] === currency2) {
                    const rate = currencyData["rate"];
                    return rate;
                }
            } else {
                if (currencyData["currency"] === currency1) {
                    let rate1 = currencyData["rate"];
                    if (currency2 === "EUR") {
                        const rate = 1 / parseFloat(currencyData["rate"]);
                        return rate;
                    } else {
                        for (let currencyData of specifiedDayData) {
                            if (currencyData["currency"] === currency2) {
                                const rate2 = currencyData["rate"];
                                rate1 = 1 / rate1;
                                const rate = rate1 * rate2;
                                return rate;
                            }
                        }
                    }
                }
            }

        }
    } catch(error) { 
        console.log(error);
        return "Error: " + error;
    }
}

function  convert(date, currency1, amount1, currency2, amount2) {
    try {
    } catch(error) { 
        console.log(error);
        return "Error: " + error;
    }
}

// initial data fetch
fetchData();
// // needed to view test
setTimeout(() => {
    // console.log(data);
    // console.log(todayData);
    console.log(exchangeRate("2021-12-22", "JPY", "RUB"));
}, 2000)
