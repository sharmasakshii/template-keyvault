import Highcharts from "highcharts";
import { formatNumber, getImageUrl } from 'utils';
import styles from '../../scss/config/_variable.module.scss'

export const LineChartEv = (props: any) => {
    const { options, xKey, yTitle, decimalUpto = 0, graphTitle = null, enableDownload=false, dataKey="data" } = props
    return {
        chart: {
            type: 'spline',
        },
        credits: {
            enabled: false
        },
        lang: {
            contextButtonTitle: "Download Snapshot"
        },
        title: {
            useHTML: true,
            text: graphTitle,
            align: 'left',
            style: {
                fontSize: '12px',
                whiteSpace: 'nowrap'
            }
        },
        exporting: {
            enabled: enableDownload,
            buttons: {
                contextButton: {
                  align: 'right', // Align the button to the right
                  verticalAlign: 'top', // Align the button to the top
                  x: -10, // Fixed horizontal offset
                  y: 10, // Fixed vertical offset
                  theme: {
                    fill: styles.white,
                    states: {
                      hover: {
                        fill: styles.white
                      }
                    }
                  },
                  symbol: `url(${getImageUrl("/images/download.svg")})`,
                  symbolX: 14,
                  symbolY: 17,
                  symbolWidth: 10,
                  symbolHeight: 10,
                  titleKey: "contextButtonTitle",
                  menuItems: null,
                  onclick(this: Highcharts.Chart) {
                    this.exportChartLocal({
                      type: 'image/png'
                    });
                  }
                }
              }    
        },
       
        xAxis: {
            categories: options?.[xKey],
        },
        yAxis: {
            title: {
                text: yTitle,
            }
        },
        tooltip: {
            enabled: true,
            useHTML: true,
            formatter: function (): string {
                const point = this as any; // Cast to any to use this context safely
                return `<div class="font-12">
                            ${formatNumber(true, point.y, decimalUpto)}
                        </div>`;
            },
        },
        plotOptions: {
            spline: {
                marker: {
                    enabled: true,
                    symbol: 'circle'
                },
            },
        },
        legend: {
            itemStyle: {
                fontSize: '14px'
            }
        },
        series: options?.[dataKey]
    };
}