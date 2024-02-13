sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, UIComponent) {
        "use strict";

        return Controller.extend("chobanii.controller.Inprogress", {
            onInit: function () {
                
                
            },
            onBack: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("uploadPage", {}, true);
                
            },
            
            
                   
           
            // getData: function () {
            //     // sap.ui.core.BusyIndicator.show();
            //     var that = this;
            //     var oModel = new JSONModel();
            //     var sServiceUrl = this.getView().getModel().sServiceUrl;
            //     var oDataModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl);
            //     oDataModel.read("/readData", {
            //         success: function (oData, response) {
            //             var data = response.data.results;
            //             console.log(data)
            //             oModel.setData(data);
            //             that.getView().setModel(oModel, "invoiceData");
            //             sap.ui.core.BusyIndicator.hide();
            //         },
            //         error: function (error) {
            //             sap.ui.core.BusyIndicator.hide();
            //             sap.m.MessageToast.show("Error on getting Header Data");
            //         }
            //     })
            //     console.log(oModel)
            // },
            onItemPress: function (oEvent) {
                // debugger;
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oTable = this.getView().byId("idInprogressTable");
                
                var itemNo = oEvent.oSource.mAggregations.cells[0].mProperties.text;
                oRouter.navTo("ProgressData", { runid: itemNo});
                
                // const invoiceNo1 = JSON.stringify(itemNo)
                // console.log(typeof(invoiceNo1));
                
               
            // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            // oRouter.navTo("Exceldata", {}, true);
           


            },
           
        });
    });