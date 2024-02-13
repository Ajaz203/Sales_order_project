sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,UIComponent,JSONModel) {
        "use strict";

        return Controller.extend("chobanii.controller.ProgressData", {
            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var oRoute = oRouter.getRoute("ProgressData");
                oRoute.attachPatternMatched(this.onObjectMatched, this);
                
                
            },
            onObjectMatched: function (oEvent) {
                var runid = oEvent.getParameter("arguments").runid;
              

                var invoiceNo = {
                    invoiceNumber: runid
                };
                console.log("invoice id ",invoiceNo);
                
            
                fetch("https://port4040-workspaces-ws-v479k.us10.trial.applicationstudio.cloud.sap/my/excelDataByInvoiceNumber", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(invoiceNo)
                })
                .then(response => response.json())
                .then(data => {
                    const res = JSON.parse(data.response)
                    // console.log(res.status);
                    // console.log("my new data",res);
                    
                   let daata = JSON.parse(res.message);
                   console.log("after teransform the data",daata);
              var smartData = new JSONModel();
              smartData.setData(daata);
              this.getView().setModel(smartData, "ModelData");
              console.log(" model  data", smartData)

                    if(res.status == 200){
                        // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            // oRouter.navTo("ProgressData", {}, true);
                    }
                    if(res.status == 400){
                        sap.m.MessageToast.show("Server Not Responding");
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            oRouter.navTo("Inprogress", {}, true);
                    }
                })
                .catch(error => {
                    console.error("Failed :", error);
                    // Optionally handle the error
                });
           

            },
            onBackPress: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Inprogress", {}, true);

            },
            // onRouteMatched: function (oEvent) {
            //     // debugger;
            //     console.log("route matched runs")
            //     var that = this;
            //     this.runId = oEvent.getParameter("arguments").runid;
            //     console.log(this.runId)

            //     var model = new sap.ui.model.json.JSONModel();
            //     this.getView().setModel(model, "invoiceNumber");
            //     model.setProperty("/runId", this.runId);
            //     console.log(model)
            //     this.getView().byId("hardErrorData").rebindTable(true);
            // },

        });
    });