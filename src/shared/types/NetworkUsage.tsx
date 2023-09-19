import { Alert } from "./Notifications";

export type NetworkUsageContext = {
    data: {
        current: NetworkUsageRecord,
        totalHistory: NetworkUsageData,
        add: (rawData: string) => Record<string, NetworkUsageData>,
        selected: NetworkUsageData
    },
    selection: {
        select: (pid: string) => void,
        selected: string | null
    }
}

export type NetworkUsageRecord = Record<string, NetworkUsageData>

export type NetworkUsageData = {
    Name: string,
    Download: number,
    Upload: number,
    Total: number,
    Notified: boolean,
    Records: NetworkRecord[]
}

export type NetworkRecord = {
    Name: string,
    Upload: number,
    Download: number,
    Total: number,
    Processes: ProcessList,
    Protocols: ProtocolList,
    Hosts: HostList,
    Time: number,
}

type ProcessList = Record<string, {
    Pid: number,
    Create_Time: number,
    Update_Time: number,
    Upload: number,
    Download: number,
}>

type ProtocolList = Record<string, {
    Protocol_Name: string,
    Upload: number,
    Download: number,
}>
type HostList = Record<string, {
    Host_Name: string,
    Upload: number,
    Download: number,
}>

export type SocketNetworkRecord = Record<string, SocketNetworkData>

export type SocketNetworkData = {
    Name: string,
    Download: number,
    Upload: number,
    Processes: ProcessList,
    Protocols: ProtocolList,
    Hosts: HostList
}

export type DataSettings = {
    sorting?: "total" | "download" | "upload",
    sortingDirection?: "asc" | "desc",
}