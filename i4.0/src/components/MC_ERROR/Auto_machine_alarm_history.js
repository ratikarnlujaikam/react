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
import { Bar } from 'react-chartjs-2';

class Auto_machine_alarm_history extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      year: [],
      Table: [],
      EMP: [],
      report: [],
      reportGraph: [],
      xAxis: [],
      xAxis_MC: [],

      seriesY: [],
    
      seriesY_MC: [],
      seriesCleanroom: [],
      options: {},
      options_MC: {},
      chart: [],
      Table: [],
      Line: [],
      Raw_Dat: [],
      Raw_Dat: [],

      startDate: moment().add("days", -7).format("yyyy-MM-DD"),//moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      listTable: [],
      listLine: [],
      listModel: [],
      listCode: [],

      optionSelected: null,
      isDisable: false,
    };
  }

  componentDidMount = async () => {
    await this.getTable();
    await this.getLine();
  };
  doGetDataReport = async () => {
    const result = await httpClient.get(
      server.MC_ERROR_URL +
        "/" +
        this.state.Table +
        "/" +
        this.state.Line[0].label +
        "/" +
        this.state.startDate +
        "/" +
        this.state.finishDate
    );
    let xAxis = [];

    for (let index = 0; index < result.data.resultGraph.length; index++) {
      const item = result.data.resultGraph[index];
      await xAxis.push(item.Date);
    }
    let PivotTable = result.data.PivotTable;
    console.log("PivotTable",PivotTable);
    let xAxis_MC = [];

    for (let index = 0; index < result.data.resultGraph_MC.length; index++) {
      const item = result.data.resultGraph_MC[index];
      await xAxis_MC.push(item.Machine_no);
    }
    console.log("xAxis_MC",xAxis_MC);
    let PivotTable_MC = result.data.PivotTable_MC;
    console.log("PivotTable_MC",PivotTable_MC);

    let rawData = result.data.listRawData;
    console.log(rawData);
    console.log(rawData.length);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat: rawData[0] });
    console.log(this.state.Raw_Dat);

    this.setState({
      report: result.data.result,
      reportGraph: result.data.resultGraph,
      reportGraph_MC: result.data.resultGraph_MC,
      xAxis,
      xAxis_MC,

      PivotTable,
      PivotTable_MC,

      // series,

      isDisable: false,
    });
    let seriesData = [];

    for (let i = 0; i < PivotTable.length; i++) {
      const series = {
        name: PivotTable[i].name,
        type: "column",
        data: PivotTable[i].data,
      };
      seriesData.push(series);
    }
    console.log("seriesData",seriesData);
    await this.setState({

      // Existing code...
      seriesY: seriesData,
      options: {
        chart: {
          height: 350,
          type: "bar",
          stacked: true,
        },
   
        title: {
          text: "M/C error monitoring",
          align: "center",
        },
        xaxis: {
          categories: xAxis,
          text: "Dayly",
          labels: {
            style: {
              fontSize: "12px",
              fontWeight: 500,
            },
          },
        },
        yaxis: [
          {
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: "#ff1a1a",
            },
            labels: {
              style: {
                colors: "#ff1a1a",
              },
            },
            title: {
              text: "QTY",
              style: {
                color: "#ff1a1a",
              },
            },
            tooltip: {
              enabled: true,
            },
          },
        ],
        tooltip: {
          fixed: {
            enabled: true,
            position: "topLeft",
            offsetY: 30,
            offsetX: 0,
          },
        },
        legend: {
          horizontalAlign: "center",
          offsetX: 40,
        },
        fill: {
          opacity: 0.8,
        },
        colors: [
          "#1f77b4",
          "#ff7f0e",
          "#2ca02c",
          "#d62728",
          "#9467bd",
          "#8c564b",
          "#e377c2",
          "#7f7f7f",
          "#bcbd22",
          "#17becf",
          "#aec7e8",
          "#ffbb78",
          "#98df8a",
          "#ff9896",
          "#c5b0d5",
          "#c49c94",
          "#f7b6d2",
          "#c7c7c7",
          "#dbdb8d",
          "#9edae5",
          "#ff6600",
          "#339933",
          "#cc0000",
          "#993366",
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
          "#0099ff"
        ]
        ,

        stroke: {
          width: 2,
          curve: "smooth",
        },
        markers: {
          size: 4,
          strokeColors: "#fff",
          strokeWidth: 2,
          hover: {
            size: 7,
          },
        },
      },
      // Rest of the code...
    });

    let series_MC_1 = [];

    for (let i = 0; i < PivotTable_MC.length; i++) {
      const series_MC = {
        name: PivotTable_MC[i].name,
        type: "column",
        data: PivotTable_MC[i].data,
      };
      series_MC_1.push(series_MC);
    }
    console.log("series_MC",series_MC_1);
    
    await this.setState({
      // Existing code...
      seriesY_MC: series_MC_1,
      options_MC: {
        chart: {
          height: 350,
          type: "bar",
          stacked: true,
        },
   
        title: {
          text: "M/C error monitoring",
          align: "center",
        },
        xaxis: {
          categories: xAxis_MC,
          text: "Dayly",
          labels: {
            style: {
              fontSize: "12px",
              fontWeight: 500,
            },
          },
        },
        yaxis: [
          {
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: "#ff1a1a",
            },
            labels: {
              style: {
                colors: "#ff1a1a",
              },
            },
            title: {
              text: "QTY",
              style: {
                color: "#ff1a1a",
              },
            },
            tooltip: {
              enabled: true,
            },
          },
        ],
        tooltip: {
          fixed: {
            enabled: true,
            position: "topLeft",
            offsetY: 30,
            offsetX: 0,
          },
        },
        legend: {
          horizontalAlign: "center",
          offsetX: 40,
        },
        fill: {
          opacity: 0.8,
        },
        colors: [
          "#1f77b4",
          "#ff7f0e",
          "#2ca02c",
          "#d62728",
          "#9467bd",
          "#8c564b",
          "#e377c2",
          "#7f7f7f",
          "#bcbd22",
          "#17becf",
          "#aec7e8",
          "#ffbb78",
          "#98df8a",
          "#ff9896",
          "#c5b0d5",
          "#c49c94",
          "#f7b6d2",
          "#c7c7c7",
          "#dbdb8d",
          "#9edae5",
          "#ff6600",
          "#339933",
          "#cc0000",
          "#993366",
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
          "#0099ff"
        ]
        ,

        stroke: {
          width: 2,
          curve: "smooth",
        },
        markers: {
          size: 4,
          strokeColors: "#fff",
          strokeWidth: 2,
          hover: {
            size: 7,
          },
        },
      },
      // Rest of the code...
    });
  };

  getTable = async () => {
    const array = await httpClient.get(server.ERRORTable_URL);
    const options = array.data.result.map((d) => ({
      label: d.Table,
    }));
    this.setState({ listTable: options });
  };

  getLine = async () => {
    const array = await httpClient.get(
      server.MC_ERROR_Line_URL + "/" + this.state.Table
    );
    const options = array.data.result.map((d) => ({
      label: d.Line,
    }));
    this.setState({ listLine: options });
  };

  render() {
    console.log(this.state.xAxis);
    console.log(this.state.PivotTable);
    console.log(this.state.report);

    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Daily Auto machine alarm history</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active"> Daily Auto machine alarm history</li>
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
                    {/* //Select Critiria "Model" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <div></div>
                        <label>Table</label>
                        <Select
                          options={this.state.listTable}
                          onChange={async (e) => {
                            await this.setState({ Table: e.label });
                            await this.getLine();
                            await this.setState({
                              Line: [
                                { label: "Select Line_No" },
                              ],
                            });
                          }}
                          
                          // type="text"
                          // className="form-control"
                          placeholder="Select Table"
                        />
                      </div>
                    </div>

                    {/* //Select Critiria "Type" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Line_No</label>
                        <Select
                          options={this.state.listLine}
                          value={this.state.Line[0]}
                          onChange={async (e) => {
                            await this.setState({ Line: [] });
                            this.state.Line.push({ label: e.label });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Line_No"
                        />
                      </div>
                    </div>

                    {/* //Select Start Date */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>By Daily Select From &nbsp;</label>
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

                    {/* //Select Finish Date */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>To</label>
                        <input
                          value={this.state.finishDate}
                          onChange={(e) => {
                            this.setState({ finishDate: e.target.value });
                          }}
                          type="date"
                          className="form-control"
                          placeholder="Select Finish Date"
                        />
                      </div>
                    </div>
                    {/* //Select Critiria "Code"
                         <div className="col-md-2">
                      <div className="form-group">
                        <label>Code</label>
                        <Select
                          options={this.state.listCode}
                          value={this.state.Code[0]}
                          onChange={async (e) => {
                            await this.setState({ Code: [] });
                            this.state.Code.push({ label: e.label });
                     
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select Code"
                        />
                      </div>
                    </div> */}

                    {/* Submit button */}
                    <div className="col-md-1">
                      <button
                        disabled={this.state.isDisable}
                        // type="button"
                        // className="btn btn-info btn-flat"
                        onClick={async (e) => {
                          this.setState({ isDisable: true });
                          // this.doGetDataReport();
                          Swal.fire({
                            icon: "info",
                            title: "Loading Data",
                            timer: 60000,
                            allowOutsideClick: false,
                            didOpen: async () => {
                              Swal.showLoading();
                              try {
                                await this.doGetDataReport();
                                Swal.close();
                                if (
                                  this.state.reportGraph &&
                                  Array.isArray(this.state.reportGraph) &&
                                  this.state.reportGraph.length > 0
                                ) {
                                  if (
                                    this.state.reportGraph[0] &&
                                    Array.isArray(this.state.reportGraph[0]) &&
                                    this.state.reportGraph[0].length > 0
                                  ) {
                                    Swal.fire({
                                      icon: "success",
                                      title: "Success",
                                      text: "Data has been loaded successfully",
                                    });
                                  } else if (
                                    this.state.reportGraph[0] &&
                                    Array.isArray(this.state.reportGraph[0]) &&
                                    this.state.reportGraph[0].length === null
                                  ) {
                                    Swal.fire({
                                      icon: "error",
                                      title: "No production data",
                                      text: "Please select another date",
                                    });
                                  }
                                } else {
                                  Swal.fire({
                                    icon: "error",
                                    title: "Data loading encountered an error, please try again",
                                  }).then(() => {
                                    // รีเฟรชหน้าใหม่
                                    window.location.reload();
                                  });
                                }
                              } catch (error) {
                                Swal.fire({
                                  icon: "error",
                                  title: "No production data",
                                  text: "Please select another date", // แสดงข้อความของ error เป็นข้อความใน Swal
                                }).then(() => {
                                  // รีเฟรชหน้าใหม่
                                  window.location.reload();
                                });
                              }
                            },
                          });
                        }}
                        
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginTop: 30 }}
                      >
                        Submit
                      </button>
                    </div>
                    <div className="col-md-2">
                      <CSVLink
                        data={this.state.Raw_Dat}
                        filename={"report.csv"}
                      >
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ marginTop: 30 }}
                        >
                          Download
                        </button>
                      </CSVLink>
                    </div>
                  </div>
                </div>
              </div>
              <div class="content">
                <div class="container-fluid">
                  <div className="row">
                    <div className="col-12">
                      <div className="card card-primary card-outline">
                        {/* Chart Title */}
                        <div className="card-header">
                          <h3 className="card-title">
                            <i className="far fa-chart-bar" />
                            
                          </h3>
                        </div>

                        {/* Insert Xbar Chart */}
                        <div className="row" style={{ width: "100%" }}>
                          <div style={{ width: "1%" }}></div>
                          <div
                            className="card card-warning"
                            style={{ width: "99%" }}
                          >
                            <div className="card-body">
                              <div className="row">
                                <div style={{ width: "100%" }}>
                                  <ReactApexChart
                                    options={this.state.options}
                                    series={this.state.seriesY}
                                    type="bar"
                                    height={450}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="content">
                <div class="container-fluid">
                  <div className="row">
                    <div className="col-12">
                      <div className="card card-primary card-outline">
                        {/* Chart Title */}
                        <div className="card-header">
                          <h3 className="card-title">
                            <i className="far fa-chart-bar" />
                            
                          </h3>
                        </div>

                        {/* Insert Xbar Chart */}
                        <div className="row" style={{ width: "100%" }}>
                          <div style={{ width: "1%" }}></div>
                          <div
                            className="card card-warning"
                            style={{ width: "99%" }}
                          >
                            <div className="card-body">
                              <div className="row">
                                <div style={{ width: "100%" }}>
                                  <ReactApexChart
                                    options={this.state.options_MC}
                                    series={this.state.seriesY_MC}
                                    type="bar"
                                    height={450}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
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

export default Auto_machine_alarm_history;
