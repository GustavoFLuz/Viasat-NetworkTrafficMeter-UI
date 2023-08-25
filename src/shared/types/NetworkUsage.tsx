export type NetworkUsageContext = {
    data: {
        current: NetworkUsageData[],
        totalHistory: GroupedTotalData[],
        processesHistory: (GroupedTotalData & { pid: string })[][],
        add: (rawData: string) => void,
        selected: GroupedTotalData[]
    },
    selection: {
        select: (pid: string) => void,
        selected: string | null
    }
}

export interface NetworkUsageData {
    pid: string,
    name: string,
    download: string,
    upload: string,
    total: string,
    download_value: number,
    upload_value: number,
    total_value: number,
    notified: boolean,    

    download_speed: string,
    upload_speed: string,
    total_speed: string,

    last_time_update: string,
    create_time: string,

    host_traffic:
    {
        host: string,
        download: string,
        upload: string,
    }[],

    protocol_traffic:
    {
        protocol: string,
        download: string,
        upload: string,
    }[]

}

export type GroupedTotalData = {
    name: string,
    total_value: number,
    download_value: number,
    upload_value: number,
    time: number,
    [key: string]: any
}

export type DataSettings = {
    sorting?: "total" | "download" | "upload",
    sortingDirection?: "asc" | "desc",
}