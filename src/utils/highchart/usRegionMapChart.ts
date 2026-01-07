
import mapDataIE from "@highcharts/map-collection/countries/us/us-all.geo.json";
import Highcharts from "highcharts";
import Boost from "highcharts/modules/boost";
import highcharts3d from "highcharts/highcharts-3d";
import highchartsMap from "highcharts/modules/map";
import { getEmissionDetail, getEmissionDetailId, getImageUrl, getRegionNameDetail } from "utils";
import styles from '../../scss/config/_variable.module.scss'
Boost(Highcharts);
highcharts3d(Highcharts);
highchartsMap(Highcharts);
export const UsaRegionHighChart = (props: any) => {
    let data = []
    for (let i in mapDataIE["features"]) {
        let mapInfo = mapDataIE["features"][i];
        if (mapInfo["id"]) {
            let postalCode = mapInfo.properties["postal-code"];

            let name = mapInfo["properties"]["name"];
            let value = (Number(i) % 2) + 1;
            let row = i;
            data.push({
                value: 1,
                name: name,
                "postal-code": postalCode,
                row: row,
                type: "",
                showLabel: value,
                region: mapInfo?.properties['region'],
                color: (styles.light)
            });
        }
    }

    return {
        credits: false,
        title: {
            text: "",
        },
        chart: {
            backgroundColor: "transparent",
            type: "map",
            map: mapDataIE,
            color: (styles.light),
        },
        mapNavigation: {
            enabled: false,
            enableButtons: false,
            buttonOptions: {
                enabled: false
            }
        },

        exporting: {
            enabled: false,
        },

        plotOptions: {
            mappoint: {
                keys: ['id', 'lat', 'lon', 'name', 'y'],
                marker: {
                    lineWidth: 1,
                    lineColor: (styles.black),
                    symbol: 'mapmarker',
                    radius: 8
                },
                dataLabels: {
                    enabled: false
                }
            }
        },
        colorAxis: {
            enabled: false,
            dataClasses: [
                {
                    from: 1,
                    color: (styles.light),
                },
                {
                    from: 2,
                    color: (styles.fountainBlue),
                }
            ]
        },
        tooltip: {
            enabled: true,

            useHTML: true,
            formatter: function (this: any) {
                return `<div class="d-flex flex-column gap-3 index-wrapper"> 
                <div class="d-flex gap-3 align-items-center highIndex"> <h5 class="mb-0">Region: <span>${getRegionNameDetail(props?.dto, this.point['postal-code'], 'region_name')}</span></h5> </div>
                
                <div class="d-flex gap-2 align-items-center highIndex"> <img src="${getImageUrl("/images/highIndex.svg")}"/><h5 class="mb-0">Emissions Index: <span>${getEmissionDetail(props?.dto, this.point['postal-code'], 'emission_index')}</span></h5> </div>
                <div class="d-flex gap-2 align-items-center lowIndex"> <img src="${getImageUrl("/images/lowIndex.svg")}"/><h5 class="mb-0">Intermodal Index: <span>${getEmissionDetail(props?.dto, this.point['postal-code'], 'intermodal_index')}</span></h5> </div>
                <div class="d-flex gap-2 align-items-center lowIndex"> <img src="${getImageUrl("/images/upIndex.svg")}"/><h5 class="mb-0">Alternative Fuel Index: <span>${getEmissionDetail(props?.dto, this.point['postal-code'], 'alternative_fuel_index')}</span></h5> </div>
 
                 </div>`;
            },

        },
        legend: {
            enabled: false,
            align: "right",
            verticalAlign: "top",
            x: -100,
            y: 70,
            floating: true,
            layout: "vertical",
            valueDecimals: 0,
            backgroundColor:
                Highcharts.defaultOptions?.legend?.backgroundColor || "rgba(255, 255, 255, 0.85)"
        },
        series: [
            {
                name: "map",
                borderColor: 'white',
                dataLabels: {
                    enabled: true,
                    color: (styles.white),
                    useHTML: true,

                    // format: "{point.postal-code}",
                    formatter: function () {
                        return ''
                        // return `${this.point.options['postal-code']}`
                        // return this.point.options.showLabel ? `<img src="${this.point.options.showLabel === 1 ? redPin : grayPin}"/> <br> ${this.point.options['postal-code']}}` : `${this.point.options['postal-code']}`;
                    },
                    style: {
                        textTransform: "uppercase"
                    }
                },
                states: {
                    hover: {
                        formatter: function () {
                            return ``;
                        },
                        color: (styles.primary)
                    }
                },
                tooltip: {
                    enabled: true,
                    formatter: function () {
                        return ``;
                    },
                },      
                cursor: "pointer",
                joinBy: "postal-code",
                data: data, 

                point: {
                    events: {
                        click: function (r: any) {
                            props.navigate(`/scope3/benchmarks/${props.benchmarkType}/detail/${getEmissionDetailId(props?.dto, r.point.options['postal-code'], 'region')}/${props?.yearId}/${props?.quarterId}/${props?.wtwType}/${props?.boundType}`)
                        },
                        mouseOut: function (this: any, r: any) {
                            this.series.data?.forEach((i: any) => {
                                if (i?.color === (styles.primary)) {
                                    i.options.color = (styles.light)
                                    i.update(i.options)
                                }
                            })
                        },
                        mouseOver: function (this: any, r: any) {
                            // this.series.data?.forEach((i: any) => {
                            //     if (i?.color === (styles.primary)) {
                            //         i.options.color = (styles.light)
                            //         i.update(i.options)
                            //     }
                            // })
                            // // }
                            // this.series.data?.forEach((i: any) => {
                            //     if (countryCode.findIndex(res => res === i['postal-code']) !== -1) {
                            //         i.options.color = (styles.primary)
                            //         i.update(i.options)
                            //     }
                            // })
                        },

                    }
                }
            }
        ]
    };

}