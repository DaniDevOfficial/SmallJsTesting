const fs = require('fs');

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

// Read the JSON file containing the processed data sets
const filePath = 'JsonOutput/processedDataSets.json';
const rawData = fs.readFileSync(filePath);
const processedDataSets = JSON.parse(rawData);

// Use the function to calculate the total for the month
const totalForMonth = sumTotalForMonth(processedDataSets);

console.log("Total for each day in the month:");
console.log(totalForMonth);
