import React, { Component } from "react";
import { server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      xAxis: [],
      yAxis: [],
      yAxis2: [],
      //filter
      startDate: moment().add("days", -30).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"),
    };
    this.state = {
      userLocation: null,
    };
  }
  componentDidMount() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.setState({ userLocation });
      });
    } else {
      console.log("Geolocation is not available in this browser.");
    }
  }

  doGetData = async () => {
    console.log(this.state.startDate);
    console.log(this.state.finishDate);
    let result = await httpClient.get(
      server.YIELD_URL +
        "/" +
        this.state.startDate +
        "&" +
        this.state.finishDate
    );
    console.log(result.data.result);
    let xAxis = [];
    let yAxis = [];
    let yAxis2 = [];

    for (let index = 0; index < result.data.result.length; index++) {
      const item = result.data.result[index];
      await xAxis.push(item.Date);
      await yAxis.push(item["%Yield"]);
      await yAxis2.push(90);
    }

    this.setState({ data: result.data.result, xAxis, yAxis, yAxis2 });
  };

  componentDidMount = async () => {
    console.log(this.state.startDate);
    console.log(this.state.finishDate);
    let result = await httpClient.get(
      server.YIELD_URL +
        "/" +
        this.state.startDate +
        "&" +
        this.state.finishDate
    );
    console.log(result.data.result);
    let xAxis = [];
    let yAxis = [];
    let yAxis2 = [];

    for (let index = 0; index < result.data.result.length; index++) {
      const item = result.data.result[index];
      await xAxis.push(item.Date);
      await yAxis.push(item["%Yield"]);
      await yAxis2.push(90);
    }

    this.setState({ data: result.data.result, xAxis, yAxis, yAxis2 });
  };

  renderTableRow = () => {
    return this.state.data.map((item) => (
      <tr>
        <td>{item.Date}</td>
        <td>{item["%Yield"]}</td>
      </tr>
    ));
  };

  render() {
    return (
      <>
        <div className="content-wrapper" style={{ paddingTop: 80 }}>
          <h1>Products</h1>
          <h2>Spindle Motor for HDDs</h2>
          
          <div
            className="content"
            style={{
              paddingTop: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className="row">
              <div className="border-full-bottom">
                <div className="D-3 M-12 D-right-9 M-left-0 no-gap">
                  <div className="title-section title-inside"></div>
                </div>
              </div>
            </div>


            {/* เพิ่มรูปภาพด้านล่างนี้ */}
            <img
              src="Gallery-Bangpain8.jpg"
              width="1200" // กำหนดความกว้าง
              height="650" // กำหนดความสูง
              style={{ alignSelf: "center" }} // จัดรูปภาพให้อยู่ตรงกลาง
            />
          </div>
        </div>
        {/* <div className="D-4 T-6 SM-12">
          <img
            src="https://minebea.co.th/wp-content/themes/minebea/theme/app/images/logo-blue.png"
            className="img-lazy"
            data-original="https://minebea.co.th/wp-content/themes/minebea/theme/app/images/logo-blue.png"
            alt=""
            style={{ display: "inline" }}
          />
          <br />
          <br />
          <div className="footer-item">
            <i className="icon-location"></i>
            <b>Bang Pa-In Plant (Head Office)</b>
            <br />1 Moo 7, Phaholythin Road, Km.51, Tambol Chiang Rak-Noi,
            Amphoe Bang Pa-In Ayutthaya Province 13180 Thailand
          </div>
          <div className="footer-item">
            <i className="icon-phone"></i>
            (035) 361429 - 361439
          </div>
          <div className="footer-item">
            <i className="icon-fax"></i>
            (035) 361177, 361477
          </div>
        </div> */}

      </>
    );
  }
}
export default Home;
