sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
    "sap/m/MessageToast",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, JSONModel, Export, ExportTypeCSV, MessageToast) {
        "use strict";
        var runidd;
        var formDataa;
        return Controller.extend("chobanii.controller.ProgressData", {
            onInit: function () {
                // Get the router and attach a callback function for the "ProgressData" route
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var oRoute = oRouter.getRoute("ProgressData");
                oRoute.attachPatternMatched(this.onObjectMatched, this);
            
                
            },
           
            
        

            onItemPress: function (oEvent) {
                var that = this;
                var oPath = oEvent.getSource().getBindingContext('ModelData').getPath()

                // debugger;
                if (!that.oDialog) {
                    // that.oDialog = sap.ui.xmlfragment("chobanii.fragment.update", that);
                    // that.getView().addDependent(that.oDialog);
                    this.loadFragment({
                        name: "chobanii.fragment.update"
                    }).then(function (odialog) {
                        this.oDialog = odialog;
                        this.oDialog.open();
                        this.oDialog.bindElement({
                            path: oPath,
                            model: "ModelData"
                        });
                    }.bind(this))

                } else {
                    this.oDialog.open();
                    this.oDialog.bindElement({
                        path: oPath,
                        model: "ModelData"
                    });
                }


            },

            onClose: function () {
                this.oDialog.close();
            },
            onUpdateRecord: function () {
                var oModel = this.getView().getModel("ModelData");
                var oData = oModel.getData();
                console.log("ModelData:", oData);
            
                var oInvoiceInput = this.getView().byId("invoiceNum");
                var invoiceAmount = this.getView().byId("invoiceAmount").getValue();
                var invoiceYear = this.getView().byId("invoiceYear").getValue();
                console.log("Invoice Input:", oInvoiceInput); // Check if invoiceNum control is correctly retrieved
                var oInvoice = oInvoiceInput ? oInvoiceInput.getValue() : "";
                console.log("Invoice updated data : ", oInvoice, invoiceAmount, invoiceYear);
            
                var oPayload = {
                    "invoiceNumber": oInvoice,
                    "newInvoiceGrossAmount": invoiceAmount,
                    "newFiscalYear": invoiceYear
                };
                console.log("Payload:", oPayload);
            
                var that = this; // Preserve 'this' reference for use inside the Ajax callbacks
            
                // Send the update request to the backend
                $.ajax({
                    url: "https://port4040-workspaces-ws-v479k.us10.trial.applicationstudio.cloud.sap/my/updateInvoice",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(oPayload),
                    success: function (data) {
                        console.log("Response data:", data);
                        oModel.setData(data);
                        oModel.refresh(); // Refresh the model after setting the data
                        MessageToast.show("Data updated successfully");
                        window.location.reload();
                        // this.getView().getModel("Model").refresh();
                        that.onClose(); // Close the dialog or handle further actions
                    },
                    error: function (err) {
                        MessageToast.show("Error occurred while updating data");
                        console.error("Error:", err);
                    }
                });
            },
             
            
            

            // success: function (data) {
            //     // Log the response data to the console
            //     console.log("Response data:", data);

            //     // Check if the response is a string, if so, parse it as JSON
            //     if (typeof data === "string") {
            //         data = JSON.parse(data);
            //     }

            //     // Update the form fields with the data received from the backend
            //     oModel.setData(data);
            //     MessageToast.show("Data updated successfully");
            //     this.getView().getModel("ModelData").refresh();
            // },
            onChangeLog: function () {
                // Retrieve change log data from the server or database
                $.ajax({
                    url: "https://your-api-endpoint/getChangeLog",
                    type: "GET",
                    success: function (changeLogData) {
                        // Log the change log data to the console
                        console.log("Change Log Data:", changeLogData);

                        // Now fetch the updated data
                        $.ajax({
                            url: "https://port4040-workspaces-ws-v479k.us10.trial.applicationstudio.cloud.sap/my/UpdateExcelData",
                            type: "GET",
                            success: function (updatedData) {
                                // Log the updated data to the console
                                console.log("Updated Data:", updatedData);
                                // You can also update the UI with the updated data here
                            },
                            error: function (err) {
                                console.error("Error retrieving updated data:", err);
                                // Handle error, e.g., show error message to the user
                            }
                        });
                    },
                    error: function (err) {
                        console.error("Error retrieving change log data:", err);
                        // Handle error, e.g., show error message to the user
                    }
                });
            },
            onObjectMatched: function (oEvent) {
                // Handle the pattern matched event and any necessary data retrieval for the SmartForm
                var runid = oEvent.getParameter("arguments").runid;
                // Additional logic based on the matched object
                // ...
            },

            onSendToSap: function (oEvent) {
                // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                // this.oTable = this.getView().byId("idInprogressTable");

                // var itemNo = oEvent.oSource.mAggregations.cells[0].mProperties.text;
                var invoiceNo = runidd;
                console.log("mynew id ", invoiceNo);

                fetch("https://port4040-workspaces-ws-v479k.us10.trial.applicationstudio.cloud.sap/my/sendToSap", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(invoiceNo)
                })
                    .then(response => response.json())
                    .then(data => {
                        const res = JSON.parse(data.response)
                        // console.log("my new data",res);

                        if (res.status == 200) {
                            console.log(res.status);
                            sap.m.MessageToast.show("Successfully Sended");
                        }
                        if (res.status == 400) {
                            sap.m.MessageToast.show("Server Not Responding");

                        }
                    })
                    .catch(error => {
                        console.error("Failed :", error);
                        // Optionally handle the error
                    });


            },



            onObjectMatched: function (oEvent) {
                var runid = oEvent.getParameter("arguments").runid;


                var invoiceNo = {
                    invoiceNumber: runid
                };
                console.log("invoice id ", invoiceNo);

                runidd = invoiceNo;

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
                        console.log("my new data", res);
                        let daata = JSON.parse(res.message);

                        console.log("after teransform the data", daata, daata.length);
                        //    debugger;
                        let supplier = daata[0].Supplierinvoice;
                        let date = daata[0].Documentdate;
                        let Amount = daata[0].SupplierInvoiceItemAmount;

                        var formData1 = [{
                            supplier: supplier,
                            date: date,
                            Amount: Amount
                        }];
                        // let formData1 = JSON.parse(formData);
                        console.log("date", formData1);
                        // debugger;
                        var formData2 = new JSONModel();
                        formData2.setData(formData1);
                        this.getView().setModel(formData2, "formModelData");
                        console.log("form model data", formData2);
                     
                        // formDataa = formData;

                        var smartData = new JSONModel();
                        smartData.setData(daata);
                        this.getView().setModel(smartData, "ModelData");
                        console.log(" model  data", smartData);



                        if (res.status == 200) {
                            // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            // oRouter.navTo("ProgressData" , {}, true);
                        }
                        if (res.status == 400) {
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

            onDataExport: function () {
                var oExport = new Export({
                    exportType: new ExportTypeCSV({ // required from "sap/ui/core/util/ExportTypeCSV"
                        separatorChar: ",",
                        charset: "utf-8"
                    }),
                    models: this.getView().getModel("Model"),
                    rows: { path: "/excelData" },
                    columns: [{
                        name: "Invoice Number ",
                        template: {
                            content: "{Supplierinvoice}"

                        }
                    },
                    {
                        name: "Invoice  Date ",
                        template: {
                            content: "{Fiscalyear}"

                        }
                    },
                    {
                        name: "Amount ",
                        template: {
                            content: "{Companycode}"
                        }
                    },
                    {
                        name: "Fiscal Year ",
                        template: {
                            content: "{Documentdate}"
                        }
                    },
                    {
                        name: "Companycode",
                        template: {
                            content: "{Postingdate}"
                        }
                    },
                    {
                        name: "Postingdate ",
                        template: {
                            content: "{Postingdate}"
                        }
                    },
                    {
                        name: "SupplierInvoiceIdByInvcgParty ",
                        template: {
                            content: "{Supplierinvoiceidbyinvcgparty}"
                        }
                    },
                    {
                        name: "Invoicingparty",
                        template: {
                            content: "{Invoicingparty}"
                        }
                    },
                    {
                        name: "Documentcurrency",
                        template: {
                            content: "{Documentcurrency}"
                        }
                    },
                    {
                        name: "Invoicegrossamount",
                        template: {
                            content: "{Invoicegrossamount}"
                        }
                    }
                        ,
                    {
                        name: "Duecalculationbasedate",
                        template: {
                            content: "{Duecalculationbasedate}"
                        }
                    }
                        ,
                        ,
                    {
                        name: "Businessplace ",
                        template: {
                            content: "{Businessplace}"
                        }
                    },
                    {
                        name: "Taxamount ",
                        template: {
                            content: { path: "Companycode" }
                        }
                    },
                    {
                        name: "Supplierinvoiceitem ",
                        template: {
                            content: { path: "Supplierinvoiceitem" }
                        }
                    },
                    {
                        name: "Taxamount ",
                        template: {
                            content: "{Taxamount}"
                        }
                    },
                    {
                        name: "Purchaseorder ",
                        template: {
                            content: "{Purchaseorder}"
                        }
                    },
                    {
                        name: "Purchaseorderitem ",
                        template: {
                            content: "{Purchaseorderitem}"
                        }
                    },
                    {
                        name: "SupplierInvoiceItemAmount ",
                        template: {
                            content: "{SupplierInvoiceItemAmount}"
                        }
                    },
                    {
                        name: " Taxcode",
                        template: {
                            content: "{Taxcode}"
                        }
                    }
                        // ...
                    ]
                });
                oExport.saveFile().catch(function (oError) {
                    MessageBox.error("Error when downloading data. ..." + oError);
                }).then(function () {
                    oExport.destroy();
                });
            },
            // In the tab fragment's controller



        });
    });