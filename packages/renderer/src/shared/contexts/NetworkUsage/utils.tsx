import { NetworkUsageTypes as Types } from '@/shared/types';
import { RECORD_ARRAY_LENGTH } from "./constants"

// ----- Utilities functions

/**
 * Returns an array consisted of [now-seconds, now] in Unix Time
 * @param seconds Number of difference in seconds from current moment
 */
export function TimeSpanFromNow(seconds: number): [number, number] {
    const now = GetTimeRounded()
    return [now - (seconds * 1000), now]
}
/**
 * Returns unix time of now rounded to the last second
**/
export function GetTimeRounded() {
    return Math.floor(new Date().getTime() / 1000) * 1000
}

/** 
 * Returns the current unix time with a offset 
 * @param offset number representing miliseconds of offset
 **/
export function getCurrentUnixTimeWithOffset(offset: number = 0) {
    return GetTimeRounded() + offset;
}

/** 
 * Returns the index of the closest time within an array
 * @param timeArray Array of numbers to get the index from
 * @param currentTime Number of unix time to be searched
 **/
export function findClosestTimeIndex(timeArray: number[], currentTime: number) {
    return timeArray.reduce(
        (minIndex, current, index) =>
            Math.abs(current - currentTime) < Math.abs(timeArray[minIndex] - currentTime)
                ? index
                : minIndex,
        0,
    );
};

// ----- Records functions

/** 
 * Returns an array of length RECORD_ARRAY_LENGTH NetworkRecords
 * @param name String of the name of the Process
 * @param timeSpan Array of two numbers that represent the start and the end of the time span
 **/
export function emptyRecordArray(name: string, timeSpan: [number, number]): Types.NetworkRecord[] {
    return Array.from({ length: RECORD_ARRAY_LENGTH }, (_, i) =>
        emptyRecordObject(
            name,
            timeSpan[1] - (RECORD_ARRAY_LENGTH - i) * Math.floor((timeSpan[1] - timeSpan[0]) / RECORD_ARRAY_LENGTH)
        ),
    );
}

/** 
 * Returns a RecordObject with all values equal to 0
 * @param name String of the name of the Process
 * @param time Unix time of the record 
 **/
export function emptyRecordObject(name: string, time: number): Types.NetworkRecord {
    return { Name: name, Upload: 0, Download: 0, Total: 0, Processes: {}, Protocols: {}, Hosts: {}, Time: time, };
}

/** 
 * Returns a SocketNetworkData with the keys Total and Time calculated
 * @param newRecord SocketNetworkData obtained from socket
 **/
export function formatNewRecord(newRecord: Types.SocketNetworkData): Types.NetworkRecord {
    return { ...newRecord, Total: newRecord.Upload + newRecord.Download, Time: GetTimeRounded() };
}

/** 
 * Adds the data obtained from the web socket with the current data on memory
 * @param oldData NetworkUsageRecord
 * @param newData SocketNetworkEntries
 **/
export function joinPreviousCurrentData(oldData: Types.NetworkUsageRecord, newData: Types.SocketNetworkData[]): Types.NetworkUsageRecord {
    const newNetworkUsage: Record<string, Types.NetworkUsageData> = oldData;
    newData.forEach(process => {
        if (oldData[process.Name] !== undefined)
            return newNetworkUsage[process.Name] = addNewData(oldData[process.Name], process)
        const newProcess = formatData(process);
        newNetworkUsage[process.Name] = newProcess;
    });

    return Object.fromEntries(
        Object.entries(newNetworkUsage)
            .map(
                ([name, value]): [string, Types.NetworkUsageData] =>
                    [name, {
                        ...value,
                        Download: value.Records.reduce((sum, curr) => sum + curr.Download, 0),
                        Upload: value.Records.reduce((sum, curr) => sum + curr.Upload, 0),
                        Total: value.Records.reduce((sum, curr) => sum + curr.Total, 0),
                    }]
            )
            .filter(([_, value]) => value.Total > 0),
    );
}

/** 
 * Returns a NetworkUsageData object based on input
 * @param data SocketNetworkData obtained from the web socket
 **/
export function formatData(data: Types.SocketNetworkData): Types.NetworkUsageData {
    return {
        Name: data.Name,
        Upload: data.Upload,
        Download: data.Download,
        Total: data.Upload + data.Download,
        Records: [...emptyRecordArray(data.Name, TimeSpanFromNow(30)), formatNewRecord(data)].slice(-RECORD_ARRAY_LENGTH),
    };
}

/** 
 * Adds a new second of data at the end of the array of records, consisted of "quantity" number of objects
 * @param oldData NetworkUsageRecord already in memory to receive the new Record
 **/
export function addNewRecord(oldData: Types.NetworkUsageRecord): Types.NetworkUsageRecord {
    return Object.fromEntries(Object.entries(oldData).map(([key, values]) => {
        return [key, {
            ...values,
            Records: [...values.Records, emptyRecordObject(values.Name, GetTimeRounded())].slice(-RECORD_ARRAY_LENGTH)
        }]
    }))
}
/** 
 * Adds the data obtained from the web socket to an existing data in memory
 * @param oldData NetworkUsageData already in memory
 * @param newData SocketNetworkData obtained from the web socket
 **/
export function addNewData(oldData: Types.NetworkUsageData, newData: Types.SocketNetworkData): Types.NetworkUsageData {
    const index = findClosestTimeIndex(oldData.Records.map(el => el.Time), newData.Update_Time!);
    const closestRecord = oldData.Records[index]
    closestRecord.Download += newData.Download;
    closestRecord.Upload += newData.Upload;
    closestRecord.Total += newData.Download + newData.Upload;
    // WIP add objects protocol, hosts, processes
    return oldData
}

/** 
 * Sums the values of all the processes based on a filter
 * @param currentData NetworkUsageRecord to be summed
 * @param filterList String array of processes to exclude
 * @param timeSpan Array of numbers consisted of [start, end]
 **/
export function calculateNewTotal(
    currentData: Types.NetworkUsageRecord,
    filterList: string[],
    timeSpan: [number, number]
): Types.NetworkUsageData {
    const newTotal = {
        Name: 'Total',
        Total: 0,
        Download: 0,
        Upload: 0,
        Records: emptyRecordArray('Total', timeSpan),
    };
    newTotal.Records = newTotal.Records.map((record: Types.NetworkRecord, index: number) => {
        return {
            ...record,
            ...Object.keys(currentData).reduce(
                (totalSum, process: string) => {
                    if (filterList.includes(process)) return totalSum
                    return {
                        Upload: totalSum.Upload + currentData[process].Records[index].Upload,
                        Download: totalSum.Download + currentData[process].Records[index].Download,
                        Total: totalSum.Total + currentData[process].Records[index].Total,
                    };
                },
                { Upload: 0, Download: 0, Total: 0 },
            ),
        };
    });
    newTotal.Download = newTotal.Records.reduce(
        (sum: number, curr: Types.NetworkRecord) => sum + curr.Download, 0,);
    newTotal.Upload = newTotal.Records.reduce(
        (sum: number, curr: Types.NetworkRecord) => sum + curr.Upload, 0,);
    newTotal.Total = newTotal.Records.reduce(
        (sum: number, curr: Types.NetworkRecord) => sum + curr.Total, 0,);
    return newTotal;
}

/** 
 * Calculates the usage of a process in a cummulative way 
 * @param notCummulativeData NetworkUsageData with instantaneous usage
 **/
export function getCummulativeUsageOfProcess(notCummulativeData: Types.NetworkUsageData) {
    const data = structuredClone(notCummulativeData);
    data.Records = data.Records.map((record: Types.NetworkRecord, index: number) => {
        if (index === 0) return record;
        record.Download += data.Records[index - 1].Download;
        record.Upload += data.Records[index - 1].Upload;
        record.Total += data.Records[index - 1].Total;
        return record;
    });
    return data;
}

/** 
 * Inserts a Record from the Database into an existing array of Records
 * @param total Existing NetworkRecord[] 
 * @param current SocketNetworkData to add to Total
 **/
export function insertRecord(total: Types.NetworkRecord[], current: Types.SocketNetworkData) {
    const closestTimeIndex = findClosestTimeIndex(
        total.map(el => el.Time),
        current.Update_Time!,
    );
    const newRecord = {
        Download: total[closestTimeIndex].Download + current.Download,
        Hosts: total[closestTimeIndex].Hosts,
        Name: total[closestTimeIndex].Name,
        Processes: total[closestTimeIndex].Processes,
        Protocols: total[closestTimeIndex].Protocols,
        Time: total[closestTimeIndex].Time,

        Upload: total[closestTimeIndex].Upload + current.Upload,
        Total: total[closestTimeIndex].Total + current.Download + current.Upload,
    };
    total[closestTimeIndex] = newRecord;
    return total;
};

/** 
 * Formats the results from the GET query from the database into a NetworkUsageRecord
 * @param queryResults SocketNetworkData[] obtained from query
 * @param start Start of time span from query
 * @param end End of time span from query
 **/
export function formatFromQuery(queryResults: Types.SocketNetworkData[], start: number, end: number): Types.NetworkUsageRecord {
    const record: Types.NetworkUsageRecord = {}
    queryResults.forEach(res => {
        if (record[res.Name] === undefined)
            return record[res.Name] = {
                Name: res.Name,
                Upload: res.Upload,
                Download: res.Download,
                Total: res.Upload + res.Download,
                Records: emptyRecordArray(res.Name, [start, end]),
            }
        record[res.Name] = {
            Name: res.Name,
            Upload: res.Upload + record[res.Name].Upload,
            Download: res.Download + record[res.Name].Download,
            Total: res.Upload + res.Download + record[res.Name].Total,
            Records: insertRecord(record[res.Name].Records, res),
        }
    })
    return record
}