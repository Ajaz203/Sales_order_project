sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/m/MessageToast"
], function (Controller, MessageBox, MessageToast) {
  "use strict";

  return Controller.extend("chobanii.controller.Inprogress", {
      onInit: function () {
        

         
      },

      onBack: function () {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("uploadPage", {}, true);
      },

      onItemPress: function (oEvent) {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          this.oTable = this.getView().byId("idInprogressTable");

          var itemNo = oEvent.oSource.mAggregations.cells[0].mProperties.text;
          oRouter.navTo("ProgressData", { runid: itemNo });
          
      },
      onSearch: function(oEvent) {
        // Get the search query entered by the user
        var sQuery = oEvent.getParameter("query").toLowerCase(); // Convert to lowercase for case-insensitive search
    
        // Get the reference to the table
        var oTable = this.byId("idInprogressTable");
    
        // Get the binding context of the table
        var oBinding = oTable.getBinding("items");
    
        // Apply the filter to the binding
        if (sQuery) {
            var oFilter = new sap.ui.model.Filter("invoiceNumber", sap.ui.model.FilterOperator.Contains, sQuery);
            oBinding.filter([oFilter]);
        } else {
            oBinding.filter([]);
        }
    },
onRowDelete: function(event) {
    var selectedRowContext = event.getSource().getBindingContext("Model");
    var selectedRowData = selectedRowContext.getObject();
    var invoiceNumber = selectedRowData.invoiceNumber.toString(); // Convert to string

    var confirmationMessage = "Are you sure you want to delete the row with invoice number " + invoiceNumber + "?";

    sap.m.MessageBox.confirm(confirmationMessage, {
        title: "Confirmation",
        onClose: function(oAction) {
            if (oAction === sap.m.MessageBox.Action.OK) {
                // User clicked OK in the confirmation dialog

                // Construct the API request to delete the row based on the invoice number
                var deleteRequest = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ invoiceNumber: invoiceNumber }),
                    url: 'https://port4040-workspaces-ws-v479k.us10.trial.applicationstudio.cloud.sap/my/deleteByInvoiceNumber'
                };

                fetch(deleteRequest.url, deleteRequest)
                    .then(response => {
                        if (response.ok) {
                            console.log("Invoice number " + invoiceNumber + " deleted successfully");
                            sap.m.MessageToast.show("Invoice number " + invoiceNumber + " deleted successfully");
                            this.getView().getModel("Model").refresh();
                        } else {
                            console.error("Failed to delete row with invoice number " + invoiceNumber);
                            sap.m.MessageToast.show("Failed to delete row with invoice number " + invoiceNumber);
                        }
                    })
                    .catch(error => {
                        console.error("Error deleting row: " + error.message);
                    });
            } else {
                // User clicked Cancel in the confirmation dialog
                console.log("Deletion canceled by the user.");
            }
        }.bind(this) 
    });
},



  });
});
