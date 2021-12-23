const cron = require("node-cron");
const fetch = require("node-fetch");
const convertData = require("xml-js");
const fs = require("fs");

let data;
let todayData;

cron.schedule("0 1 * * *", function() {
    console.log("Fetching new exchange rates data (fetch function executed every day at 01:00 am).");
    fetchData();
})

async function checkData() {
    const rawFile = fs.readFileSync("data.json");
    if (rawFile.toString() === "") {
        await fetchData();
    } else {
        const parsedFile = JSON.parse(rawFile);
        const mostRecentDate = parsedFile[0][0]["date"];
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;
        if (mostRecentDate !== today) {
            // console.log("out of date date");
            await fetchData();
        }
    }
}

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
    fs.writeFileSync("data.json", JSON.stringify(mappedData));
    const tempTodayData = await data[0];
    todayData = tempTodayData;
}

function exchangeRate(date, currency1, currency2) {
    // checkData()
    try {
        const rawFile = fs.readFileSync("data.json");
        let dataObj = JSON.parse(rawFile);
        const values = Object.values(dataObj);
        const fileDataArray = [];
        for (let value of values) {
            fileDataArray.push(value);
        }
        date = date.substr(0, 10);
        currency1 = String(currency1).toUpperCase();
        currency2 = String(currency2).toUpperCase();
        let specifiedDayData;
        let arr = [];
        for (let dayData of fileDataArray) {
            if (dayData[0]["date"] === date) {
                specifiedDayData = dayData;
            }
        }
        for (let currencyData of specifiedDayData) {
            if (currency1 === "EUR") {
                if (currencyData["currency"] === currency2) {
                    const rate = currencyData["rate"];
                    return rate;
                    // output = rate;
                }
            } else {
                if (currencyData["currency"] === currency1) {
                    let rate1 = currencyData["rate"];
                    if (currency2 === "EUR") {
                        const rate = 1 / parseFloat(currencyData["rate"]);
                        return rate;
                        // output = rate;
                    } else {
                        for (let currencyData of specifiedDayData) {
                            if (currencyData["currency"] === currency2) {
                                const rate2 = currencyData["rate"];
                                rate1 = 1 / rate1;
                                const rate = rate1 * rate2;
                                return rate;
                                // output = rate;
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

function convert(date, currency1, currency2, amount) {
    try {
        const rate = exchangeRate(date, currency1, currency2);
        const output = amount * rate;
        return output;
    } catch(error) { 
        console.log(error);
        return "Error: " + error;
    }
}
