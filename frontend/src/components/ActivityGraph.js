import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
} from "@mui/material";
import Chart from "react-apexcharts";
import axios from "axios";

const barChartOptionsDailyTraffic = {
    chart: {
        type: "bar",
        toolbar: { show: false },
        height: 200,
        background: '#F6F6F6',
    },
    xaxis: {
        categories: [],
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
        enabled: true,
    },
    colors: ["#5DB075"],
    stroke: {
        show: true,
        width: 2,
        color: '#012815',
    },
    grid: {
        show: true,
    },
};

export default function ActivityGraph(props) {
    const [categories, setCategories] = useState([]);
    const [emailCounts, setEmailCounts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost/email_scraper/Backend/Auth/Database/fetch_scrape_results.php');
                const mappedData = response.data.map(item => ({
                    time: item.meeting_time,
                }));

                const { sortedMonths, sortedCounts } = processCount(mappedData);
                setCategories(sortedMonths);
                setEmailCounts(sortedCounts);

            } catch (error) {
                console.error('Failed to fetch data: ', error);
            }
        }

        fetchData();
    }, []);


    const processCount = (data) => {
        const monthlyCounts = {};
        data.forEach((item) => {
            const date = new Date(item.time);
            const dateString = date.toString();
            const month = dateString.split(' ')[1];

            if (monthlyCounts[month]) {
                monthlyCounts[month]++;
            } else {
                monthlyCounts[month] = 1;
            }
        });

        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const sortedMonths = monthOrder.filter(month => month in monthlyCounts);
        const sortedCounts = sortedMonths.map(month => monthlyCounts[month]);

        return { sortedMonths, sortedCounts };
    }

    const barChartDataDailyTraffic = [
        {
            name: "No. of events",
            data: emailCounts,
        }
    ]

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
                        options={{
                            ...barChartOptionsDailyTraffic,
                            xaxis: {
                                categories,
                            },
                        }}
                        series={barChartDataDailyTraffic}
                        type="bar"
                        height="100%"
                    />
                </Box>
            </CardContent>
        </Card>
    );
}

