/*Module.register("eMediPlan",{
    // Default module config.
    defaults: {
        text: "Sie haben keine Medikamente zu einnehmen."
    },
    defaults: {},
 
 
    loaded: function(callback) {
        this.finishLoading();
        Log.log(this.name + ' is loaded!');
        callback();
    },
 
    start: function() {
        this.mySpecialProperty = "So much wow!";
        Log.log(this.name + ' is started!');
        setInterval(function() {
            self.updateDom(); // no speed defined, so it updates instantly.
        }, 300000);
    },
 
    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.innerHTML = this.config.text;
        return wrapper;
    },
   
    getHeader: function() {
        return this.data.header + ' Foo Bar';
    }
 
});*/
 
'use strict';
 
Module.register("eMediPlan", {
 
  result: {},
  defaults: {
    prettyName: true,
    stripName: true,
    title: 'eMediPlan',
    url: 'private/eMediPlan.json',
    updateInterval: 300000,
    values: ["Medicaments", "Patient"]
  },
 
  start: function() {
    this.getStats();
    this.scheduleUpdate();
  },
 
  isEmpty: function(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key)) {
        return false;
      }
    }
 
    return true;
  },
 
  getDom: function() {
    var wrapper = document.createElement("ticker");
    wrapper.className = 'dimmed small';
 
    var data = this.result;
    var statElement =  document.createElement("header");
    var title = this.config.title;
//  statElement.innerHTML = title;
//  wrapper.appendChild(statElement);
 
    if (data && !this.isEmpty(data)) {
      var tableElement = document.createElement("table");
 
      var values = 0;
    //var values = this.config.values;
      if (values.length > 0) {
        for (var i = 0; i < values.length; i++) {
          var val = this.getValue(data, values[i]);
          if (val) {
            tableElement.appendChild(this.addValue(values[i], val));
          }
        }
      } else {
        for (var key in data) {
        console.log(key);
          if (data.hasOwnProperty(key) && key === "Medicaments") {
       
        for(var i = 0; i < data[key].length; i++){
                   
           
 
            var newString = ""
            newString += "Medicament: " + data[key][i].Id + "; ";
            newString += "Einheit: " + data[key][i].Unit + "; ";
            newString += "Grund: " + data[key][i].TkgRsn + "; ";
            newString += "Einnehmen am: ";
           
                if(data[key][i].Pos[0].D[0]== 1){
                    newString += "Morgen ";
                }  if(data[key][i].Pos[0].D[1] == 1){
                    newString += "Mittag ";
                }  if(data[key][i].Pos[0].D[2] == 1){
                    newString += "Abend ";
                }  if(data[key][i].Pos[0].D[3] == 1){
                    newString += "Nacht ";
                }
           
            if(data[key][i].Pos[0].D[0] == 0 && data[key][i].Pos[0].D[1] == 0 && data[key][i].Pos[0].D[2] == 0 && data[key][i].Pos[0].D[3] == 0){
                newString += "Keine Angaben ";
            }
           
            tableElement.appendChild(this.addValue(newString));
        }
          }
        }
      }
 
      wrapper.appendChild(tableElement);
    } else {
      var error = document.createElement("span");
      error.innerHTML = "Error fetching stats.";
      wrapper.appendChild(error);
    }
 
    return wrapper;
  },
 
  getValue: function(data, value) {
    if (data && value) {
      var split = value.split(".");
      var current = data;
      while (split.length > 0) {
        current = current[split.shift()];
      }
 
      return current;
    }
 
    return null;
  },
 
  addValue: function(value) {
    var row = document.createElement("tr");
/*  if (this.config.stripName) {
      var split = name.split(".");
      name = split[split.length - 1];
    }
 
    if (this.config.prettyName) {
      name = name.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
      name = name.split("_").join(" ");
*/ // name = name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  //}
    row.innerHTML = JSON.stringify(value);
    return row;
  },
 
  scheduleUpdate: function(delay) {
    var nextLoad = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay;
    }
 
    var self = this;
    setInterval(function() {
      self.getStats();
    }, nextLoad);
  },
 
  getStats: function () {
    this.sendSocketNotification('GET_STATS', this.config.url);
  },
 
  socketNotificationReceived: function(notification, payload) {
    if (notification === "STATS_RESULT") {
      this.result = payload;
      var fade = 500;
      console.log("fade: " + fade);
      this.updateDom(fade);
    }
  },
 
});
