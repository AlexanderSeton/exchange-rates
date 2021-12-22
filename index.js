const cron = require("node-cron");

cron.schedule("0 1 * * *", function() {
    console.log("Running this function every day at 1am");
})

function exchangeRate(date, currency1, currency2) {
}

function  convert(date, currency1, amount1, currency2, amount2) {
}
