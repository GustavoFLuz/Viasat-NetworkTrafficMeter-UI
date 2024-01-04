import { NetworkUsageData } from '@/shared/types/NetworkUsage';
import { NumberToByte } from '@/utils/ByteUtils';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React from 'react';

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

type UsageListProps = {
  data: NetworkUsageData
}

export const UsageList: React.FC<UsageListProps> = ({ data }) => {
  return (
    <Table sx={{ maxHeight: "100%" }} size="small" aria-label="a dense table" stickyHeader >
      <TableHead >
        <TableRow sx={{ "&>th": { backgroundColor: "background.paper" } }}>
          <TableCell sx={{p:0, fontWeight:600}}>Protocol</TableCell>
          <TableCell sx={{p:0}} align="right"><DownloadIcon fontSize="small" /></TableCell>
          <TableCell sx={{p:0}} align="right"><UploadIcon fontSize="small" /></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.values(data.Protocols)
          .sort((a, b) => (b.Download + b.Upload) - (a.Download + a.Upload))
          .map((el) => (
            <TableRow
              key={el.Protocol_Name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell sx={{p:0}} component="th" scope="row">
                {el.Protocol_Name}
              </TableCell>
              <TableCell sx={{p:0}} align="right">{NumberToByte(el.Download)}</TableCell>
              <TableCell sx={{p:0}} align="right">{NumberToByte(el.Upload)}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
