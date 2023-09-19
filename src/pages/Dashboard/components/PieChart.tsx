import { useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Cell, Pie, PieChart as PieChartRecharts, ResponsiveContainer } from 'recharts';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = (p: any) => {
    const radius = p.innerRadius + (p.outerRadius - p.innerRadius) * 0.3;
    const x = p.cx + radius * Math.cos(-p.midAngle * RADIAN);
    const y = p.cy + radius * Math.sin(-p.midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="black" textAnchor={x > p.cx ? 'start' : 'end'} dominantBaseline="central">
            {p.name}
        </text>
    );
};

type PieChartData = {
    Download: number,
    Upload: number,
    [key: string]: any
}
type FormatedPieChartData = { name: string, value: number }[]

interface PieChartProps {
    data: PieChartData;
}

const RADIUS_PROPORTION = 0.9

export const PieChart: React.FC<PieChartProps> = ({ data }) => {
    const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0, radius: 0 })
    const [formatedData, setFormatedData] = useState<FormatedPieChartData>([])
    const theme = useTheme();
    const resizePieChart = (containerWidth: number, containerHeight: number) => {
        setChartDimensions({ width: containerWidth, height: containerHeight, radius: Math.floor((Math.min(containerWidth, containerHeight) * RADIUS_PROPORTION) / 2) })
    }
    useEffect(() => {
        setFormatedData([
            { name: "Download", value: data.Download },
            { name: "Upload", value: data.Upload },
        ])
    }, [data])
    return (
        <ResponsiveContainer onResize={resizePieChart} width={"100%"} height={"100%"} debounce={1}>
            <PieChartRecharts width={400} height={400}>
                <Pie
                    data={formatedData}
                    cx={chartDimensions.width / 2}
                    cy={chartDimensions.height / 2}
                    isAnimationActive={false}
                    label={renderCustomizedLabel}
                    labelLine={false}
                    outerRadius={chartDimensions.radius}
                    fill="#8884d8"
                    dataKey="value"
                >
                    <Cell key={`cell-download`} fill={theme.palette.primary.light} />
                    <Cell key={`cell-upload`} fill={theme.palette.secondary.light} />
                </Pie>
            </PieChartRecharts>
        </ResponsiveContainer>
    )
}