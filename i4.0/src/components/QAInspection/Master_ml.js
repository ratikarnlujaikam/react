import React, { Component } from "react";
import { key, server, YES } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import Chart from "react-apexcharts";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";

class Master_ml extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      model: [],
      Parameter: [],
      report: [],
      QANumber: "",
      report2: [],
      id: [],
      Raw_Dat2: [],

      Raw_Dat: [],

      startDate: moment().format("yyyy-MM-DD"), //moment().add("days", -6).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),

      listModel: [],
      listParameter: [],
      report: [], // Initialize with your data
      optionSelected: null,
      isDisable: false,

      empNumber: "",
      password: "",
      pwType: "password",
      pwIcon: "fas fa-eye",
      showHourly: false,
      show: false,
      isLoggedIn: false, // Add this state variable
      report: [], // Add a sample empty report, you may initialize it as needed
      editingItemId: null, // Add other necessary state variables
    };
  }

  componentDidMount = async () => {
    await this.getModel();
    await this.getParameter();
  };

  // report with select model,date,type
  doGetDataReport = async () => {
    // Check if the model label is "**ALL**" and set it to an empty string if true
    const modelLabel = this.state.model.label === "" ? "" : this.state.model.label;
  
    const result = await httpClient.get(
      server.REPORT_Master_ML_URL +
        "/" +
        modelLabel +
        "/" +
        this.state.Parameter[0].label
    );
  
    console.log("doGetDataReport_result", result);
    let rawData = result.data.listRawData;
    console.log(rawData);
  
    // Flatten the rawData array
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
  
    // Set Raw_Dat state with the flattened array
    this.setState({ Raw_Dat: rawData[0] });
    console.log(this.state.Raw_Dat);
  
    // Set report and isDisable states
    this.setState({
      report: result.data.result,
      isDisable: false,
    });
  };
  

  handleInputChange = (e, id, field) => {
    const { report } = this.state;
    const updatedReport = report.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: e.target.value };
      }
      return item;
    });
    this.setState({ report: updatedReport });
  };

  
  handleUpdateClick = async (id, updatedItem) => {
    try {
      // Show a confirmation dialog using Swal
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "You are about to update the data.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      });

      // If the user clicks "Yes", proceed with the update
      if (confirmResult.isConfirmed) {
        console.log("id", id);
        const empNumber = this.state.empNumber;

        // Make a GET request to retrieve the update URL
        const updateUrl = await httpClient.get(
          server.UPDATE_Master_URL +
            "/" +
            id +
            "/" +
            updatedItem.Fullname +
            "/" +
            updatedItem.Model +
            "/" +
            updatedItem.Parameter +
            "/" +
            updatedItem.LSL +
            "/" +
            updatedItem.CL +
            "/" +
            updatedItem.USL +
            "/" +
            updatedItem.Part +
            "/" +
            updatedItem.Machine +
            "/" +
            empNumber
        );
        console.log("updateUrl", updateUrl);

        // Extract the URL from the config property
        const url = updateUrl.config.url;

        // Make a PUT request to update the data
        const putResponse = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedItem),
        });

        // Retrieve the old values from the report state
        const oldValues = this.state.report.find((item) => item.id === id);

        // Construct a message with the old and new values

        const modelValue = updatedItem.Model;
        console.log("Model:", modelValue);

        console.log("updateUrl", updateUrl);
        // Log the response from the server
        console.log("putResponse", putResponse);

        // Show the update message in Swal
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "After the update is complete",
          customClass: {
            container: "custom-swal-container",
          },
        });

        // Optionally, you can update the UI to reflect the changes
        // For example, you can update the state or trigger a data refresh
        this.doGetDataReport();
      }
    } catch (error) {
      // Log any errors that occur during the update process
      console.error("Error:", error);
      // Optionally, provide user feedback or log errors more systematically
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred during the update.",
        customClass: {
          container: "custom-swal-container",
        },
      });
    }
    console.log("updatedItem", updatedItem);
  };

  handleEditClick = (itemId) => {
    this.setState({ editingItemId: itemId });
  };

  doLogin = async () => {
    try {
      let result = await httpClient.post(
        server.LOGIN_api_Master_ML_URL,
        this.state
      );
      console.log(result.data);

      if (result.data.login_result === "pass") {
        const { empNumber } = result.data.resultlogin;
        console.log(empNumber);
        this.handleSuccessfulLogin(result.data);
        this.setState({ isLoggedIn: true, empNumber: empNumber }); // Update state with empNumber
      } else {
        Swal.fire({
          icon: "error",
          title: "ID/Password is incorrect!!",
        });
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      // Handle error, show an error message, or redirect to an error page
    }
  };

  handleSuccessfulLogin = (resultData) => {
    const { jwt, resultlogin } = resultData;

    // Store JWT token in localStorage
    localStorage.setItem("JWT_TOKEN", jwt);

    // Store user information in localStorage or state, depending on your application needs
    localStorage.setItem("USER_ID", resultlogin.empNumber);
    localStorage.setItem("USER_LEVEL", resultlogin.levelUser);

    // Redirect to the desired page (e.g., "/Master_ml")
    this.props.history.push("/Master_ml");
  };

  renderReport = () => {
    const { report, editingItemId } = this.state;
    if (report != null && report.length > 0) {
      return report.map((item) => (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.Fullname}</td>
          <td>{item.Model}</td>
          <td>{item.Parameter}</td>
          <td>
            <input
              type="text"
              value={item.LSL}
              onChange={(e) => this.handleInputChange(e, item.id, "LSL")}
              disabled={editingItemId !== item.id}
              style={{ width: "70px" }}
            />
          </td>
          <td>
            <input
              type="text"
              value={item.CL}
              onChange={(e) => this.handleInputChange(e, item.id, "CL")}
              disabled={editingItemId !== item.id}
              style={{ width: "70px" }}
            />
          </td>
          <td>
            <input
              type="text"
              value={item.USL}
              onChange={(e) => this.handleInputChange(e, item.id, "USL")}
              disabled={editingItemId !== item.id}
              style={{ width: "70px" }}
            />
          </td>

          <td>{item.Part}</td>
          <td>{item.Machine}</td>
          <td>{item.empNumber}</td>
          <td>{item.updatedAt}</td>
          {/* Repeat similar input fields for other properties */}
          <td>
            {editingItemId !== item.id ? (
              <button
                className="btn btn-primary"
                onClick={() => this.handleEditClick(item.id)}
              >
                Edit
              </button>
            ) : (
              <button
                className="btn btn-success"
                onClick={() => this.handleUpdateClick(item.id, item)}
              >
                UPDATE
              </button>
            )}
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan="11">No data available</td>
        </tr>
      );
    }
  };

  getModel = async () => {
    const array = await httpClient.get(server.MODELMasterURL);
    const options = array.data.result.map((d) => ({
      label: d.Model_group,
    }));
    this.setState({ listModel: options });
  };

  getParameter = async () => {
    const array = await httpClient.get(server.Parameter_URL);
    const options = array.data.result.map((d) => ({
      label: d.Part,
    }));
    this.setState({ listParameter: options });
  };

  render() {
    console.log("listParameter", this.state.listParameter);
    return (
      <div className="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Master Specification </h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">Master Specification </li>
                  </ol>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div>
          {/* ... (other components) */}
          {this.state.isLoggedIn && (
            <div>
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
                              <label>Model group</label>
                              <Select
                                options={this.state.listModel}
                                value={this.state.model}
                                onChange={async (e) => {
                                  await this.setState({ model: e });
                                  await this.getParameter();
                                  await this.setState({
                                    Parameter: [{ label: "Select Tester" }],
                                  });
                                }}
                                // type="text"
                                // className="form-control"
                                placeholder="Select Model"
                              />
                            </div>
                          </div>

                          {/* //Select Critiria "Type" */}
                          <div className="col-md-2">
                            <div className="form-group">
                              <label>Process</label>
                              <Select
                                options={this.state.listParameter}
                                value={this.state.Parameter}
                                onChange={async (e) => {
                                  await this.setState({
                                    Parameter: [{ label: e.label }],
                                  });
                                }}
                                placeholder="Select Tester"
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
                                this.setState({ QANumber: "" });
                                this.setState({ report2: "" });
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
                                    if (this.state.report[0].id.length > 0) {
                                      Swal.fire({
                                        icon: "success",
                                        title: "Success",
                                        text: "Data has been loaded successfully",
                                      });
                                    } else if (
                                      this.state.report[0].id.length == 0
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
                                      title: "No production data",
                                      text: "Please select other date",
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
                        </div>
                      </div>
                    </div>

                    {/* Table*/}
                    <div class="content">
                      <div class="container-fluid">
                        <div className="card card-primary">
                          <div className="row">
                            <div className="col-12">
                              {/* /.card-header */}
                              <div
                                className="card-body table-responsive p-0"
                                style={{
                                  height: 500,
                                  zIndex: "3",
                                  position: "relative",
                                  zIndex: "0",
                                }}
                              >
                                <table className=" table  text-nowrap table-hover table-head-fixed">
                                  <thead>
                                    <tr Align="Center">
                                      <th width="175">ID</th>
                                      <th width="175">Model Name</th>
                                      <th width="175">Model Group</th>
                                      <th width="175">Parameter</th>
                                      <th width="50">LSL</th>
                                      <th width="50">CL</th>
                                      <th width="50">USL</th>
                                      <th width="175">Process</th>
                                      <th width="175">Machine</th>
                                      <th width="175">EmpNumber</th>
                                      <th width="175">updatedAt</th>
                                      <th width="175">Update</th>
                                    </tr>
                                  </thead>
                                  <tbody>{this.renderReport()}</tbody>
                                </table>
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
          )}
        </div>
        {this.state.isLoggedIn !== true && (
          <div className="login-page">
            <div className="login-box">
              <div className="login-logo">
                <a href="../../index2.html">
                  <b>MinebeaMitsumi</b>
                </a>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  this.doLogin();
                }}
              >
                <div className="card">
                  <div className="card-body login-card-body">
                    <p className="login-box-msg">
                      Sign in to start your session
                    </p>

                    {/* Input empNumber */}
                    <div className="input-group mb-3">
                      <input //keyCode 13 is enter key
                        type="text"
                        className="form-control"
                        placeholder="Employee No."
                        onChange={(e) => {
                          this.setState({ empNumber: e.target.value });
                        }}
                        required
                      />
                      <div className="input-group-append">
                        <div className="input-group-text">
                          <span className="fas fa-user" />
                        </div>
                      </div>
                    </div>

                    {/* Input password */}
                    <div className="input-group mb-3">
                      <input
                        type={this.state.pwType}
                        className="form-control"
                        placeholder="Password"
                        onChange={(e) => {
                          this.setState({ password: e.target.value });
                        }}
                        required
                      ></input>

                      <div className="input-group-append">
                        <div className="input-group-text">
                          <i
                            class={this.state.pwIcon}
                            style={{
                              color:
                                this.state.pwIcon == "fas fa-eye"
                                  ? "dodgerBlue"
                                  : "red",
                            }}
                            onClick={() => {
                              if (this.state.pwType == "password") {
                                this.setState({ pwType: "text" });
                                this.setState({ pwIcon: "fas fa-eye-slash" });
                              } else {
                                this.setState({ pwType: "password" });
                                this.setState({ pwIcon: "fas fa-eye" });
                              }
                              console.log(this.state.pwIcon);
                            }}
                          ></i>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      {/* Remember Me Box */}
                      <div className="col-8">
                        <div className="icheck-primary">
                          <input type="checkbox" id="remember" />
                          <label htmlFor="remember">Remember Me</label>
                        </div>
                      </div>
                      {/* Sign In button*/}
                      <div className="col-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                          onClick={() => {
                            this.setState({
                              showHourly: false, // Don't show Hourly
                              show: true, // Show Daily
                            });
                          }}
                        >
                          Sign In
                        </button>
                      </div>
                      {/* /.col */}
                    </div>

                    {/* <p className="mb-0">
                      <Link to="/register_Master" className="text-center">
                        Register a new membership
                      </Link>
                    </p> */}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
        ; ;
      </div>
    );
  }
}

export default Master_ml;
