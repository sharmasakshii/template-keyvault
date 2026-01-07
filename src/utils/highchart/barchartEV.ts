import Highcharts from "highcharts";
import { formatNumber, getImageUrl } from 'utils';
import styles from '../../scss/config/_variable.module.scss'

export const barchartEV = (props: any) => {
    const { yTitle, chartType, options, xTitle, showXtitle, barKey, decimalUpto = 0, isTooltip = true } = props
    const list = options?.map((column: any) => { return column?.[barKey] * (130 / 100) || 0 })
  const maxValue = Math.max(...list);
    return {
        chart: {
            type: chartType
        },
        credits: {
            enabled: false
        },
        title: {
            text: ''
        },
        exporting: {
            enabled: false
        },
        legend: {
            enabled: false,
            symbolRadius: 0,
            fontSize: '14px',
        },
        tooltip: {
            enabled: isTooltip,
            useHTML: true,
            formatter: function (): string {
                const point = this as any; // Cast to any to use this context safely
                return `<div class="font-12">
                            ${formatNumber(true, point.y, decimalUpto)}
                        </div>`;
            },
            positioner: function (labelWidth: number, labelHeight: number, point: Highcharts.Point): { x: number; y: number } {

                let tooltipX = point.plotX ? point.plotX + 30 : 0;
                let tooltipY = point.plotY ? point.plotY + 10 : 0; // Adjust Y position above the point
                if (tooltipX < 0) {
                    tooltipX = 0;
                }
                if (tooltipY < 0) {
                    tooltipY = -10;
                }
                return {
                    x: tooltipX,
                    y: tooltipY
                };
            },
        },
        plotOptions: {
            bar: {
                pointPadding: 0.2,
                borderWidth: 0,
                dataLabels: {
                    enabled: false
                },
                groupPadding: 0.1,
                pointWidth: 25
            },
            column: {
                borderRadius: 10, // Set the radius here (adjust for your preference)
                pointPadding: 0.2,
                borderWidth: 0,
                pointWidth: 25,
                dataLabels: {
                    enabled: true,
                    useHTML: true,
                    inside: false,
                    align: "center",
                    verticalAlign: 'bottom',

                    formatter: function (_: any) {
                        const point: any = this;
                        const carrier = options[point.point.index].carrier;
                        const carrierIcon = carrier?.image ? `<img src="${getImageUrl(carrier.image)}" class="logo-img" alt="${carrier.name}" />` : '';

                        // Return the HTML for the image icon above the bar
                        return `<div> ${carrierIcon} </div>`;
                    },
                }
            },
        },
        xAxis: {
            categories: options?.map((column: any) => column?.carrier?.name),
            title: {
                text: xTitle,
                enabled: showXtitle,
            },
            crosshair: true,
        },
        yAxis: {
            title: {
                text: yTitle
            },
            gridLineWidth: 0,
            max: maxValue, // Set the maximum value based on the data
        },
        series: [
            {
                name: 'Corn',
                color: styles.primary,
                data: options?.map((column: any) => column[barKey] || 0)
            }
        ]
    }
}