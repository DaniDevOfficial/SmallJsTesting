const processedDataSets = [];
const fs = require('fs');



function processMultipleHistoricalData(dataSets) {
    const daysInMonth = 30; 

    dataSets.forEach((dataSet, index) => {
        const processedDataSet = {
            name: dataSet.name,
            historicalData: []
        };


        let lastKnownPrices = 0;
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = `2022-02-${day.toString().padStart(2, '0')}`;
            const price = dataSet.historicalData.find(dataPoint => dataPoint.date === currentDate)?.price;

            const processedDataPoint = {
                date: currentDate,
                price: price !== undefined ? price : lastKnownPrices
            };

            processedDataSet.historicalData.push(processedDataPoint);


            // Update the last known price for the current date
            if (price !== undefined) {
                lastKnownPrices = price;
            }
        }
        processedDataSets.push(processedDataSet);
        
    });

    return processedDataSets;
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
    historicalData: [
        { "date": "2022-02-03", "price": 5000 },
        { "date": "2022-02-12", "price": 5500 },
        // ... more data points
    ]
};

const dataSet2 = {
    name: "DataSet2",
    historicalData: [
        { "date": "2022-02-05", "price": 6000 },
        { "date": "2022-02-15", "price": 6500 },
        // ... more data points
    ]
};

const dataSet3 = {
    name: "DataSet3",
    historicalData: [
        { "date": "2022-02-10", "price": 7000 },
        { "date": "2022-02-20", "price": 7500 },
        // ... more data points
    ]
};

const multipleDataSets = [dataSet1, dataSet2, dataSet3];


const result = processMultipleHistoricalData(multipleDataSets);
const jsonData = JSON.stringify(result, null, 2);


// Use the function to calculate the total for the month
const totalForMonth = sumTotalForMonth(result);

console.log("Total for each day in the month:");
console.log(totalForMonth);

const filePath = 'processedDataSets.json';

fs.writeFileSync(filePath, jsonData);

console.log(`Data sets processed and saved to ${filePath}`);