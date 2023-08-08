import { Box, Paper, SvgIconTypeMap, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useContext, useEffect, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { AppListItem } from './AppListItem';
import { NetworkUsageContext } from '@/shared/contexts';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { NetworkUsageData } from '@/shared/types/NetworkUsage';
const DrawerWidth = "25%"

const Drawer = styled(Box, { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    position: 'absolute',
    top: 0,
    right: 0,
    width: open ? DrawerWidth : 0,
    height: "100%",
    backgroundColor: theme.palette.background.default,
}))


function createData(name: string, download: number, upload: number) {
    return { name, download, upload };
}

interface AppListProps {
    children?: React.ReactNode;
    drawerOpen: boolean;
    data: any;
}

type SortingOptions = "name" | "download_value" | "upload_value" | "total_value"

export const AppList: React.FC<AppListProps> = ({ children, drawerOpen, data }) => {
    const [sortedData, setSortedData] = useState<NetworkUsageData[]>(data);
    const [sorting, setSorting] = useState<SortingOptions>("total_value");
    const [sortingDirection, setSortingDirection] = useState<1 | -1>(-1);

    const changeSorting = (column: SortingOptions) => {
        sorting == column ? setSortingDirection((prev: 1 | -1) => prev === 1 ? -1 : 1) : setSorting(column);
    }

    const getSortingIcon = (column: string) => {
        return sorting == column ?
            (sortingDirection === 1 ?
                <ArrowDropUpIcon sx={{ verticalAlign: "middle" }} /> :
                <ArrowDropDownIcon sx={{ verticalAlign: "middle" }} />)
            : <></>
    }

    useEffect(() => {
        setSortedData(data.sort((a: any, b: any) =>
            typeof (a[sorting]) === "string" ?
                sortingDirection * a[sorting].localeCompare(b[sorting])
                : sortingDirection * (a[sorting] - b[sorting])
        ))
    }, [data, sorting, sortingDirection])

    return (
        <Box sx={{ position: 'relative', height: "100%", }}>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "stretch", height: "100%", width: drawerOpen ? "calc(100% - " + DrawerWidth + ")" : "100%" }}>
                {children}
            </Box>
            <Drawer open={drawerOpen} >
                <TableContainer sx={{ height: "90%", pb: 8, boxSizing: "border-box", fontSize: 5, overflow: "auto" }} >
                    <Table sx={{ width: "100%", tableLayout: "auto" }} size="small" aria-label="a dense table">
                        <TableHead sx={{ height: '2em' }}>
                            <TableRow>
                                <TableCell onClick={() => changeSorting('name')}
                                    align="right" sx={{ minWidth: "100px", cursor: "pointer", whiteSpace: "nowrap", verticalAlign: "middle" }}>
                                    {getSortingIcon('name')}
                                    <span>Name</span>
                                </TableCell>
                                <Tooltip title="Download">
                                    <TableCell onClick={() => changeSorting('download_value')}
                                        align="right" sx={{ width: "50px", px: 1, cursor: "pointer", verticalAlign: "middle" }}>
                                        {getSortingIcon('download_value')}
                                        <DownloadIcon fontSize='small' />
                                    </TableCell>
                                </Tooltip>
                                <Tooltip title="Upload">
                                    <TableCell onClick={() => changeSorting('upload_value')}
                                        align="right" sx={{ width: "50px", px: 1, cursor: "pointer", verticalAlign: "middle" }}>
                                        {getSortingIcon('upload_value')}
                                        <UploadIcon fontSize='small' />
                                    </TableCell>
                                </Tooltip>
                                <Tooltip title="Total">
                                    <TableCell onClick={() => changeSorting('total_value')}
                                        align="right" sx={{ width: "50px", px: 1, cursor: "pointer", verticalAlign: "middle" }}>
                                        {getSortingIcon('total_value')}
                                        <ImportExportIcon fontSize='small' />
                                    </TableCell>
                                </Tooltip>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedData.map((row: any) => (
                                <AppListItem key={row.pid} data={row} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Drawer>
        </Box>
    )
}
