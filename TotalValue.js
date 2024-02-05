const fs = require('fs');



function processMultipleHistoricalData(dataSets) {
    const today = new Date();
    const startTime = new Date(); // Record start time
    const processedDataSets = [];

    dataSets.forEach((dataSet, index) => {
        const processedDataSet = {
            name: dataSet.name,
            historicalData: []
        };
        dataSet.historicalData.sort((a, b) => new Date(a.date) - new Date(b.date));
        const firstDate = new Date(dataSet.historicalData[0].date);
        const daysTillNow = Math.floor((today - firstDate) / (24 * 60 * 60 * 1000)); // Calculate the number of days between the first date and today
        let lastKnownPrices = 0;
        for (let day = 0; day < daysTillNow; day++) {
            const currentDate = new Date(firstDate);
            currentDate.setDate(firstDate.getDate() + day);

            const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
            const price = dataSet.historicalData.find(dataPoint => dataPoint.date === formattedDate)?.price;

            const processedDataPoint = {
                date: formattedDate,
                price: price !== undefined ? price : lastKnownPrices
            };

            processedDataSet.historicalData.push(processedDataPoint);

            // Update the last known price for the current date
            if (price !== undefined) {
                lastKnownPrices = price;
            }
        }
        processedDataSet.historicalData.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
        processedDataSets.push(processedDataSet);
    });

    processedDataSets.sort((a, b) => new Date(a.historicalData[0].date) - new Date(b.historicalData[0].date)); // Sort processedDataSets by the earliest date in historicalData

    const endTime = new Date(); // Record end time
    const elapsedTime = endTime - startTime; // Calculate elapsed time in milliseconds
    console.log(`Processing took ${elapsedTime} milliseconds`);

    return processedDataSets;
}


function processMultibleBuyDate(dataSets) {
    const today = new Date();
    const startTime = new Date(); // Record start time
    const buyAndSoldData = [];
    dataSets.forEach((dataSet, index) => {
        const processedDataSet = {
            name: dataSet.name,
            historicalData: []
        };
        const firstDate = new Date(dataSet.buyDate);
        const daysTillNow = Math.floor((today - firstDate) / (24 * 60 * 60 * 1000)); // Calculate the number of days between the first date and today
        for (let day = 0; day < daysTillNow; day++) {
            const currentDate = new Date(firstDate);
            currentDate.setDate(firstDate.getDate() + day);

            if (dataSet.soldDate && new Date(dataSet.soldDate) <= currentDate) {
                price = 0;
            } else {
                price = dataSet.buyPrice;
            }


            const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

            const processedDataPoint = {
                date: formattedDate,
                price: price
            };
            processedDataSet.historicalData.push(processedDataPoint);
        }
        buyAndSoldData.push(processedDataSet);
    });
    // sort by date
    buyAndSoldData.sort((a, b) => new Date(a.historicalData[0].date) - new Date(b.historicalData[0].date));
    return buyAndSoldData;
}

function sumTotalForMonth(processedDataSets) {
    const totalForMonth = {};

    processedDataSets.forEach((dataSet) => {
        dataSet.historicalData.forEach((dataPoint) => {
            const date = dataPoint.date;
            const price = dataPoint.price;

            if (!totalForMonth[date]) {
                totalForMonth[date] = 0;
            }

            totalForMonth[date] += price;
        });
    });
    return totalForMonth;
}
const dataSet1 = {
    name: "DataSet1",
    buyPrice: 5000,
    buyDate: "2023-02-03",
    historicalData: [
        { "date": "2023-02-03", "price": 5000 },
        { "date": "2023-02-12", "price": 5500 },
        // ... more data points
    ]
};

const dataSet2 = {
    name: "DataSet2",
    buyPrice: 6000,
    buyDate: "2023-02-05",
    soldPrice: 6500,
    soldDate: "2023-02-15",
    historicalData: [
        { "date": "2023-02-05", "price": 6000 },
        { "date": "2023-02-15", "price": 6500 },
        // ... more data points
    ]
};

const dataSet3 = {
    name: "DataSet3",
    buyPrice: 7000,
    buyDate: "2023-02-01",
    soldPrice: 7500,
    soldDate: "2023-02-20",
    historicalData: [
        { "date": "2023-02-01", "price": 7000, "fortnite": "yes" },
        { "date": "2023-02-20", "price": 7500 },
    ]
};

const multipleDataSets = [dataSet1, dataSet2, dataSet3];


const result =  processMultipleHistoricalData(multipleDataSets);
const buyAndSoldResult = processMultibleBuyDate(multipleDataSets)
const totalForAllBuyAndSold = sumTotalForMonth(buyAndSoldResult);
console.log(JSON.stringify(totalForAllBuyAndSold, null, 2))
const totalForMonth =  sumTotalForMonth(result);
const jsonData = JSON.stringify(totalForMonth, null, 2);
const filePath = 'JsonOutput/processedDataSets.json';

fs.writeFileSync(filePath, jsonData);

console.log(`Data sets processed and saved to ${filePath}`);