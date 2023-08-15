import React from 'react'
import { Grid } from '@mui/material'

type GridProps = {
    firstComponent: React.ReactNode,
    secondComponent: React.ReactNode
}

export const CustomGrid: React.FC<GridProps> = ({ firstComponent, secondComponent }) => {
    return (
        <Grid container spacing={3} mt={1} mb={2} alignItems="center">
            <Grid item xs={7} px={6}>
                {firstComponent}
            </Grid>
            <Grid item xs={5}>
                {secondComponent}
            </Grid>
        </Grid>
    )
}
