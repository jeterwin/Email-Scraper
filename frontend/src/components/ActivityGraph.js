import React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
} from "@mui/material";
import Chart from "react-apexcharts";

// Sample chart data
const barChartDataDailyTraffic = [
    {
        name: "Mails",
        data: [7, 5, 10, 8, 12, 5, 3],
    },
];

const barChartOptionsDailyTraffic = {
    chart: {
        type: "bar",
        toolbar: { show: false },
        height: 200,
        background: '#F6F6F6',
    },
    xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        labels: {
            style: {
                colors: "#888",
                fontSize: "12px",
            },
        },
    },
    plotOptions: {
        bar: {
            borderRadius: 18,
            columnWidth: "45%",
        },
    },
    dataLabels: {
        enabled: false,
    },
    colors: ["#5DB075"],
    stroke: {
        show: true,
        width: 2,
        color: "#012815",
    },
    grid: {
        show: true,
    },
};

export default function ActivityGraph(props) {
    return (
        <Card sx={{
            width: "47%",
            backgroundColor: 'white',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            borderRadius: '20px',
            margin: '0 0 0 2%',
            marginTop: '2%',
            ...props.sx }}>
            <CardContent>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={2}
                >

                    <Stack spacing={1}>
                        <Typography variant="h5" color="text.primary" style={{ fontWeight: 'bold', marginLeft: '5px' }}>
                            Activity
                        </Typography>
                    </Stack>
                </Stack>

                {/* Chart */}
                <Box mt={3} height="240px" sx={{
                    backgroundColor: '#F6F6F6',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    p: 1,
                }}>
                    <Chart
                        options={barChartOptionsDailyTraffic}
                        series={barChartDataDailyTraffic}
                        type="bar"
                        height="100%"
                    />
                </Box>
            </CardContent>
        </Card>
    );
}

