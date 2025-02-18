import { InputData } from "../model";


interface ResultSet {
    labels: string[];
    data: number[];
}
export const aggregateByYearMonth = (data: InputData): ResultSet => {
    const aggregatedData: { [yearMonth: string]: number } = {};
    for (const date in data.dates) {
        const count = data.dates[date];
        const yearMonth = date.slice(0, 7);
        aggregatedData[yearMonth] = (aggregatedData[yearMonth] || 0) + count;
    }
    const sortedKeys = Object.keys(aggregatedData).sort((a, b) => {
        const dateA = new Date(a + '-01');
        const dateB = new Date(b + '-01');
        return dateA.getTime() - dateB.getTime();
    });
    return {
        labels: sortedKeys,
        data: sortedKeys.map(key => aggregatedData[key]) 
    };
}