import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import Chart from "react-apexcharts";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import ReactDOM from "react-dom";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
//npm install @mui/material @emotion/react @emotion/styled

class Monthly_LAR_report_all_Model extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      year: [],
      Month: [],
      process: [],
      report: [],
      xAxis: [],
      yAxis1: [],
      seriesY: [],
      series2: [],
      series_: [],
      seriesCleanroom: [],
      options: {},
      options_pp: {},
      options2: {},
      chart: [],
      rawData: [],

      Raw_Dat: [],
      yAxisIndex: [],

      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      listyear: [],
      listMonth: [],
      listModel: [],

      listYear: [],
      listMonth: [],
      listprocess: [],
      selectedMaxYear: "",
      selectedMaxMonth: "",

      optionSelected: null,
      isDisable: false,
      countdownEnabled: false, // เพิ่ม state สำหรับการเปิด/ปิด countdown
      intervalId: null, // เพิ่ม state สำหรับเก็บ ID ของ interval
      countdownTime: 150, // 5 นาทีในวินาที
    };
  }

  componentDidMount = async () => {
    await this.getyear();
    await this.getprocess();
    this.setState({ countdownEnabled: false });
  };
  doGetDataReport = async () => {
    const result = await httpClient.get(
      server.Compare_Output_URL +
        "/" +
        this.state.year +
        "/" +
        this.state.startDate
    );

    let xAxis = [];

    for (let index = 0; index < result.data.resultGraph.length; index++) {
      const item = result.data.resultGraph[index];
      await xAxis.push(item.Hour);
    }

    let PivotTable = result.data.PivotTable;
    console.log(PivotTable);

    this.setState({
      report: result.data.result,
      xAxis,
      isDisable: false,
    });

    let seriesData = [];

    for (let i = 0; i < PivotTable.length; i++) {
      const series = {
        name: PivotTable[i].name,
        type:
          PivotTable[i].name === "Output" || PivotTable[i].name === "Target"
            ? "line"
            : "column",
        data: PivotTable[i].data,
      };
      seriesData.push(series);
    }

    // Now seriesData contains objects with modified types
    console.log(seriesData);
    let columnSeries = seriesData.filter((series) => series.type === "column");
    let lineSeries = seriesData.filter((series) => series.type === "line");

    // Now columnSeries contains objects with type 'column' and lineSeries contains objects with type 'line'
    console.log(columnSeries);
    console.log(lineSeries);

    const sortedData = seriesData.sort((a, b) => {
      // Move items with type 'line' to the end
      if (a.type === "line" && b.type !== "line") {
        return 1;
      } else if (a.type !== "line" && b.type === "line") {
        return -1;
      } else {
        return 0;
      }
    });

    console.log(sortedData);

    const mappedSeriesNames = sortedData.map((item) => item.name);

    console.log(mappedSeriesNames[0]);

    // Assuming your array is named dataSeries
    const maxValues = sortedData.map((series) => Math.max(...series.data));

    // The maximum value among all data arrays
    const globalMaxValue = Math.max(...maxValues) + 200;

    console.log(globalMaxValue);

    const X_left = Math.max(...maxValues) /2;
    console.log(X_left);

    // Assuming mappedSeriesNames[0] is the series name you want to use
    const seriesName = mappedSeriesNames[0];
    console.log(seriesName);

    await this.setState({
      options: {
        chart: {
          height: 350,
          type: "line",
          stacked: true,
          marginLeft: 0,
        },

        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "60%",
            endingShape: "rounded",
            borderWidth: 1,
            borderColor: "#000000",
            dataLabels: {
              position: "center", // Change this line to "center" or "insideEnd"
              offsetY: 1,
            },
          },
        },
        tooltip: {
          fixed: {
            enabled: false,
          },
          followCursor: false,
        },

        dataLabels: {
          enabled: true,
          offsetX: 0,
          offsetY: 0,
          style: {
            fontSize: "13px",
            color: "#000000", // Set the color to black
          },
          formatter: function (val) {
            return Number(val).toLocaleString();
          },
        },

        title: {
          text: `Compare Output & Ng With Target${this.state.year}`,
          align: "center",
          offsetX: 0,
        },
        xaxis: {
          categories: xAxis,
        },

        yaxis: [
          {
            seriesName: seriesName,
            min: 0,
            
            axisTicks: {
              show: true,
            },

            axisBorder: {
              show: true,
              color: "#d62728",
            },
            labels: {
              style: {
                colors: "#d62728",
              },
              formatter: function (val) {
                return Number(val).toLocaleString();
              },
            },
            title: {
              text: "QTY",
              style: {
                color: "#d62728",
              },
            },

            tooltip: {
              enabled: true,
            },
            yAxisIndex: 0,
          },

          {
            seriesName: seriesName,
            min: 0,
            

            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              style: {
                colors: "#3399ff",
              },
              formatter: function (val) {
                return Number(val).toLocaleString();
              },
            },
            yAxisIndex: 0,
            grouping: true, // Group the y-axis
          },

          {
            seriesName: seriesName,
            min: 0,
            

            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              style: {
                colors: "#3399ff",
              },
            },
            yAxisIndex: 0,
            grouping: true, // Group the y-axis
          },

          {
            seriesName: seriesName,
            min: 0,
            

            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              style: {
                colors: "#3399ff",
              },
            },
            yAxisIndex: 0,
            grouping: true, // Group the y-axis
          },

          {
            seriesName: seriesName,
            min: 0,
            

            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              style: {
                colors: "#3399ff",
              },
            },
            yAxisIndex: 0,
            grouping: true, // Group the y-axis
          },

          {
            seriesName: seriesName,
            min: 0,
            

            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              style: {
                colors: "#3399ff",
              },
            },
            yAxisIndex: 0,
            grouping: true, // Group the y-axis
          },

          {
            seriesName: seriesName,
            min: 0,
            

            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              style: {
                colors: "#3399ff",
              },
            },
            yAxisIndex: 0,
            grouping: true, // Group the y-axis
          },

          {
            seriesName: seriesName,
            min: 0,
            

            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              style: {
                colors: "#3399ff",
              },
            },
            yAxisIndex: 0,
            grouping: true, // Group the y-axis
          },

          {
            seriesName: seriesName,
            min: 0,
            

            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              style: {
                colors: "#3399ff",
              },
            },
            yAxisIndex: 0,
            grouping: true, // Group the y-axis
          },

          {
            seriesName: seriesName,
            min: 0,
            

            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              style: {
                colors: "#3399ff",
              },
            },
            yAxisIndex: 0,
            grouping: true, // Group the y-axis
          },

          {
            seriesName: seriesName,
            min: 0,
            

            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              style: {
                colors: "#3399ff",
              },
            },
            yAxisIndex: 0,
            grouping: true, // Group the y-axis
          },

          {
            seriesName: seriesName,
            min: 0,
            

            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              style: {
                colors: "#3399ff",
              },
            },
            yAxisIndex: 0,
            grouping: true, // Group the y-axis
          },

          {
            seriesName: "Income",
            min: 0,
            max: globalMaxValue,
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: "#1f77b4",
            },
            labels: {
              style: {
                colors: "#1f77b4",
              },
            },
            
            title: {
              text: "Qty(Output & Target)",
              style: {
                color: "#1f77b4",
              },
            },
            yAxisIndex: 1,
            grouping: true, // Group the y-axis
          },
          {
            seriesName: "Output",
            min: 0,
            max: globalMaxValue,
            axisTicks: {
              show: false,
            },
            labels: {
              show: false,
              style: {
                colors: "#000000",
              },
            },
            yAxisIndex: 1,
            grouping: true, // Group the y-axis
          },
        ],

        colors: [
          "#993366",
          "#ff7f0e",
          "#2ca02c",
          "#d62728",
          "#9467bd",
          "#c49c94",
          "#e377c2",
          "#7f7f7f",
          "#bcbd22",
          "#17becf",
          "#aec7e8",
          "#ffbb78",
          "#339933",
          "#1f77b4",
          "#c5b0d5",
          "#c49c94",
          "#f7b6d2",
          "#c7c7c7",
          "#dbdb8d",
          "#9edae5",
          "#ff6600",
          "#339933",
          "#cc0000",

          "#663300",
          "#ff66cc",
          "#666666",
          "#cccc00",
          "#00ccff",
          "#ff3300",
          "#66ff66",
          "#990000",
          "#996699",
          "#996633",
          "#ff99cc",
          "#999999",
          "#ffff00",
          "#0099ff",
        ],
        fill: {
          opacity: 1,
        },

        tooltip: {
          fixed: {
            enabled: false, // ตั้งค่า fixed ให้เป็น false
          },
          followCursor: true, // เปิดใช้งาน followCursor เพื่อให้ tooltip ตามตำแหน่งของเมาส์
          offsetY: 20,
          offsetX: 30,
        },

        legend: {
          position: "bottom", // เลือกตำแหน่งของ legend
          horizontalAlign: "center", // เลือกการจัดวางแนวนอน
          offsetY: 10, // ปรับตำแหน่งของ legend ในแนวดิ่ง
          markers: {
            width: 12,
            height: 12,
            radius: 4,
          },
          itemMargin: {
            horizontal: 10, // ระยะห่างระหว่างรายการของ legend ในแนวนอน
            vertical: 5, // ระยะห่างระหว่างรายการของ legend ในแนวดิ่ง
          },
        },
        

        stroke: {
          width: 5,
          curve: "smooth",
        },
        markers: {
          size: 5,
          strokeColors: "#7f7f7f",
          strokeWidth: 2,
          hover: {
            size: 7,
          },
        },
        className: "apexcharts-bar-area", // เพิ่มคลาส CSS ที่คุณต้องการใช้งาน
      },

      seriesY: sortedData,
    });
    this.setState({
      options: {
        ...this.state.options,
        chart: {
          ...this.state.options.chart,
          type: "bar", // Change the type to bar or any other supported type
        },
      },
    });
  };

  getMaxValue = (options) => {
    let max = -Infinity;
    let maxOption = null;

    for (const option of options) {
      const value = parseFloat(option.label);
      if (!isNaN(value) && value > max) {
        max = value;
        maxOption = option;
      }
    }

    return maxOption;
  };

  getyear = async () => {
    const array = await httpClient.get(server.Compare_Output_Line_URL);
    const options = array.data.result.map((d) => ({
      label: d.year,
    }));
    this.setState({ listyear: options });
  };

  getprocess = async () => {
    const array = await httpClient.get(server.Compare_Output_process_URL);
    const options = array.data.result.map((d) => ({
      label: d.process,
    }));
    this.setState({ listprocess: options });
  };

  stopInterval() {
    clearInterval(this.intervalId);
  }

  // ฟังก์ชันเพื่อ refreath
  handleRefresh = () => {
    // สร้าง Date ใหม่
    const currentDate = new Date();

    // ทำการ setState ให้ this.state.startDate เป็นวันปัจจุบัน
    this.setState(
      { startDate: currentDate.toISOString().split("T")[0] },
      () => {
        // เรียกฟังก์ชันที่ต้องการทำหลังจาก setState เสร็จสิ้น
        this.doGetDataReport();
      }
    );
  };

  // ฟังก์ชันที่เรียกเมื่อต้องการ refreath

  startInterval() {
    this.intervalId = setInterval(() => {
      this.setState((prevState) => ({
        countdownTime: prevState.countdownTime - 1,
      }));

      if (this.state.countdownTime <= 0) {
        // เมื่อเวลาครบถ้วน, ให้ทำการ Summit ข้อมูล
        this.handleRefresh();
        // และรีเซ็ตเวลานับถอยหลังเป็น 5 นาทีใหม่
        this.setState({ countdownTime: 300 }); // 5 นาทีในวินาที
      }
    }, 1000); // 1 วินาที
  }

  stopInterval() {
    clearInterval(this.intervalId);
  }

  render() {
    console.log(this.state.process);

    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 10 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  {/* <h1>Monthly LAR report all Model</h1> */}
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                      {/* Monthly LAR report all Model */}
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title">
                    <label>Select Parameter</label>
                  </h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Line&Model</label>
                        <Select
                          options={this.state.listyear}
                          onChange={async (e) => {
                            await this.setState({ year: e.label });
                          }}
                          placeholder="Select Line&Model"
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Select Date&nbsp;</label>
                        <input
                          value={this.state.startDate}
                          onChange={(e) => {
                            this.setState({ startDate: e.target.value });
                          }}
                          type="date"
                          className="form-control"
                          placeholder="Select Start Date"
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <button
                        disabled={this.state.isDisable}
                        onClick={async (e) => {
                          this.setState({ isDisable: true });
                          Swal.fire({
                            icon: "info",
                            title: "Loading Data",
                            timer: 60000,
                            allowOutsideClick: false,
                            didOpen: async () => {
                              Swal.showLoading();
                              await this.doGetDataReport();
                              Swal.close();
                            },
                          }).then(() => {
                            // Rest of your code...
                          });
                        }}
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginTop: 30 }}
                      >
                        Submit
                      </button>
                    </div>

                    <input
                      type="checkbox"
                      checked={this.state.countdownEnabled}
                      onChange={(e) => {
                        this.setState(
                          { countdownEnabled: e.target.checked },
                          () => {
                            if (this.state.countdownEnabled) {
                              this.startInterval();
                              // Set the startDate to the current date
                              const currentDate = new Date()
                                .toISOString()
                                .split("T")[0];
                              this.setState({ startDate: currentDate });
                            } else {
                              this.stopInterval();
                            }
                          }
                        );
                      }}
                    />
                    <label>Lock Line</label>
                    {this.state.countdownEnabled && (
                      <div className="time-box">
                        {Math.floor(this.state.countdownTime / 60)} :{" "}
                        {this.state.countdownTime % 60}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  {/* Insert Xbar Chart */}
                  <div className="row" style={{ width: "100%" }}>
                    <div style={{ width: "2%" }}></div>
                    <div
                      className="card card-warning"
                      style={{ width: "100%" }}
                    >
                      <div className="row">
                        <div
                          style={{
                            width: "100%",
                            backgroundColor: "#FFFFE0", // Very light blue

                            border: "1px solid #000000", // Black border color
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <ReactApexChart
                            options={this.state.options}
                            series={this.state.seriesY}
                            type="line"
                            height={550}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Monthly_LAR_report_all_Model;
