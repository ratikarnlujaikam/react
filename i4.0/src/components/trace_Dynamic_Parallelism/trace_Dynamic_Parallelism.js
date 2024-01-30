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

class Trace_Dynamic_Parallelism extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      model: { label: "**ALL**" },
      Line: [],
      ItemNo: [{ label: "**ALL**" }],
      report: [],
      reportGraph: [],
      xAxis: [],
      yAxis1: [],
      seriesY: [],
      series2: [],
      seriesCleanroom: [],
      options: {},
      options2: {},
      chart: [],

      Raw_Dat: [],

      startDate: moment().format("YYYY-MM-DD HH:mm:00"),
      finishDate: moment().format("YYYY-MM-DD HH:mm:00"),
      listItemNo: [],
      listModelName: [],
      listmodel: [],
      listLine: [],
      headers: [],

      optionSelected: null,
      isDisable: false,
    };
  }

  componentDidMount = async () => {
    await this.getLine();
  };

  
  doGetDataReport = async () => {
    try {
      const formattedStartDate = this.state.startDate ? this.state.startDate.replace("T", " ") : '';
      const formattedFinishDate = this.state.finishDate ? this.state.finishDate.replace("T", " ") : '';
      const result = await httpClient.get(
        server.Trace_Dynamic_URL +
          "/" +
          this.state.Line.label +
          "/" +
          formattedStartDate +
          "/" +
          formattedFinishDate
      );
  
      console.log("result", result);
  
      // Check if result.data is defined and it has the expected structure
      if (result.data && result.data.listRawData && result.data.result) {
        const headers = Object.keys(result.data.listRawData[0][0]);
        console.log(headers);
  
        let rawData = result.data.listRawData;
        console.log(rawData);
  
        // Ensure each item in rawData has the same structure
        rawData = rawData.map((item) =>
          headers.reduce((acc, header) => {
            acc[header] = item[header] || null;
            return acc;
          }, {})
        );
  
        let rawData1 = result.data.listRawData;
        console.log(rawData1);
  
        // Check if rawData1 is an array with at least one element
        if (rawData1.length > 0) {
          for (let i = 1; i < rawData1.length; i++) {
            rawData1[0].push(...rawData1[i]);
          }
          this.setState({ Raw_Dat: rawData1[0] });
          console.log(this.state.Raw_Dat);
  
          this.setState({
            report: result.data.result,
            headers: headers,
            isDisable: false,
          });
        } else {
          console.error("rawData1 is an empty array.");
        }
      } else {
        console.error("Invalid data structure in the API response.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  

  getLine = async () => {
    const array = await httpClient.get(server.LINE_TRACE_DYNAMIC_URL);
    const options = array.data.result.map((d) => ({
      label: d.Line,
    }));
    this.setState({ listLine: options });
  };


  renderreport1() {
    return this.state.report.map((row, rowIndex) => (
      <tr key={rowIndex} align="center">
        {this.state.headers.map((header, colIndex) => (
          <td key={colIndex}>{row[header]}</td>
        ))}
      </tr>
    ));
  }


  render() {
    console.log("LINE", this.state.Line);

    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Trace back Dynamic</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                    Trace back Dynamic
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
                    <label>Trace back Dynamic</label>
                  </h3>
                </div>

                <div className="card-body">
                  <div className="row">
                    {/* //Select Critiria "model" */}
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Line </label>
                        <Select
                          options={this.state.listLine}
                          value={this.state.Line}
                          onChange={async (e) => {
                            await this.setState({ Line: e });
                          }}
                          // type="text"
                          // className="form-control"
                          placeholder="Select line"
                        />
                      </div>
                    </div>

                    <div className="col-sm-2">
                      <div className="form-group">
                        <label>Select Datetime &nbsp;</label>
                        <input
                          value={this.state.startDate}
                          onChange={(e) => {
                            this.setState({ startDate: e.target.value });
                          }}
                          type="datetime-local" // Use datetime-local for both date and time
                          className="form-control"
                          placeholder="Select Start Date and Time"
                        />
                      </div>
                    </div>

                    {/* Select Finish Date */}
                    <div className="col-sm-2">
                      <div className="form-group">
                        <label>To</label>
                        <input
                          value={this.state.finishDate}
                          onChange={(e) => {
                            this.setState({ finishDate: e.target.value });
                          }}
                          type="datetime-local"
                          className="form-control"
                          placeholder="Select Finish Date"
                          // Disable the input if confirm is 'OK'
                        />
                      </div>
                    </div>

                    {/* Submit button */}
                    <div className="col-md-1">
                      <button
                        disabled={this.state.isDisable}
                        // type="button"
                        // className="btn btn-info btn-flat"
                        onClick={(e) => {
                          this.setState({ isDisable: true });
                          // this.doGetDataReport();
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
                            if (this.state.report.length > 0) {
                              if (this.state.report[0].Model.length > 0) {
                                Swal.fire({
                                  icon: "success",
                                  title: "Success",
                                  text: "Data has been loaded successfully",
                                });
                              } else if (
                                this.state.report[0].Model.length == 0
                              ) {
                                Swal.fire({
                                  icon: "error",
                                  title: "No production data",
                                  text: "Please select other date",
                                });
                              }
                            
                            } else {
                              Swal.fire({
                                icon: "error",
                                title:
                                  "Data loading has encountered some error, please try again",
                                  
                                }).then(() => {
                                  // รีเฟรชหน้าใหม่
                                  window.location.reload();
                                });
                              
                            }
                        
                          });
                        }}
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginTop: 30 }}
                      >
                        Submit
                      </button>
                    </div>
                    <div className="col-md-1">
                      
                      <CSVLink
                      
                        data={this.state.Raw_Dat.map(item => {
                          const modifiedItem = {};
                          
                          for (const key in item) {
                            if (Object.prototype.hasOwnProperty.call(item, key)) {
                              modifiedItem[key] = key === 'Line' ? "L" + String(item[key]) : String(item[key]);
                            }
                          }
                          
                          return modifiedItem;
                        })}
           

                        filename={
                          "Trace_back_" +
                          this.state.startDate +
                          "to" +
                          this.state.startDate +
                          ".csv"
                        }
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
                    <div className="col-md-2">
                      <a
                        style={{ marginTop: 30 }}
                        href="/Home"
                        class="btn btn-primary"
                        role="button"
                        aria-pressed="true"
                      >
                        Back
                      </a>
                    </div>
                  </div>
                </div>
              </div>
        
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Trace_Dynamic_Parallelism;
