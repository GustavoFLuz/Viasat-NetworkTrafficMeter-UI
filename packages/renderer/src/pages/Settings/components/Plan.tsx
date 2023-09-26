import { ViasatPlanType } from '@/shared/types/Shared';
import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material';
import { CustomGrid } from './CustomGrid';

const ViasatResidentialPlans: ViasatPlanType[] = [
    { id: 1, name: "Economic", capacity: "25GB", nightFree: "300GB", download: "10MB", upload: "1.5MB" },
    { id: 2, name: "Smart", capacity: "50GB", nightFree: "400GB", download: "15MB", upload: "3MB" },
    { id: 3, name: "Prime", capacity: "100GB", nightFree: "500GB", download: "20MB", upload: "3MB" },
    { id: 4, name: "Infinity", capacity: "160GB", nightFree: null, download: "30MB", upload: "3MB" }
]

interface PlanProps {
    settings: ViasatPlanType | null,
    handleChange: (newData: any) => void
}

export const Plan: React.FC<PlanProps> = ({ settings, handleChange }) => {
    const plan = settings;
    return (
        <CustomGrid
            firstComponent={
                <>
                    <Typography variant='h6' sx={{ fontWeight: "bold" }}>Plan</Typography>
                    <Typography variant="body1" > Select the contracted residential internet plan  </Typography>
                    <FormControl sx={{ my: 3, width: "50%" }}>
                        <Select
                            value={plan?.id || ""}
                            onChange={(e) => {
                                const plan = ViasatResidentialPlans.find((plan: any) => plan.id === e.target.value);
                                return handleChange({ plan: plan ? plan : null })
                            }}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem value="" disabled>
                                Select a plan
                            </MenuItem>
                            <MenuItem key={-1} value={-1}>No plan</MenuItem>
                            {ViasatResidentialPlans.map(plan => (
                                <MenuItem key={plan.id} value={plan.id}>{plan.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </>
            }
            secondComponent={
                plan ? (
                    <Box sx={{userSelect:"text"}}>
                        <Typography variant='body1'>
                            You have selected the <b>{plan.name}</b> plan.
                            Which includes:
                            <ul>
                                <li><b>{plan.capacity}</b> of data per month.</li>
                                {plan.nightFree ? (<li><b>{plan.nightFree}</b> of free data at night per month</li>)
                                    : <li><b>Unlimited</b> free data at night per month</li>}
                                <li><b>{plan.download}</b> of download speed</li>
                                <li><b>{plan.upload}</b> of upload speed</li>
                            </ul>
                        </Typography>
                    </Box>
                ) : <></>
            }
        />
    )
}
