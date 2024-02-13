sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "jquery.sap.global",
    "sap/ui/model/json/JSONModel"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, jQuery, UIComponent, JSONModel) {
        "use strict"
        var excelData;
        return Controller.extend("chobanii.controller.uploadPage", {
          
            onInit: function () {
                var datePicker = this.byId("DP3");
                datePicker.setDateValue(new Date());
                $("#" + datePicker.getId() + "-inner").attr("readonly", true);
                datePicker.attachBrowserEvent("focus", function (oEvent) {
                    oEvent.preventDefault();
                });
            },
            
            onSubmit2:function()
            {
                var that = this;
                var runid = that.getView().byId("runid").getValue();
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("ProgressData", {runid:runid}, true);

                sap.m.MessageToast.show("navigate Successfully");
                
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
                this.getView().getModel("Model").refresh();
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
                var invoiceInput = this.byId("runid");
                var invoiceValue = invoiceInput.getValue();
                var alphanumericRegex = /^(?!0+\b)[A-Za-z0-9]+$/;
            
                if (invoiceValue.trim() === "") {
                    invoiceInput.setValueState("Error");
                    invoiceInput.setValueStateText("Enter Invoice Number");
                    sap.m.MessageToast.show("Enter Invoice Number");
                } else if (!alphanumericRegex.test(invoiceValue)) {
                    invoiceInput.setValueState("Error");
                    invoiceInput.setValueStateText("Invoice Number Can only Contain AlphaNumeric Value and should not start with 0");
                    sap.m.MessageToast.show("Invoice Number Can only Contain AlphaNumeric Value and should not start with 0");
                } else {
                    // Perform check for existing invoice number
                    var existingInvoiceNumbers = []; // Replace with actual list of existing invoice numbers
                    if (existingInvoiceNumbers.includes(invoiceValue)) {
                        invoiceInput.setValueState("Error");
                        invoiceInput.setValueStateText("Invoice Number Already Exists");
                        sap.m.MessageToast.show("Invoice Number Already Exists");
                    } else {
                        invoiceInput.setValueState("None");
                    }
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

        
            onSubmit: function () {
                var that = this;
                var invoiceNumber = that.getView().byId("runid").getValue();
                var invoiceDate = that.getView().byId("DP3").getValue();
                var totalAmount = that.getView().byId("invoiceData").getValue();
                var fileUploader = that.getView().byId("fileUploader1");
                var file = fileUploader.getValue();
                var formDataToPass = {
                    invoiceNumber: invoiceNumber,
                    invoiceDate: invoiceDate,
                    totalAmount: totalAmount,
                    excelData: excelData
                };
                
                // Check if any required field is empty
                if (!invoiceNumber || !invoiceDate || !totalAmount) {
                    // Display an error message to the user
                    sap.m.MessageToast.show("Please fill all the required fields");
                    return; // Exit the function, preventing further execution
                } 
                if (!file && (invoiceNumber || invoiceDate || totalAmount)) {
                    // Display an error message to the user
                    sap.m.MessageToast.show("Please upload the Excel file");
                    return; // Exit the function, preventing further execution
                }
 
                const formDataToPass2 = JSON.stringify(formDataToPass)
               
                fetch("https://port4040-workspaces-ws-v479k.us10.trial.applicationstudio.cloud.sap/my/excelUpload", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body:formDataToPass2
                })
                    .then(response => response.json())
                    .then(data => {
                        // console.log("Response from uploadExcelFile API:", data);
                        const res = JSON.parse(data.response)
                        console.log(res.status);
                        if(res.status == 200){
                            sap.m.MessageToast.show("Invoice Uploaded Successfully"); 
                              console.log("my id is ",invoiceNumber);
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            oRouter.navTo("ProgressData", {runid:invoiceNumber}, true); 

                            this.byId("invoiceData").setValue("");
                            this.byId("DP3").setValue("");
                            this.byId("runid").setValue("");
                            this.byId("fileUploader1").setValue("");            
                        }
                       
                            if(res.status == 400){
                            sap.m.MessageToast.show("Did Not match Invoice Number Or Amount");
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
