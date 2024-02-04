const fs = require('fs');
function FilterForLastXAmountOfDays(processedDataSets, days) {
    const filteredData = [];
    const today = new Date();
    const startTime = new Date(); // Record start time
    startTime.setDate(today.getDate() - days); // Set start time to X days ago
    
    // Filter data for the last X days
    for (const dateStr in processedDataSets) {
        const date = new Date(dateStr);
        if (date >= startTime && date <= today) {
            filteredData.push({ date: dateStr, value: processedDataSets[dateStr] });
        }
    }

    // Sort filteredData by date in descending order
    filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
    // end timer
    const endTime = new Date(); 
    const elapsedTime = endTime - startTime; // Calculate elapsed time in milliseconds
    console.log(`Filtering took ${elapsedTime} milliseconds`);
    return filteredData;
}
// Read the JSON file containing the processed data sets
const filePath = 'JsonOutput/processedDataSets.json';
const rawData = fs.readFileSync(filePath);
const processedDataSets = JSON.parse(rawData);

// use the function to filter for a specific amount of days (can be used for last 7 days, last 30 days, etc.)
const days = 32;
const latestEntries = FilterForLastXAmountOfDays(processedDataSets, days);
console.log(`Latest entries for the last ${days} days:`, latestEntries);

