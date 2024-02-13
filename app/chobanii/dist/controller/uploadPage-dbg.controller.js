sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "jquery.sap.global"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, jQuery, UIComponent) {
        "use strict";
        var excelData;
        return Controller.extend("chobanii.controller.uploadPage", {
            onInit: function () {
            },

            onSubmit2:function()
            {
                			
                sap.m.MessageToast.show("navigate Successfully");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Exceldata", {}, true);

            },

            onBackPress: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteView1", {}, true);

            },
            onLogoutPress: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteView1", {}, true);
                sap.m.MessageToast.show("Logout Successfully");
            },
            onInprogress: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Inprogress", {}, true);
            },
            onAmount: function () {
                var invoiceValue = this.byId("invoiceData").getValue();

                // Check for empty field
                if (!invoiceValue) {
                    this.byId("invoiceData").setValueState("Error");
                    this.byId("invoiceData").setValueStateText("Amount cannot be empty");
                    return;
                }

                // Check for special characters
                if (!/^[0-9.]+$/.test(invoiceValue)) {
                    this.byId("invoiceData").setValueState("Error");
                    this.byId("invoiceData").setValueStateText("Amount can only contain numbers and a decimal point");
                    return;
                }

                var amount = parseFloat(invoiceValue.trim());

                // Check for negative values and zero
                if (isNaN(amount) || amount <= 0) {
                    this.byId("invoiceData").setValueState("Error");
                    this.byId("invoiceData").setValueStateText("Amount should be a positive number");
                    return;
                }

                // Clear any previous validation errors
                this.byId("invoiceData").setValueState("None");
            },

            // validating runid whether it already exist or not
            onInvoiceChange: function () {
                // debugger;
                var that = this;

                var runId = this.byId("runid").mProperties.value;

                // regex to check for alphanumeric value
                const alphanumericRegex = /^[A-Za-z0-9]+$/;

                if (runId == "") {
                    sap.m.MessageToast.show("Enter Invoice Number");
                } else if (!alphanumericRegex.test(runId)) {
                    sap.m.MessageToast.show("Invoice Number Can only Contain AlphaNumeric Value");
                    this.oModel.setProperty("/valueStateRunId", "Error");
                } else {

                    var sServiceUrl = this.getView().getModel().sServiceUrl;
                    var oDataModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl);
                    // sap.ui.core.BusyIndicator.show();
                    oDataModel.create("/getRunId", { data: JSON.stringify(runId) }, {
                        success: function (oData, oResponse) {
                            if (oResponse) {
                                sap.ui.core.BusyIndicator.hide();
                            }
                            if (oResponse.data.getRunId.Status !== "[]") {

                                sap.m.MessageToast.show("Invoice Number Already Exists");
                                that.oModel.setProperty("/valueStateRunId", "Error");
                                console.log(that.oModel)
                                console.log("success")

                            } else {
                                that.oModel.setProperty("/valueStateRunId", "None");
                            }
                            // Success callback
                            console.log("OData service call success");
                        },
                        error: function (oError) {
                            // Error callback
                            console.log("OData service call failed", oError);
                            sap.m.MessageToast.show("Service Not Reachable");
                        }
                    });
                }
            },

            //
            onUpload: function (oEvent) {
                var file = oEvent.getParameter("files")[0];
                var reader = new FileReader();
                // var that = this; // Store the reference to "this" for later use

                reader.onload = function (e) {
                    var data = new Uint8Array(e.target.result);
                    var workbook = XLSX.read(data, { type: "array" });

                    workbook.SheetNames.forEach(function (sheetName) {
                        var worksheet = workbook.Sheets[sheetName];
                        var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                        var jsonString = JSON.stringify(jsonData);
                        excelData = jsonString;

                    });
                };

                reader.readAsArrayBuffer(file);
            },

            // Assuming you have the 'xlsx' library imported
            // Read the Excel file and upload the Excel data to the backend


            onSubmit: function () {
                var that = this;
                var invoiceNumber = that.getView().byId("runid").getValue();
                var invoiceDate = that.getView().byId("DP3").getValue();
                var totalAmount = that.getView().byId("invoiceData").getValue();
                var formDataToPass = {
                    invoiceNumber: invoiceNumber,
                    invoiceDate: invoiceDate,
                    totalAmount: totalAmount,
                    excelData: excelData
                };
                console.log('formDataToPass', formDataToPass);
                // var fileFormData = new FormData();
                const formDataToPass2 = JSON.stringify(formDataToPass)
                console.log(typeof(formDataToPass2))
                // fileFormData.append("formData", JSON.stringify(formDataToPass))
                // First, upload the file to the backend
                fetch("https://port4040-workspaces-ws-v479k.us10.trial.applicationstudio.cloud.sap/my/excelUpload", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body:formDataToPass2
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Response from uploadExcelFile API:", data);
                        const res = JSON.parse(data.response)
                        console.log(res.status);
                        if(res.status == 200){
                            sap.m.MessageToast.show("Invoice Uploaded Successfully"); 
                              
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            oRouter.navTo("Exceldata", {}, true); 

                            this.byId("invoiceData").setValue("");
                            this.byId("DP3").setValue("");
                            this.byId("runid").setValue("");
                            this.byId("fileUploader1").setValue("");              
                              }
                       
                            if(res.status == 400){
                            sap.m.MessageToast.show("Server Not Responding");
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                                oRouter.navTo("uploadPage", {}, true);
                        }
                    })
                    .catch(error => {
                        console.error("Failed to upload Excel file:", error);
                        // Optionally handle the error
                    });
            },
            // called to reset the value when record is created successfully
            onReset: function () {
                this.byId("invoiceData").setValue("");
                this.byId("DP3").setValue("");
                this.byId("runid").setValue("");
                this.byId("fileUploader1").setValue("");
            }
        });
    });
