
  //require(["esri/map"], function(Map) { });
  var map;
  require(["esri/map",
    "esri/dijit/Scalebar", 
    "esri/dijit/Popup", "esri/dijit/PopupTemplate",
    "esri/layers/FeatureLayer",
    "esri/symbols/SimpleFillSymbol", "esri/Color",
    "dojo/dom-class", "dojo/dom-construct", "dojo/on",
    "dojox/charting/Chart", "dojox/charting/themes/Dollar",
    "dojo/domReady!"
], function(Map, 
        Scalebar, 
        Popup, PopupTemplate,
        FeatureLayer,
        SimpleFillSymbol, Color,
        domClass, domConstruct, on,
        Chart, theme
        ) {


          var fill = new SimpleFillSymbol("solid", null, new Color("#A4CE67"));
          var popup = new Popup({
              fillSymbol: fill,
              titleInBody: false
          }, domConstruct.create("div"));
          //Add the dark theme which is customized further in the <style> tag at the top of this page
          domClass.add(popup.domNode, "dark");




    map = new Map("map", {
      basemap: 'topo-vector', //"topo-vector",
      center: [75, 20],
      zoom: 5,
      infoWindow: popup
    });


    // // Carbon storage of trees in Warren Wilson College.
   var fcLayer = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Earthquakes_Since1970/FeatureServer/0"
    // //const url = "https://services.myserver.com/lidGgNLxw9LL0SbI/ArcGIS/rest/services/Hydrography/Watershed173811/FeatureServer/1/1?f=pjson"
    // var featureLayer = new FeatureLayer(fcLayer,{
    //   outFields: ["*"] //make sure field to label is specified here in outFields
    // });
    var template = new PopupTemplate({
      title: "Earthquake",
      description: "Year : {year_}:  {num_deaths} No of Deaths",
      fieldInfos: [{ //define field infos so we can specify an alias
        fieldName: "latitude",
        label: "Entrants"
      },{
        fieldName: "longitude",
        label: "Starters"
      },{
        fieldName: "magnitude",
        label: "Finishers"
      }],
      mediaInfos:[{ //define the bar chart
        caption: "",
        type:"barchart",
        value:{
          theme: "Dollar",
          fields:["latitude","longitude","magnitude"]
        }
      }]
    });

    var featureLayer = new FeatureLayer(fcLayer,{
      mode: FeatureLayer.MODE_ONDEMAND,
      outFields: ["*"],
      infoTemplate: template
    });

    map.addLayer(featureLayer);

    var scalebar = new Scalebar({
        map: map,
        // "dual" displays both miles and kilometers
        // "english" is the default, which displays miles
        // use "metric" for kilometers
        scalebarUnit: "metric"
      });
  
  });

  