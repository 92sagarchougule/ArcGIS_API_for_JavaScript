// Author : Sagar Chougule

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/BasemapToggle",
    "esri/widgets/Popup",
    "esri/widgets/Legend",
    "esri/widgets/ScaleBar",
    "esri/widgets/LayerList",
    "esri/widgets/Zoom",
    "esri/widgets/Compass",
  ], function (Map, MapView, FeatureLayer, BasemapToggle, Popup, Legend, ScaleBar, LayerList, Zoom, Compass) {
    // Create a new map
    var map = new Map({
      basemap: "streets", // You can change the basemap to other options like "satellite", "topo", etc.
    });

    // Create a new map view centered at a specific location and zoom level
    var view = new MapView({
      container: "viewDiv",
      map: map,
      center: [82, 22], // Longitude, Latitude
      zoom: 5,
    });

    // Create a FeatureLayer with the specified URL
    var featureLayer = new FeatureLayer({
      url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Earthquakes_Since1970/FeatureServer/0",
      outFields: ["*"], // Fetch all available fields
      popupTemplate: {
        title: "Earthquake Information",
        content: "{name}: Magnitude {magnitude} on {date_}"
      },
    });

    // Add the FeatureLayer to the map
    map.add(featureLayer);

    // Create a BasemapToggle widget
    var basemapToggle = new BasemapToggle({
      view: view,
      nextBasemap: "hybrid", // You can change the next basemap to other options
    });

    // Add the BasemapToggle widget to the view
    view.ui.add(basemapToggle, "top-right");

    // Create a Popup widget
    var popup = new Popup({
      view: view,
    });

    // Add the Popup widget to the view
    view.ui.add(popup, "top-right");

    // Create a Legend widget
    var legend = new Legend({
      view: view,
    });

    // Add the Legend widget to the view
    view.ui.add(legend, "bottom-right");

    // Create a ScaleBar widget
    var scaleBar = new ScaleBar({
      view: view,
    });

    // Add the ScaleBar widget to the view
    view.ui.add(scaleBar, "bottom-left");

    // Create a LayerList widget
    var layerList = new LayerList({
      view: view,
    });

    // Add the LayerList widget to the view
    view.ui.add(layerList, "top-left");

    // Create a Zoom widget
    var zoom = new Zoom({
      view: view,
    });

    // // Add the Zoom widget to the view
    // view.ui.add(zoom, "top-left");

    // Create a Compass widget
    var compass = new Compass({
      view: view,
    });

    // Add the Compass widget to the view
    view.ui.add(compass, "top-left");
  });