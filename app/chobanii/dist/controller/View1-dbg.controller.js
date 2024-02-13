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
            onLoginPress1:function()
            {
                var oUser = this.getView().byId("user").getValue();  
			var oPwd = this.getView().byId("password").getValue();    
			
			if(oUser==="Admin" && oPwd==="Admin")
            {				
                sap.m.MessageToast.show("Login Successfully");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("uploadPage", {}, true);

			}
            else
            {
				alert("Re-Enter your Detail");
			}
            this.byId("user").setValue("");
            this.byId("password").setValue("");

                
            },

            // getRouter: function () {
            //     return UIComponent.getRouterFor(this);

            // },
            // onPress:function()
            // {
            //     this.getRouter().navTo("uploadPage");  
            // },



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
            
            

            // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            // oRouter.navTo("Exceldata", {}, true);
            this.byId("user").setValue(""); 
            this.byId("password").setValue("");
        },



        });
    });
