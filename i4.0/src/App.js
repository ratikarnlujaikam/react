import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register";

import ForgotPW from "./components/forgotpassword";
import ChangePW from "./components/changepassword";


import Daily_LAR_by_Model from './components/LARInspection/Daily_LAR_by_Model'
import Monthly_LAR_report_by_Model from "./components/LARInspection/Monthly_LAR_report_by_Model";
import Monthly_LAR_report_all_Model from './components/LARInspection/Monthly_LAR_report_all_Model'
import Product_hold_control from "./components/QAInspection/Product_hold_control";
import QA_lots_status from './components/QAInspection/QA_lots_status'

import Operator_tracking_data from "./components/OPT/Operator_tracking_data";



import Trace_back_function_test  from "./components/QPM/Trace_back_function_test";
import  Trace_back_shipment from "./components/dodata/Trace_back_shipment";



import ROTOR from "./components/ROTOR";
import MOTORDIM from "./components/MOTORDIM";
import MOTORDIMAI from "./components/MOTORDIM/MOTORDIM_AiPress";
import MOTORDIMRTB from "./components/MOTORDIM/MOTORDIM_RTB";
import MOTOREWMS from "./components/MOTOREWMS";
import MOTORHIPOT from "./components/MOTORHIPOT";
import MOTORHE from "./components/MOTORHE";
import STACKHEIGHT from "./components/stack_height";

import Traceback from "./components/traceback";
import dataRotor from "./components/dataanalysis/dataRotor";

import Information from "./components/information";
import dataanalysis from "./components/dataanalysis";
import dataML from "./components/dataML";
import dataML2 from "./components/dataML/dataML2";
import QAInspection from "./components/QAInspection";

import QAInspectionByQANo from "./components/QAInspection/QAInspectionByQANo.";
import Result from "./components/register/Result";
import Header from "./components/header";
import SideMenu from "./components/sidemenu";
import Footer from "./components/footer";
import { key, YES } from "./constants";
import GRotorLine from "./components/GRotorLine/GRotorLine";
import QCAlert from "./components/QCAlert";
import VMI from "./components/VMI";
import RejectByModel from "./components/Rejection/Rejection";
import RejectByQANO from "./components/Rejection/RejectByQANo.";
import MONTHLYQA from "./components/monthlyQA/monthlyQA";
import Vrecode from "./components/Vrecode/Vrecode";



import report_per_producion_team from './components/Rejection/report_per_producion_team'
import MQTByModel from "./components/Rejection/MQTByModel";
import MasterItemNO from "./components/Master/MasterItemNO";
import MasterSupplier from "./components/Master/MasterSupplier";
import MasterLine from "./components/Master/MasterLine";

import Associate_Rule_Mining from "./components/Daily/Associate_Rule_Mining";
import DailyML1 from "./components/Daily/DailyML1";
import Daily_Report_Packing from "./components/packing/Daily_Report_Packing";
import Rejectbyteam from "./components/Rejectbyteam/Rejectbyteam";
import Output_Final_Before_QA from "./components/OutPutCo2/Output_Final_Before_QA";
import Production_hold_record from "./components/OutPutCo2/Production_hold_record";
import Report from "./components/report/report";
import Output_Final_after_QA from "./components/AfterQa1/Output_Final_after_QA";
import Shipmentdata from "./components/Shipmentdata/Shipmentdata";
import Packed_half_pallet from "./components/Packedhalfpallet/Packed_half_pallet";
import For_Inspection_tags_status from "./components/QAInspection/For_Inspection_tags_status";


import  Shipinfo from "./components/shipinfo/shipinfo";
import  updating from "./components/home/updating";

import  CheckData from "./components/checkData/CheckData";
import  Auto_machine_alarm_history from "./components/MC_ERROR/Auto_machine_alarm_history";
import  trace_back_ng from "./components/trace_back_ng/trace_back_ng";
import  MC_ERROR_test from "./components/MC_ERROR/MC_ERROR_test";
import  Request_label_printing_report from "./components/Report_printlabal/Request_label_printing_report";
import  KPIVranking from "./components/KPIVranking/KPIVranking";
import  MLRanking from "./components/MLRanking/MLRanking";

import  Month_Auto_machine_alarm_history from "./components/MC_ERROR/Auto_machine_alarm_history_Month";

import  Engineer from "./components/sidemenu/Engineer";
import  Quality from "./components/sidemenu/Quality";
import  Production from "./components/sidemenu/Production";
import  Data_Analysis from "./components/sidemenu/Data_Analysis";
import  PCMC from "./components/sidemenu/PCMC";
import  PE_MM from "./components/sidemenu/PE_MM";
import Master_ml from "./components/QAInspection/Master_ml";
import Daily_store_issue from "./components/Daily_store_issue/Daily_store_issue";


import register_Master from "./components/register/register_Master";
import trace_Dynamic from "./components/trace_Dynamic_Parallelism/trace_Dynamic_Parallelism";
import Monthly_Operator from "./components/Monthly_Operator/Monthly_Operator";
import Test_graph from "./components/LARInspection/Test_graph";
import Compare_Output from "./components/LARInspection/Compare_Output";

import  Samcleanliness from "./components/samcleanliness/samcleanliness";
import  Cleanlinessspecial from "./components/cleanlinessspecial/cleanlinessspecial";
import  Cleanlinessmonitor from "./components/Cleanlinessmonitor/Cleanlinessmonitor";
import  Cleanlinessspecialapprove from "./components/cleanlinessspecialapprove/cleanlinessspecialapprove";
import  cleanlinessspecialapprovecleanliness from "./components/cleanlinessspecialapprovecleanliness/cleanlinessspecialapprovecleanliness";
import  Viewdatabase from "./components/Viewdatabase/Viewdatabase";
import  cleanlinessspecialview from "./components/cleanlinessspecialview/cleanlinessspecialview";
import  ViewdatabaseUser from "./components/ViewdatabaseUser/ViewdatabaseUser";
import percen_ng from "./components/procen_ng/procen_ng"
import output_packing from "./components/LARInspection/graph_packing"


const SecuredRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isLoggedIn() === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

const SecuredLVRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isLoggedIn() === true ? (
        isPowerUser() === true ? (
          <Component {...props} />
        ) : (
          <Redirect to="/home" />
        )
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

const isPowerUser = () => {
  if (
    // localStorage.getItem(key.USER_LV) === "MIC_Member" ||
    localStorage.getItem(key.USER_LV) === "admin"
    // localStorage.getItem(key.USER_LV) === "MIC_head"
  ) {
    return true;
  } else {
    return false;
  }
};

const isLoggedIn = () => {
  return localStorage.getItem(key.LOGIN_PASSED) === YES;
};

export default class App extends Component {
  // rcc = react component ใช้ export render ออกหน้าเว็บ
  redirectToLogin = () => {
    return <Redirect to="/login" />;
  };



    render() {
    return (
      
      <Router>
             <Header
 
        />
        {" "}

      
        <div>
          <SideMenu />
          {/* {window.location.pathname === "/home" && <SideMenu />} */}
          <Switch>
                   
            <SecuredRoute path="/home" component={Home} />
            {/* <SecuredRoute path="/home" component={() => window.location.href = 'http://10.120.122.28:2017/HOME'} /> */}
            {/* <SecuredRoute path="/home" component={() => window.location.href = 'http://192.168.101.120:2027/home'} /> */}
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/forgot" component={ForgotPW} />
            <Route path="/changepassword" component={ChangePW} />

            {/* Quality */}
            {/* Monitoring */}
            <SecuredRoute path="/QA_lots_status" component={QA_lots_status} />
            {/* Report */}
            <SecuredRoute path="/monthlyQA" component={MONTHLYQA} />
            <SecuredRoute path="/Daily_LAR_by_Model" component={Daily_LAR_by_Model} />  
            <SecuredRoute path="/Monthly_LAR_report_all_Model" component={Monthly_LAR_report_all_Model} />
            <SecuredRoute path="/Monthly_LAR_report_by_Model" component={Monthly_LAR_report_by_Model} /> 
            <SecuredRoute path="/Product_hold_control" component={Product_hold_control} /> 


            {/* PE/MM */}
            <SecuredRoute path="/Auto_machine_alarm_history" component={Auto_machine_alarm_history} /> 

            {/* Operator */}
            <SecuredRoute path="/report_per_producion_team" component={report_per_producion_team} />
            <SecuredRoute path="/Operator_tracking_data" component={Operator_tracking_data} />
            <SecuredRoute path="/Request_label_printing_report" component={Request_label_printing_report} /> 


            <SecuredRoute path="/ROTOR" component={ROTOR} />
            <SecuredRoute path="/MOTORDIM" component={MOTORDIM} />
            <SecuredRoute path="/MOTORDIMAI" component={MOTORDIMAI} />
            <SecuredRoute path="/MOTORDIMRTB" component={MOTORDIMRTB} />
            <SecuredRoute path="/MOTOREWMS" component={MOTOREWMS} />
            <SecuredRoute path="/MOTORHIPOT" component={MOTORHIPOT} />
            <SecuredRoute path="/MOTORHE" component={MOTORHE} />
            <SecuredRoute path="/STACKHEIGHT" component={STACKHEIGHT} />
            <SecuredRoute path="/traceback" component={Traceback} />
            <SecuredLVRoute path="/information" component={Information} />
            <SecuredRoute path="/Result" component={Result} />
            <SecuredRoute path="/dataanalysis" component={dataanalysis} />
            <SecuredRoute path="/dataML" component={dataML} />
            <SecuredRoute path="/dataML2" component={dataML2} />
            <SecuredRoute path="/dataRotor" component={dataRotor} />
            <SecuredRoute path="/QAInspection" component={QAInspection} />
            {/* <SecuredRoute path="/QAInspectionByQANo" component={QAInspectionByQANo} /> */}
            <SecuredRoute path="/GRLine" component={GRotorLine} />
            <SecuredRoute path="/QCAlert" component={QCAlert} />
            <SecuredRoute path="/VMI" component={VMI} />
            <SecuredRoute path="/Rejection" component={RejectByModel} />
            {/* <SecuredRoute path="/RejectByQANO" component={RejectByQANO} /> */}
      
            <SecuredRoute path="/Vrecode" component={Vrecode} />
         

            <SecuredRoute path="/MQTByModel" component={MQTByModel} />
            <SecuredRoute path="/MasterItemNO" component={MasterItemNO} />
            <SecuredRoute path="/MasterSupplier" component={MasterSupplier} />
            <SecuredRoute path="/MasterLine" component={MasterLine} />
     
            <SecuredRoute path="/Associate_Rule_Mining" component={Associate_Rule_Mining} />
            <SecuredRoute path="/DailyML1" component={DailyML1} />
            <SecuredRoute path="/Daily_Report_Packing" component={Daily_Report_Packing} /> 
            <SecuredRoute path="/Rejectbyteam" component={Rejectbyteam} /> 
            <SecuredRoute path="/Output_Final_Before_QA" component={Output_Final_Before_QA} /> 
            <SecuredRoute path="/Production_hold_record" component={Production_hold_record} /> 
            <SecuredRoute path="/report" component={Report} /> 
            <SecuredRoute path="/Output_Final_after_QA" component={Output_Final_after_QA } /> 
            <SecuredRoute path="/Shipmentdata" component={Shipmentdata} /> 
            <SecuredRoute path="/Packed_half_pallet" component={Packed_half_pallet} /> 
            <SecuredRoute path="/For_Inspection_tags_status" component={For_Inspection_tags_status} /> 

            <SecuredRoute path="/Trace_back_function_test" component={Trace_back_function_test} /> 
            <SecuredRoute path="/Trace_back_shipment" component={Trace_back_shipment} /> 
            <SecuredRoute path="/SHIPINFO" component={Shipinfo} /> 
            <SecuredRoute path="/updating" component={updating} /> 
         
            <SecuredRoute path="/CheckData" component={CheckData} /> 

            <SecuredRoute path="/MC_ERROR_test" component={MC_ERROR_test} />       

            <SecuredRoute path="/KPIVranking" component={KPIVranking} /> 
            <SecuredRoute path="/MLRanking" component={MLRanking} /> 
            <SecuredRoute path="/Engineer" component={Engineer} /> 
            <SecuredRoute path="/Quality" component={Quality} /> 
            <SecuredRoute path="/Production" component={Production} /> 
            <SecuredRoute path="/Data_Analysis" component={Data_Analysis} /> 
            <SecuredRoute path="/PCMC" component={PCMC} /> 
            <SecuredRoute path="/PE_MM" component={PE_MM} /> 
            <SecuredRoute path="/trace_back_ng" component={trace_back_ng} /> 
            <SecuredRoute path="/Auto_machine_alarm_history_Month" component={Month_Auto_machine_alarm_history} /> 
            <SecuredRoute path="/Master_ml" component={Master_ml} /> 
            <SecuredRoute path="/register_Master" component={register_Master} /> 
            <SecuredRoute path="/Daily_store_issue" component={Daily_store_issue} /> 
            <SecuredRoute path="/trace_Dynamic" component={trace_Dynamic} /> 
            <SecuredRoute path="/Monthly_Operator" component={Monthly_Operator} /> 
            <SecuredRoute path="/Test_graph" component={Test_graph} /> 


            <SecuredRoute path="/Samcleanliness" component={Samcleanliness} />    
            <SecuredRoute path="/Cleanlinessspecial" component={Cleanlinessspecial} />
            <SecuredRoute path="/Cleanlinessmonitor" component={Cleanlinessmonitor} />
            <SecuredRoute path="/Cleanlinessspecialapprove" component={Cleanlinessspecialapprove} />
            <SecuredRoute path="/cleanlinessspecialapprovecleanliness" component={cleanlinessspecialapprovecleanliness} />
            <SecuredRoute path="/Viewdatabase" component={Viewdatabase} />
            <SecuredRoute path="/cleanlinessspecialview" component={cleanlinessspecialview} />
            <SecuredRoute path="/ViewdatabaseUser" component={ViewdatabaseUser} />
            <SecuredRoute path="/percen_ng" component={percen_ng} />
            <SecuredRoute path="/Compare_Output" component={Compare_Output} />
            <SecuredRoute path="/output_packing" component={output_packing} />


            <Route exact={true} path="/" component={this.redirectToLogin} />
            <Route exact={true} path="*" component={this.redirectToLogin} />

           
          </Switch>{" "}
                  
          <Footer />
        </div>
              
      </Router>
    );
  }
}
