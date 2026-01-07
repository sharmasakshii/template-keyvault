import styles from '../../scss/config/_variable.module.scss'

export function pieChart(props: any) {

    return {
        credits: {
            enabled: false
        },
        title: {
            style: {
                fontWeight: 'bold',
                color: (styles.primary)
            },
            text: `<div>${props?.pieChartCount}</div><br><span>Projects</span>`,
            align: 'center',
            verticalAlign: 'middle',

        },
        chart: {
            height: 300,
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },

        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        colors: [(styles.lightgreen), (styles.orange), (styles.green)],
        exporting: {
            enabled:false,
          },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                },

            }
        },
        series: [{

            type: 'pie',
            name: 'Project Overview',
            innerSize: '70%',
            data: [
                ['', 0],
                ['', 0],
                ['', 99.90],

            ]
        }]
    }
}