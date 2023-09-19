import { NumberToByte } from '@/utils/ByteUtils';
import { useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { AreaChart as AreaChartRecharts, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


interface AreaChartProps {
  data: any;
}

export const AreaChart: React.FC<AreaChartProps> = ({ data }) => {
  const theme = useTheme();
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 })

  const resizeAreaChart = (containerWidth: number, containerHeight: number) => {
    setChartDimensions({ width: containerWidth, height: containerHeight })
  }

  const [formatedData, setFormatedData] = useState<any>([])

  useEffect(() => {
    setFormatedData(data.Records)
  }, [data])

  return (
    <ResponsiveContainer onResize={resizeAreaChart} debounce={1}>
      <AreaChartRecharts
        width={chartDimensions.width}
        height={chartDimensions.height}
        data={formatedData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
        syncId={"area_chart"}

      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="Time"
          type="number"
          tickFormatter={(value: number) => new Date(value).toLocaleTimeString()}
          interval="preserveStartEnd"
          domain={['dataMin', 'dataMax']}
        />
        <YAxis
          tickFormatter={(value: number) => NumberToByte(value).replace(".00", "")}
        />
        <Tooltip
          formatter={(value: number, name: string, props) => [NumberToByte(value), name[0].toUpperCase() + name.slice(1)]}
          labelFormatter={(value: number) => `${data.Name} at: ${new Date(value).toLocaleTimeString()}`}
        />
        <Area
          key={`area_chart_download`}
          type="monotone"
          dataKey="Download"
          stroke={theme.palette.primary.dark}
          fill={theme.palette.primary.light}
          isAnimationActive={false}
        />
        <Area
          key={`area_chart_upload`}
          type="monotone"
          dataKey="Upload"
          stroke={theme.palette.secondary.dark}
          fill={theme.palette.secondary.light}
          isAnimationActive={false}
        />
      </AreaChartRecharts>
    </ResponsiveContainer>
  );
}