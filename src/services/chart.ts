import { ChartJSNodeCanvas } from "chartjs-node-canvas";
 
export class ChartService {
  public chartJSNodeCanvas: ChartJSNodeCanvas;
 
  constructor(width: number, height: number) {
    // Initialize ChartJSNodeCanvas with width and height
    this.chartJSNodeCanvas = new ChartJSNodeCanvas({
      width,
      height,
      chartCallback: (ChartJS) => {
        // Register all necessary components of Chart.js v4
        // ChartJS.register(...registerables);
      },
    });
  }
 
  /**
   * Generates a line chart as a PNG image buffer.
   * @param labels - Array of labels for the x-axis.
   * @param data - Array of data points for the chart.
   * @param title - Title of the chart.
   * @returns Buffer containing the PNG image of the chart.
   */
  public async generateLineChart(
    labels: string[],
    data: number[],
    title: string = "Dynamic Line Chart"
  ): Promise<Buffer> {
    const configuration: any = {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: title,
            data,
            borderColor: "rgb(141, 207, 207)",
            backgroundColor: "rgba(21, 243, 243, 0.2)",
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: title,
          },
        },
      },
    };
 
    return this.chartJSNodeCanvas.renderToBuffer(configuration);
  }
 
  /**
   * Generates a bar chart as a PNG image buffer.
   * @param labels - Array of labels for the x-axis.
   * @param datasets - Array of datasets for the chart.
   * @param title - Title of the chart.
   * @returns Buffer containing the PNG image of the chart.
   */
  public async generateBarChart(
    labels: string[],
    datasets: { label: string; data: number[]; backgroundColor: string }[],
    title: string = "Dynamic Bar Chart",
    xAxisLabel: string = "Periods/Weeks",
    yAxisLabel: string = "Emissions Intensity (gCO2e/Ton-Mile)"
  ): Promise<Buffer> {
    if (!Array.isArray(labels) || !Array.isArray(datasets)) {
      throw new Error("Invalid input: labels and datasets must be arrays");
    }
  
    const configuration: any = {
      type: "bar",
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: {
              font: {
                size: 10,
              },
              padding: 8,
              usePointStyle: true, 
               pointStyle: "rectRounded"
            },
          },
          title: {
            display: true,
            text: title,
            font: {
              size: 26,
              weight: "bold",
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          x: {
            axis : {display : false},
            stacked: false,
            title: {
              display: true,
              text: xAxisLabel, // Dynamically set X-axis label
              font: {
                size: 12,
              },
            },
            grid:{
              display : false
            }
          },
          y: { 
            axis : {display : false},
            stacked: false,
            beginAtZero: true,
            title: {
              display: true,
              text: yAxisLabel, // Dynamically set Y-axis label
              font: {
                size: 12,
              },
            },
          },
        },
      },
    };
  
    try {
      return await this.chartJSNodeCanvas.renderToBuffer(configuration);
    } catch (error) {
      console.error("Error generating bar chart:", error);
      throw new Error("Failed to generate bar chart");
    }
  }
  
}