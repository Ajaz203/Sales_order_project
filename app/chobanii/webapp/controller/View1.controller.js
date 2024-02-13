sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,UIComponent) {
        "use strict";

        return Controller.extend("chobanii.controller.View1", {
            onInit: function () {

            },
           
            onLoginPress1: function() {
                var oUserInput = this.getView().byId("user");
                var oPwdInput = this.getView().byId("password");
                var sUser = oUserInput.getValue().trim();
                var sPwd = oPwdInput.getValue().trim();
            
                // Check if email and password are empty
                if (!sUser || !sPwd) {
                    // Display message toast for empty fields
                    sap.m.MessageToast.show("Please enter both email and password.");
                    return;
                }
            
                if (sUser === "Admin" && sPwd === "Admin") {
                    sap.m.MessageToast.show("Login Successfully");
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("uploadPage", {}, true);
                } else {
                    sap.m.MessageToast.show("Invalid username or password. Please try again.");
                    // Clear input fields
                    oUserInput.setValue("");
                    oPwdInput.setValue("");
                }
            },
            



            onLoginPress: function() {
                var oUser = this.getView().byId("user").getValue();
                var oPwd = this.getView().byId("password").getValue();
            
                var loginData = {
                    user: oUser,
                    password: oPwd
                };
            
                fetch("https://port4040-workspaces-ws-v479k.us10.trial.applicationstudio.cloud.sap/my/userLogin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(loginData)
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Response from login API:", data);
                    const res = JSON.parse(data.response)
                    console.log(res.status);
                    if(res.status == 200){
                        sap.m.MessageToast.show("Login Successfully"); 
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            oRouter.navTo("uploadPage", {}, true);
                    }
                    if(res.status == 400){
                        sap.m.MessageToast.show("Server Not Responding");
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            oRouter.navTo("RouteView1", {}, true);
                    }
                })
                .catch(error => {
                    console.error("Failed to login:", error);
                    // Optionally handle the error
                });
                
            this.byId("user").setValue(""); 
            this.byId("password").setValue("");
        },



        });
    });
