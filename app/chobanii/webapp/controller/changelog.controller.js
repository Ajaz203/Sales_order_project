sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    
    function (Controller, JSONModel,UIComponent) {
        "use strict";

        return Controller.extend("chobanii.controller.changelog", {
           
            onInit: function () {
                // var oRouter = this.getRouter();
                // if (oRouter) {
                //     oRouter.attachRoutePatternMatched(this.onRouteMatched, this);
                // }
            },
            onBack:function()
            {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("uploadPage");
            }
        });
    });
    