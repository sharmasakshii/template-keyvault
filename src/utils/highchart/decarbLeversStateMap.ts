import { priorityColors } from 'utils';
import usaMap from "@highcharts/map-collection/countries/us/us-all.geo.json";
type Point = {
  "hc-key": string;
};
export const decarbLeversStateMap = (props: any) => {
    const { formattedData, navigate, boundType } = props
    return {
        chart: { map: usaMap },
        title: { text: "" },
        exporting: { enabled: false },

        legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: "bottom",
            itemStyle: { fontSize: "14px" },
            symbolRadius: 2,
            enabled: false,
        },

        colorAxis: {
            dataClasses: [
                { from: 0, to: 0, color: priorityColors.low, name: "Low Priority" },
                {
                    from: 1,
                    to: 1,
                    color: priorityColors.medium,
                    name: "Medium Priority",
                },
                { from: 2, to: 2, color: priorityColors.high, name: "High Priority" },
                { from: 3, to: 3, color: "#D1D5DB", name: "NA" },
            ],
        },

        credits: { enabled: false },

        series: [
            {
                type: "map",
                name: "States",
                data: formattedData,
                joinBy: "hc-key",
                colorKey: "color",
                nullColor: "#E5E7EB",
                states: { hover: { color: "#5f9a80" } },
                borderColor: "#cacaca",
                borderWidth: 1,
                dataLabels: {
                    enabled: true,
                    formatter: function (_: any) {
                        const dto: any = this;
                        const hcKey = (dto.point as Point)["hc-key"];
                        return hcKey ? hcKey.replace("us-", "").toUpperCase() : "";
                    },
                },
                cursor: "pointer",
                tooltip: {
                    pointFormatter: function (
                        this: Highcharts.Point & { priority?: string }
                    ) {
                        const capitalizedPriority = this.priority
                            ? this.priority.charAt(0).toUpperCase() + this.priority.slice(1)
                            : "Not Assigned";

                        return `<b>${this.name}</b><br/>Priority: <b>${capitalizedPriority}</b>`;
                    },
                },
                point: {
                    events: {
                        click: function () {
                            const hcKey = (this as any)["hc-key"];
                            const stateAbbr = hcKey?.replace("us-", "").toUpperCase();

                            const priority = (this as any).priority ?? "NA";

                            navigate(
                                {
                                    pathname: `/scope3/decarb-problem-lanes/${stateAbbr}`,
                                    search: new URLSearchParams({
                                        priority,
                                        boundType
                                    }).toString(),
                                },
                            );
                        },
                    },
                },
            },
        ],
    };
}