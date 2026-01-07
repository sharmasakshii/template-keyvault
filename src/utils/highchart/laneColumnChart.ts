import Highcharts from "highcharts";
import { formatNumber, getImageUrl } from "utils";
import styles from '../../scss/config/_variable.module.scss';

export const laneColumnChart = (props: any) => {
    return {
        credits: {
            enabled: false
        },
        chart: {
            type: 'bar',
            marginLeft: 90,
            marginRight: 90,
            height: props?.lanePageArr?.length > 3 ? props?.lanePageArr?.length * 30 : props?.lanePageArr?.length * 70,
        },
        lang: {
            contextButtonTitle: "Download Snapshot"
        },
        exporting: {
            buttons: {
                contextButton: {
                    theme: {
                        fill: (styles.white),
                        states: {
                            hover: {
                                fill: (styles.white)
                            },
                        }
                    },
                    symbol: `url(${getImageUrl("/images/download.svg")})`,
                    symbolX: 22,
                    symbolY: 22,
                    symbolWidth: 30,
                    symbolHeight: 30,
                    titleKey: "contextButtonTitle",
                    menuItems: null,
                    onclick(this: Highcharts.Chart) {
                        this.exportChartLocal({
                            type: 'image/png'
                        }, {});
                    }
                }
            },
        },
        plotOptions: {
            bar: { // Ensure bar plotOptions are used
                pointPadding: 0.2,
                borderWidth: 0,
                borderRadius: 5, // Border radius applied to bar chart
            },
            series: {
                dataLabels: {
                    enabled: false,
                    inside: false
                }
            }
        },
        colors: [
            '#4572A7',
            '#AA4643',
            '#89A54E',
            '#80699B',
            '#3D96AE',
            '#DB843D',
            '#92A8CD',
            '#A47D7C',
            '#B5CA92'
        ],
        title: {
            text: props?.heading,
            style: {
                fontSize: "14px", marginBottom: 0, fontWeight: "600", fontFamily: "'Poppins', sans-serif" // Set the font size here
            }
        },
        subtitle: {
            text: ''
        },
        xAxis: [
            {
                lineWidth: 0,
                tickLength: 0,
                labels: {
                    enabled: false
                }
            }
        ],
        yAxis: [{
            tickPositioner: function (_: any) {
                const point: any = this;
                let maxDeviation = Math.ceil(Math.max(Math.abs(point.dataMax), Math.abs(point.dataMin)));
                let halfMaxDeviation = Math.ceil(maxDeviation / 2);
                return [-maxDeviation - 1, -halfMaxDeviation - 1, 0, halfMaxDeviation + 4, maxDeviation + 4];
            },
            gridLineWidth: 0,
            minorGridLineWidth: 0,
            labels: {
                enabled: false
            },
            plotLines: [{
                value: 0,
                width: 0.5,
                color: 'black',
                zIndex: 10
            }],
            title: {
                text: ''
            }
        }],
        legend: {
            enabled: false
        },
        tooltip: {
            enabled: true,
            formatter(_: any) {
                const point: any = this;
                return point.y > 0 ? `<b><span>${point.key.split("_").join(" to ")}</span> </br> ${formatNumber(true, point.y, 1)} ${props?.unitDto || 'g'}</b>` : `<b> <span>${point.key.split("_").join(" to ")}</span> </br> ${formatNumber(true, Math.abs(point.series.options?.data[point.point?.index]?.y), 1)} ${props?.unitDto || 'g'}</b>`
            }
        },
        series: [{
            name: '',
            data: props.lanePageArr ? props.lanePageArr : [['Shanghai', 24]],
            pointWidth: 17,
            dataLabels: {
                enabled: false,
                rotation: 0,
                color: (styles.white),
                align: 'center',
                crop: false,
                formatter(_: any) {
                    const point: any = this;
                    return point.y > 0 ? formatNumber(true, point.y, 1) + " g" : formatNumber(true, Math.abs(point.y), 1) + " g"
                }
            }
        }]
    }
}