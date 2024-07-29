import { MapData } from "./types"


export const arrayToCSV = (data: MapData): string => {
    const csvRows: string[] = [];
    const headers = 'Date,Latitude,Longitude,Intensity';

    csvRows.push(headers);

    Object.entries(data).forEach(([date, points]) => {
        points.forEach(point => {
            csvRows.push(`${date},${point[0]},${point[1]},${point[2]}`);
        });
    });

    return csvRows.join('\n');
};

export const downloadFile = (content: string, fileName: string, contentType: string): void => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });

    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(a.href);
};