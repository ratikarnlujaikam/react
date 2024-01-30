import React, { Component } from "react";

class Side_manu_Engineer extends Component {
  render() {
    return (
      <div className="content-wrapper" style={{ border: "1px solid #e6f7ff" }}>
        <div className="content" style={{ paddingTop: 80 }}>
          {/* ... rest of your code ... */}

          <div className="content-wrapper">
          
        
              <div className="row">
                <div className="col-md-12">
                  <div
                    className="card card-primary card-outline"
                    style={{
                      width: "100",
                      height: "200%",
                      backgroundColor: "#e6f7ff",
                    }}
                  >
                    <div className="col-sm-12">
                      <ol className="breadcrumb float-sm-right">
                        <li className="breadcrumb-item">
                          <a href="/Home">Home</a>
                        </li>
                      </ol>
                      <h2>Engineer</h2>
                      <div className="row">
                        <div className="col-md-6">
                          <div
                              className="card card-primary card-outline"
                              style={{
                                width: "100%",
                                height: "100%",
                                border: "2px solid #0073e6", // Set border color to a darker blue
                              }}
                          >
                            <div className="card-header">
                              <h3 className="card-title">
                                <h5>Traceability</h5>
                              </h3>
                            </div>
                            <div className="card-body">
                              <li className="breadcrumb-item">
                                <a href="MasterItemNO">Item No.Master</a>

                                <li className="breadcrumb-item">
                                  <a href="MasterSupplier">
                                    Supplier data Master
                                  </a>

                                  <li className="breadcrumb-item">
                                    <a href="MasterLine">Line no. Master</a>
                                    <li className="breadcrumb-item">
                                    <a href="/Master_ml">Master Specification</a>
                                  </li>
                                  </li>
                                </li>
                              </li>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div
                              className="card card-primary card-outline"
                              style={{
                                width: "100%",
                                height: "100%",
                                border: "2px solid #0073e6", // Set border color to a darker blue
                              }}
                          >
                            <div className="card-header">
                              <h3 className="card-title">
                                <h5>Monitoring</h5>
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6" style={{ paddingTop: 60 }}>
                          <div
                              className="card card-primary card-outline"
                              style={{
                                width: "95%",
                                height: "300%",
                                border: "2px solid #0073e6", // Set border color to a darker blue
                              }}
                          >
                            <div className="card-header">
                              <h3 className="card-title">
                                <h5>Report</h5>
                              </h3>
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
        </div>
   
    );
  }
}

export default Side_manu_Engineer;
