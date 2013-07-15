var mobileApp = {
    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        document.addEventListener("load", this.onLoad, false);
        document.addEventListener("deviceready", this.onDeviceReady, false);
        window.addEventListener("orientationchange", orientationChange, true);
    },
    
    onLoad: function() {
    },
    
    onDeviceReady: function() {
        //alert("onDeviceReady");
        angular.element(document).ready(function() {
            angular.bootstrap(document);
        });
    }
};