/* const express = require('express');

const app = express();


app.listen('3000', () => {
    console.log('server in 3000');
});

*/
const requestPromise = require('request-promise');
const fs = require('fs');
const apiKey = 'X86NOH6II01P7R24';
const baseUrl = 'https://www.alphavantage.co/';

const requestAuctions = (functionToUse, auctionSymbol, outpoutSize) => {
    const url = `${baseUrl}query?function=${functionToUse}&symbol=${auctionSymbol}&outputsize=${outpoutSize}&apikey=${apiKey}`;
    return requestPromise(url)
  
}

requestAuctions('TIME_SERIES_DAILY', 'FB', 'compact').then((responseFromApi) => {
    const dataInJson = JSON.parse(responseFromApi);
    const timeSeries = dataInJson['Time Series (Daily)'];
    const timeSeriesKey = Object.keys(dataInJson['Time Series (Daily)']);

    timeSeriesKey.map((timeSerieKey) => {
        try {
            const priceKeys = Object.keys(timeSeries[timeSerieKey]);
            const openPrice = timeSeries[timeSerieKey][priceKeys[0]];
            const highPrice = timeSeries[timeSerieKey][priceKeys[1]];
            const message = `Values in ${timeSerieKey} was from open price of ${openPrice} and high price of ${highPrice}
            
            `;
            writeLog('readAuctions', 'auction readed');
            fs.appendFile('results.txt', message, () => {
                console.log('file writted');
            });
        } catch (error) {
            console.log(error);
        }

  
    })

})
.catch((error) => {
    console.log(error);
});


const writeLog = (type, message) => {
    const date = new Date();
    const logToAdd = `date ${date}:: ${type} -- ${message}`;
    fs.appendFile('log.txt', logToAdd, () => {
        console.log('file writted');
    });
}