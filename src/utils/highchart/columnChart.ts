import { formatNumber, getImageUrl } from "utils";
import styles from '../../scss/config/_variable.module.scss';

export const columnChart = (props: any) => {


    let arrNew1: any = []
    props?.options?.dataset.map((x: any, index: number) => {
        arrNew1.push({
            name: `${x?.carrier_name}(${x?.carrier})`,
            obj: x,
            data: [Number(x[props?.dataytpe]?.toFixed(2) || 0)],
            color: index === 0 ? (styles.lightgreen) : (styles.primary),
            pointWidth: 50,
        });
        return true;
    });
    const list = arrNew1?.map((i: any) => i?.data || 0).flat()
    return {
        credits: {
            enabled: false,
        },
        title: {
            text: `
              <span class="fw-medium fontFamily mb-2 font-14">${props?.content}</span>
              <br/><span class="fw-semibold fontFamily font-20 mb-1">${props?.heading}</span>
            <span  class="fw-semibold fontFamily font-12 mb-1">${props?.subtitle}</span>
       `,
            align: 'left'

        },
        chart: {
            type: "column",
        },
        legend: {
            symbolPadding: 0,
            symbolWidth: 0,
            symbolHeight: 0,
            squareSymbol: false,
            useHTML: true,
            margin: 0,
            padding: 0,
            x: 10,
            itemMarginTop: 10,
        },
        yAxis: {
            max:
                Math.trunc(Math.max(...list) + 10 || 50) * 1.3,
            title: {
                text: "",
            },
            enabled: false,
            gridLineColor: "transparent",
        },
        xAxis: {
            categories: [""],
            crosshair: true,
            lineColor: (styles.lilac),
        },
        tooltip: {
            enabled: false,
            formatter(_: any) {
                const point: any = this;
                return point.y > 0 ? `<b>${point.key} </br> ${formatNumber(true, point.y, 1)} g</b>` : `<b>${point.key} </br> ${formatNumber(true, Math.abs(
                    point.series.options?.data[point.point?.index]?.y
                ), 1)} g</b>`
            },
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
            column: {
                borderRadius: 10, // Set the radius here (adjust for your preference)
            },
            series: {
                borderRadiusTopLeft: "20%",
                borderRadiusTopRight: "20%",
                dataLabels: {
                    enabled: true,
                    inside: false,
                    y: -10,
                    align: "center",
                    verticalAlign: "bottom",
                    formatter: function (_: any) {
                        const point: any = this;
                        return `<div   class='text-center font-13' style='color:${styles.primary}'}> 
                        ${formatNumber((props?.dataytpe !== "shipments"), point.y, props?.dataytpe === "intensity" ? 1 : 2)} 
                        </br></div></div>`;
                    },
                    useHTML: true,
                    style: {
                        color: "white",
                        textOutline: false,
                    },
                },
            },
        },
        series: arrNew1,
    };
}




