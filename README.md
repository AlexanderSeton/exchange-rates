Currency exchange rate library    
Using European Central Bank Data (https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml)

Installation    
npm install exchange-rates    

Example   
const exchange = require("exchange-rates");   

Usage   
Get currency1's exchange reate in currency2   
    exchange.exchangeRate(date, currency1, currency2)   
Get the amount of currency2 you could exchange for the specified amount of currency1         
    exchange.convert(date, currency1, currency2, amount)      

Currency Codes    
(All currency arguments must be the currencies' abbreviation)     
EUR     
USD       
JPY       
BGN       
CZK       
DKK       
GBP       
HUF       
PLN       
RON       
SEK       
CHF       
ISK       
NOK       
HRK       
RUB       
TRY       
AUD       
BRL       
CAD       
CNY       
HKD       
IDR       
ILS       
INR       
KRW       
MXN       
MYR       
NZD       
PHP       
SGD     
THB     
ZAR     
