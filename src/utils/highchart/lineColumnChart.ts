import Highcharts from "highcharts";
import styles from '../../scss/config/_variable.module.scss'
import { formatNumber, getImageUrl, normalizedList } from "utils";

export const lineColumnChart = ({ heading = "", ...props }: any) => {

  const { yLabel } = props
  const optionLine = {
    credits: {
      enabled: false
    },
    chart: {
      type: 'column',
      inverted: true,
      height: props?.regionPageArr?.length * 30 + 50,
    },
    xAxis: {
      categories: props.regionPageArr?.map((i: any) => `${i?.name} (${i?.y > 0 ? "+" + formatNumber(true, i?.y, 1) : "-" + formatNumber(true, Math.abs(i?.yValue), 1)})`),
      lineWidth: 0,
      minorGridLineWidth: 0,
      lineColor: 'transparent',
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        borderRadius: 5, // Add border radius here
      },
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
          symbolX: 11,
          symbolY: 13,
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
    yAxis: {
      gridLineColor: 'transparent',
      title: {
        text: ''
      },
      labels: {
        enabled: false
      },
      plotLines: [{
        value: 0,
        width: 0.5,
        color: 'black',
        zIndex: 10
      }],
    },
    title: {
      text: heading,
      style: {
        fontSize: "14px", marginBottom: 0, fontWeight: "600", fontFamily: "'Poppins', sans-serif" // Set the font size here
      }
    },
    subtitle: {
      text: ''
    },
    legend: {
      enabled: false,
      itemStyle: {
        font: '9pt Helvetica, Arial, sans-serif',
        activecolor: (styles.silver),
        'font-weight': 'bold',
        'text-decoration': 'none'
      }
    },
    tooltip: {
      enabled: true,
      formatter(_: any) {
        const point: any = this;
        return point.y > 0 ? `<b>${point.key} </br> ${formatNumber(true, point.y, 1)} ${props?.unitDto}</b>` : `<b>${point.key} </br> ${formatNumber(true, Math.abs(point.series.options?.data[point.point?.index]?.yValue), 1)} ${props?.unitDto}</b>`
      }
    },
    series: [{
      name: '',
      pointWidth: 15,
      data: props.regionPageArr ? props.regionPageArr : [['Shanghai', 24]],
    }]
  }
  let emissionsReduction = []

  if (props?.chart === 'emissionIntensityTrends') {
    emissionsReduction.push({
      name: "Benchmarks",
      data: props?.istatic ? [.7, 0.5, 0.6, 0.3, 0.2, 0.4, 0.2, 1.0, 1.3, .8, 1.2, 1.0] : normalizedList(props?.options)?.map((i: any) => Number.parseFloat(i?.[props?.ykey] || 0)),
      color: (styles.secondaryBlue),
      marker: {
        symbol: 'circle',
        radius: 10,
      },
      zoneAxis: 'x',
      threshold: 2,

      dataLabels: {
        enabled: true,
        y: -4,
        x: -30,
        color: (styles.primary),
        useHTML: true,
        crop: false,
        overflow: 'none',
        allowOverlap: false,
        formatter: function () {
          return ``;
        },
      },
    });

    emissionsReduction.push({
      name: props?.companyName,
      data: props?.istatic ? [1.0, 1.2, 1.3, 1.2, 1.0, 1.3, 1.0, 1.2, 1.3, 1.2, 1.0, 1.3] : normalizedList(props?.options)?.map((i: any) => Number.parseFloat(i?.[props.xkey] || 0)),
      color: (styles.primary),
      marker: {
        symbol: 'circle',
        radius: 10,
      },
      zoneAxis: 'x',
      threshold: 2,

      dataLabels: {
        enabled: true,
        // y: -4,
        x: -30,
        color: (styles.primary),
        useHTML: true,
        crop: false,
        overflow: 'none',
        allowOverlap: false,
        formatter: function () {
          return ``;
        },
      },
    });
  }

  const optionsEmissionIntensityTrends = {
    credits: {
      enabled: false,
    },
    chart: {
      zoomType: 'xy',
    },
    title: {
      text: '',
    },
    exporting: {
      enabled: false,
    },

    yAxis: {
      min: 0,
      title: {
        useHTML: true,
        text: `<div class="d-flex gap-3 verticaldata justify-content-center align-items-center">
        <div class="linesbefore"></div>
        <p class="font-14 mb-0">
          ${yLabel}
        </p>
        <div class="linesbefore"></div>
      </div>`
      },
      enabled: false,
      gridLineColor: 'transparent',
      labels: {
        formatter: function (this: any) {
          return formatNumber(true, this.value, 1)
        },
      },
    },
    tooltip: {
      formatter: function (this: any) {
        return (
          `<b>${this.key} </br>` + formatNumber(true, (Math.round(this.y * 10) / 10), 1)
        );
      },
    },
    dataLabels: {
      enabled: false,
      rotation: 0,
      color: (styles.white),
      align: 'center',
      crop: false,
      format: '{point.y:.2f}',
    },

    legend: {
      symbolRadius: 0,
      itemStyle: {
        font: '9pt Helvetica, Arial, sans-serif',
        activecolor: (styles.silver),
        'font-weight': 'bold',
        'text-decoration': 'none'
      }
    },

    xAxis: {
      lineColor: (styles.lilac),
      min: 0,
      labels: {
        enabled: true,
        useHTML: true,
      },
      categories: normalizedList(props?.options)?.map((i: any) => i?.month),
      accessibility: {
        description: 'Countries',
      },
      title: {
        useHTML: true,
        text: `<div class="d-flex gap-3 milesdata justify-content-center align-items-center mt-2">
                      <div class="linesbefore"></div>
                          <p class="font-14 mb-0">Months</p>
                      <div class="linesbefore"></div>

                  </div>`,
      },
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
        marker: {
          enabled: true,
        },
      },
    },

    series: emissionsReduction,

    responsive: {
      rules: [
        {
          condition: {},
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
              symbolRadius: 0,
            },
          },
        },
      ],
    },
  };

  let result: any = null;

  if (props.chart === "emissionIntensityTrends") {
    result = optionsEmissionIntensityTrends;
  } else {
    result = optionLine
  }

  return result;

}