sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,UIComponent, Export, ExportTypeCSV) {
        "use strict";

        return Controller.extend("chobanii.controller.Exceldata", {
            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var oRoute = oRouter.getRoute("Exceldata");
                oRoute.attachPatternMatched(this.onObjectMatched, this);
            },

            onObjectMatched: function (oEvent) {
                var runid = oEvent.getParameter("arguments").runid;
              

                var invoiceNo = {
                    invoiceNumber: runid
                };
                console.log("invoice id ",invoiceNo);
               

            },
          
            onBackPress:function()
            {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("uploadPage", {}, true);
                
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
                    content: { path:"Companycode"}
                }
            },
            {
                name: "Supplierinvoiceitem ",
                template: {
                    content: {path:"Supplierinvoiceitem"}
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
                oExport.saveFile().catch(function(oError) {
                  MessageBox.error("Error when downloading data. ..." + oError);
                }).then(function() {
                  oExport.destroy();
                });
              },
             
        });
    });