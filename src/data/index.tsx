interface DateCounts {
    [date: string]: number;
}
interface InputData {
    dates: DateCounts;
}
interface ResultSet {
    labels: string[];
    data: number[];
}
export const aggregateByYearMonth = (data: InputData): ResultSet => {
    const aggregatedData: { [yearMonth: string]: number } = {};
    // Step 2: Aggregate data by year-month
    for (const date in data.dates) {
        const count = data.dates[date];
        const yearMonth = date.slice(0, 7); // Extracts 'YYYY-MM'
        aggregatedData[yearMonth] = (aggregatedData[yearMonth] || 0) + count;
    }
    // Step 3: Sort keys (year-month strings) in ascending order
    const sortedKeys = Object.keys(aggregatedData).sort((a, b) => {
        // Convert 'YYYY-MM' to Date objects for comparison
        const dateA = new Date(a + '-01'); // '-01' ensures we compare the first day of each month
        const dateB = new Date(b + '-01');
        // Subtract dates to sort in ascending order
        return dateA.getTime() - dateB.getTime();
    });
    // Step 4: Prepare the output in RetVal format
    return {
        labels: sortedKeys, // Sorted labels in 'YYYY-MM' format
        data: sortedKeys.map(key => aggregatedData[key]) // Corresponding data points
    };
}