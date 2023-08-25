import { createContext, useContext, useEffect, useReducer, useState } from "react"
import { ByteToNumber, NumberToByte } from "@/utils/ByteUtils"
import { NetworkUsageTypes as Types } from "@/shared/types"
import { NetworkUsageData } from './../types/NetworkUsage';
import { SettingsContext, NotificationContext, NotificationProvider } from ".";

export const NetworkUsageContext = createContext<Types.NetworkUsageContext | null>(null)

interface NetworkUsageDataProps {
    children: React.ReactNode
}

export const NetworkUsageProvider: React.FC<NetworkUsageDataProps> = ({ children }) => {
    // Data states
    const [networkUsageData, setNetworkUsageData] = useState<Types.NetworkUsageData[]>([])
    const [totalHistory, setTotalHistory] = useState<Types.GroupedTotalData[]>(create30lengthArray("Total", "-1"))
    const [processesHistory, setProcessesHistory] = useState<(Types.GroupedTotalData & { pid: string })[][]>([])

    const [selectedProcess, setSelectedProcess] = useState<string | null>(null)
    const [selectedData, setSelectedData] = useState<Types.GroupedTotalData[]>(create30lengthArray("Total"))

    const { settings: { notifications } } = useContext(SettingsContext)!
    const { notify } = useContext(NotificationContext)!

    // State operations

    //Process of adding new data to current state\
    const addData = (rawData: string) => {
        setNetworkUsageData((prev) => {
            const notifiedProcesses = prev.filter((process: Types.NetworkUsageData) => process.notified).map((process: Types.NetworkUsageData) => process.pid)

            const formatedData = convertToJson(rawData, notifiedProcesses)
            if (formatedData === null) return prev

            formatedData.forEach((process) => {
                if (notifications.enabled && notifications.processUsage > 0) {
                    if (!process.notified && process.total_value >= notifications.processUsage) {
                        notify(process.pid, `${process.name} reached usage of ${NumberToByte(notifications.processUsage)}`, "warning")
                        process.notified = true;
                    }
                }
            })
            return formatedData
        })
    }

    useEffect(() => {
        const newTotal = {
            pid: "-1",
            name: "Total",
            total_value: 0,
            download_value: 0,
            upload_value: 0,
            time: Date.now()
        }
        const newProcesseshistory = networkUsageData.map((process) => {
            newTotal.total_value += process.total_value
            newTotal.download_value += process.download_value
            newTotal.upload_value += process.upload_value

            const existingProcess = processesHistory.find((history) => history[0].pid === process.pid)
            const newData = { ...process, time: Date.now() }
            if (existingProcess) {
                return [...existingProcess, newData].slice(-31)
            }

            return [...create30lengthArray(process.name, process.pid), newData].slice(-31)
        })
        let notifyTotal = totalHistory[totalHistory.length - 1].notified
        if (!notifyTotal && notifications.enabled && notifications.processUsage > 0) {
            if (newTotal.total_value >= notifications.totalUsage) {
                notify(newTotal.pid, `Total consumption reached usage of ${NumberToByte(notifications.totalUsage)}`, "error")
                notifyTotal = true;
            }
        }
        setTotalHistory((prev) => [...prev, { ...newTotal, time: Date.now(), notified: Boolean(notifyTotal) }].splice(-31))
        setProcessesHistory(newProcesseshistory)
    }, [networkUsageData])

    // Selection operations
    const selectProcess = (pid: string) => {
        setSelectedProcess(prev => prev === pid ? null : pid)
    }

    useEffect(() => {
        if (selectedProcess === null)
            return setSelectedData(totalHistory)
        const selectedProcessHistory = processesHistory.find((history) => history[0].pid === selectedProcess)
        if (selectedProcessHistory)
            setSelectedData(selectedProcessHistory)
    }, [selectedProcess, processesHistory, totalHistory])

    return (
        <NetworkUsageContext.Provider value={{
            data: {
                current: networkUsageData,
                totalHistory: totalHistory,
                processesHistory: processesHistory,
                add: addData,
                selected: selectedData
            },
            selection: {
                select: selectProcess,
                selected: selectedProcess
            }
        }}>
            {children}
        </NetworkUsageContext.Provider>
    )
}

function convertToJson(rawString: string, notified: string[]): NetworkUsageData[] | null {
    const body = rawString
        .replaceAll(/\n/g, "")
        .split("\r")
        .filter((section: string) => section)
        .at(-1);
    if (body !== undefined) {
        return JSON.parse(body).map((process: any) => {
            const download_value = ByteToNumber(process.download);
            const upload_value = ByteToNumber(process.upload);
            const total_value = download_value + upload_value;
            return {
                ...process,
                download_value,
                upload_value,
                total_value,
                total: NumberToByte(total_value),
                notified: notified.includes(process.pid),
            }
        })
    }
    return null
}

function create30lengthArray(name: string, pid?: string) {
    return Array.from({ length: 30 }, (_, i) => ({
        name: name,
        pid: pid || "",
        total_value: 0,
        download_value: 0,
        upload_value: 0,
        time: Date.now() - (i * 1000)
    }))
}