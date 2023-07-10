
  //require(["esri/map"], function(Map) { });
  var map;
  require(["esri/map", "esri/dijit/Scalebar", "esri/layers/FeatureLayer"], function(Map, Scalebar, FeatureLayer) {
    map = new Map("map", {
      basemap: 'hybrid', //"topo-vector",
      center: [75, 20],
      zoom: 17
    });2


    // Carbon storage of trees in Warren Wilson College.
    var fcLayer = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0"
    const url = "https://services.myserver.com/lidGgNLxw9LL0SbI/ArcGIS/rest/services/Hydrography/Watershed173811/FeatureServer/1/1?f=pjson"
    var featureLayer = new FeatureLayer(url);

    map.addLayer(featureLayer);

    var scalebar = new Scalebar({
        map: map,
        // "dual" displays both miles and kilometers
        // "english" is the default, which displays miles
        // use "metric" for kilometers
        scalebarUnit: "metric"
      });
  
  });

  