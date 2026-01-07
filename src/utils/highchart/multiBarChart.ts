import Highcharts from "highcharts";
import { formatNumber, numberFormatShort, getImageUrl } from "utils";
import styles from '../../scss/config/_variable.module.scss'

const multiBarChart = ({ xTitle, yTitle, options, barWidth = 40, yKey = "data", xKey = "name", barColor, decimalPlace = 1, isTooltip = false, isenabledataLabel = true, graphTitle = null, exportDownload = false }: any) => {

  return {
    chart: {
      type: 'column' // This sets the chart to be a vertical bar (column) chart
    },
    credits: {
      enabled: false
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
    lang: {
      contextButtonTitle: "Download Snapshot"
    },

    exporting: {
      enabled: exportDownload,
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

    tooltip: {
      enabled: isTooltip,
      useHtml: true,
      formatter: function (): string {
        const point = this as any; // Cast to any to use this context safely
        return `<div>
            ${formatNumber(true, point.y, decimalPlace)}
          </div>`;
      }
    },
    xAxis: {
      categories: options?.map((column: any) => column?.[xKey]), // Replace with your categories
      title: {
        text: xTitle,
        margin: 8,
      }
    },
    legend: {
      enabled: false // This disables the legend completely
    },
    plotOptions: {
      column: {
        borderRadius: 10, // Set the radius here (adjust for your preference)
        groupPadding: 0.1,    // Space between series
        pointPadding: 0.2,    // Space between bars within a category
        maxPointWidth: 25     // Limit bar width
      },
      series: {
        borderRadiusTopLeft: "20%",
        borderRadiusTopRight: "20%",
        pointWidth: barWidth,
        dataLabels: {
          enabled: isenabledataLabel,
          inside: false,
          y: -10,
          align: 'center',
          verticalAlign: "bottom",
          formatter: function (_: any) {
            const point: any = this;
            return numberFormatShort(decimalPlace).format(point.y)
          },
          style: {
            textOutline: false,

          }
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: yTitle,
        margin: 8,
        align: 'middle', // Align vertically
        x: -10 // Adds space to the left
      },
    },
    series: [{ color: barColor, data: options?.map((column: any) => ({y: column?.[yKey], })) }]
  };
};

export default multiBarChart;
