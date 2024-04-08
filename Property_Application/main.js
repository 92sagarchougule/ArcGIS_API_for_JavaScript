// Developer : Sagar Chougule | sagar4gis@gmail.com

// Variable
var fc_layer, print, legend, folder_Name;

// Function to refresh the application
function refreshPage() {
  window.location.reload();
}

require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Print",
  "esri/widgets/Legend",
  "esri/widgets/LayerList",
  "esri/widgets/ScaleBar",
  "esri/widgets/Sketch",
  "esri/Graphic",
  "esri/geometry/geometryEngine",
  "esri/views/draw/Draw",
  "esri/layers/GraphicsLayer",
  "esri/geometry/support/webMercatorUtils",
  "esri/widgets/BasemapGallery",
], (
  Map,
  MapView,
  FeatureLayer,
  Print,
  Legend,
  LayerList,
  ScaleBar,
  Sketch,
  Graphic,
  geometryEngine,
  Draw,
  GraphicsLayer,
  webMercatorUtils,
  BasemapGallery
) => {
  /* code goes here */

  // Main Map Code -------------------
  var map = new Map({
    basemap: "streets-vector",
  });

  // View of Map -------------------
  view = new MapView({
    container: "viewDiv",
    map: map,
    center: [0, 15],
    zoom: 2,
  });

  // Select Drop Down Activities -------------------------------------------------------------------------------------------------------------------------------------
  // Get Folder List from ArcGIS Server api  ----------------------------------------------------------------------------------------------------------------------------------------
  var url = "https://services6.arcgis.com/F7QOvKuSY1sCek45/ArcGIS/rest/services?f=pjson";
  
  var xhttp = new XMLHttpRequest();
  xhttp.responseType = "json";
  // Use 'GET' instead of 'get'
  xhttp.open("GET", url, true); // Add 'true' for asynchronous request
  xhttp.send(); // No need to pass null for a GET request
  xhttp.onload = function () {
    if (xhttp.status == 200) {
      // Check the status, not the response                                                
      //console.log(xhttp.response.folders[0]);
      let select = document.getElementById("folder");
      let folder = xhttp.response.services;
      //console.log(folder);
      let a = 0;
      for (let val of folder) {
        var option = document.createElement("option");
        let b = (a += 1);
        option.value = b;
        option.text = val.name;
        select.appendChild(option);
      }
      map.remove(fc_layer);
    } else {
      console.error("Error:", xhttp.status);
    }
  };
  xhttp.onerror = function () {
    console.error("Network error");
  };








  // onchange function for services  ----------------------------------------------------------------------------------------------------------------------------------------
  document.getElementById("folder").onchange = function () {
    // code goes here
    document.getElementById("Service").value = 0;
    var folderSelect = document.getElementById("folder");
    folder_Name = folderSelect.options[folderSelect.selectedIndex].text;

    var url ="https://services6.arcgis.com/F7QOvKuSY1sCek45/ArcGIS/rest/services/" + folder_Name + "/FeatureServer?f=pjson";

    // console.log(url);

    var xhttp = new XMLHttpRequest();
    xhttp.responseType = "json";
    xhttp.open("GET", url, true);
    xhttp.send();
    xhttp.onload = function () {
      if (xhttp.status == 200) {
        // console.log(xhttp.response.layers);
        let select = document.getElementById("Service");
        // Clear existing options before adding new ones
        select.innerHTML = '<option value="0">Select Service</option>';
        // Iterate over services and add options to the dropdown
        xhttp.response.layers.forEach(function (service, index) {
          // if (service.type == "FeatureServer") {
            var option = document.createElement("option");
            option.value = index + 1; // Assuming you want the index as the value
            option.text = service.name;
            select.appendChild(option);
          // }
        });
        
      } else {
        console.error("Error:", xhttp.status);
      }
    };

    xhttp.onerror = function () {
      console.error("Network error");
    };
  };

  // onchange function for layers ----------------------------------------------------------------------------------------------------------------------------------------
  document.getElementById("Service").onchange = function () {

    var Layer_value = document.getElementById("Layer").value;

    var ServiceSelect = document.getElementById("folder");
    var Service = ServiceSelect.options[ServiceSelect.selectedIndex].text; // Corrected variable name
    //console.log(Service_Name);
    map.remove(fc_layer);
    // var LayerSelect = document.getElementById("Layer");
    // var Layer_Name = LayerSelect.options[LayerSelect.selectedIndex].text; // Corrected variable name
    
    var xhttp = new XMLHttpRequest();
    xhttp.responseType = "json";

    xhttp.open("GET", url);
    xhttp.send();

    xhttp.onload = function () {
      if (xhttp.status == 200) {

          url = "https://services6.arcgis.com/F7QOvKuSY1sCek45/arcgis/rest/services/"+Service+"/FeatureServer/"+Layer_value;
          
          console.log(url);
        fc_layer = new FeatureLayer({
          // URL to the service
          url: url,
          popupTemplate: {
            // Function to generate dynamic content for the popup
            content: function (feature) {
              // Initialize an empty string to store the popup content
              let popupContent = "";
              // Get the attributes of the feature
              const attributes = feature.graphic.attributes;
              // Iterate through each attribute in the feature
              for (const attribute in attributes) {
                // Append the attribute name and its value to the popup content
                popupContent += `<b>${attribute} : </b> ${attributes[attribute]}<br>`;
              }
              // Return the constructed popup content
              return popupContent;
            },
          },
        });

        map.add(fc_layer);
        // Wait for the layer view to be loaded
        view.whenLayerView(fc_layer).then(function (layerView) {
          // Get the extent of the layer
          var layerExtent = fc_layer.fullExtent || fc_layer.extent;

          // Zoom to the extent of the layer
          view.goTo(layerExtent);
        });

        buffer(fc_layer);
        // document.getElementById("intersect").addEventListener("click", findIntersect);
        document.getElementById("bufferButton").style.display = "block";
      } else {
        console.error("Error:", xhttp.status);
      }
    };

    xhttp.onerror = function () {
      console.error("Network error");
    };
  };

  // onchange function for layers ----------------------------------------------------------------------------------------------------------------------------------------
  // document.getElementById("Layer").onchange = function () {
  //   map.remove(fc_layer);

  //   var ServiceSelect = document.getElementById("Service");
  //   var Service_Name = ServiceSelect.options[ServiceSelect.selectedIndex].text; // Corrected variable name
  //   //console.log(Service_Name);
  //   var LayerSelect = document.getElementById("Layer");
  //   var Layer_Name = LayerSelect.options[LayerSelect.selectedIndex].text; // Corrected variable name
  //   var Layer_value = document.getElementById("Layer").value;

  //   var url =
  //     "https://sampleserver6.arcgisonline.com/arcgis/rest/services/" +
  //     Service_Name +
  //     "/FeatureServer/" +
  //     Layer_value;

  //   var xhttp = new XMLHttpRequest();
  //   xhttp.responseType = "json";
  //   xhttp.open("GET", url);
  //   xhttp.send();

  //   xhttp.onload = function () {
  //     if (xhttp.status == 200) {
  //       let select = document.getElementById("Layer");
  //       let fc_layer = xhttp.response;
  //       //console.log(fc_layer);

  //       url = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/" + Service_Name + "/FeatureServer/" + Layer_value;


  //         // url = "https://services6.arcgis.com/F7QOvKuSY1sCek45/arcgis/rest/services/Property_Map/FeatureServer/1";

  //       fc_layer = new FeatureLayer({
  //         // URL to the service
  //         url: url,
  //         popupTemplate: {
  //           // Function to generate dynamic content for the popup
  //           content: function (feature) {
  //             // Initialize an empty string to store the popup content
  //             let popupContent = "";

  //             // Get the attributes of the feature
  //             const attributes = feature.graphic.attributes;

  //             // Iterate through each attribute in the feature
  //             for (const attribute in attributes) {
  //               // Append the attribute name and its value to the popup content
  //               popupContent += `<b>${attribute} : </b> ${attributes[attribute]}<br>`;
  //             }

  //             // Return the constructed popup content
  //             return popupContent;
  //           },
  //         },
  //       });

  //       map.add(fc_layer);
  //       // Wait for the layer view to be loaded
  //       view.whenLayerView(fc_layer).then(function (layerView) {
  //         // Get the extent of the layer
  //         var layerExtent = fc_layer.fullExtent || fc_layer.extent;

  //         // Zoom to the extent of the layer
  //         view.goTo(layerExtent);
  //       });

  //       buffer(fc_layer);
  //       // document.getElementById("intersect").addEventListener("click", findIntersect);


  //       document.getElementById("bufferButton").style.display = "block";
  //       // document.getElementById('distance').style.display = "block";
  //       // document.getElementById('distance_num').style.display = "block";
  //     } else {
  //       console.error("Error:", xhttp.status);
  //     }
  //   };
  //   xhttp.onerror = function () {
  //     console.error("Network error");
  //   };
  // };




  // add other layers

            // var fc_layer_1 = new FeatureLayer({
            //   // URL to the service
            //   url: url = "https://services6.arcgis.com/F7QOvKuSY1sCek45/arcgis/rest/services/Property_Map/FeatureServer/1",
            //   popupTemplate: {
            //     // Function to generate dynamic content for the popup
            //     content: function (feature) {
            //       // Initialize an empty string to store the popup content
            //       let popupContent = "";
    
            //       // Get the attributes of the feature
            //       const attributes = feature.graphic.attributes;
    
            //       // Iterate through each attribute in the feature
            //       for (const attribute in attributes) {
            //         // Append the attribute name and its value to the popup content
            //         popupContent += `<b>${attribute} : </b> ${attributes[attribute]}<br>`;
            //       }
    
            //       // Return the constructed popup content
            //       return popupContent;
            //     },
            //   },
            

            // });

            

            // var fc_layer_2 = new FeatureLayer({
            //   // URL to the service
            //   url: url = "https://services6.arcgis.com/F7QOvKuSY1sCek45/arcgis/rest/services/Property_Map/FeatureServer/0",

            // });

           



            // var fc_layer_3 = new FeatureLayer({
            //   // URL to the service
            //   url: url = "https://services6.arcgis.com/F7QOvKuSY1sCek45/arcgis/rest/services/Property_Map/FeatureServer/2",

            //   //"https://services6.arcgis.com/F7QOvKuSY1sCek45/ArcGIS/rest/services/Property_Map/FeatureServer/1/query?where=Ow_Name+%3D+%27Reshma+sanakal%27&quantizationParameters=&sqlFormat=none&f=pgeojson&token="


            // });


            // map.add(fc_layer_1, fc_layer_2, fc_layer_3)
            



  // Select Drop down completed -----------------------------------------------------------------------------------------------------------------------------------------
  var sketch = new Sketch({
    view: view,
    layer: new GraphicsLayer(),
    availableCreateTools: ["point", "polyline", "polygon"],
  });

  view.ui.add(sketch, "top-right");

  // Store drawn geometries
  var drawnGraphics = [];

  // Listen to the create event to get the geometry drawn by the user
  sketch.on("create", function (event) {
    if (event.state === "complete") {
      // Add the drawn graphic to the view
      view.graphics.add(event.graphic);
      drawnGraphics.push(event.graphic);
    }
  });

  // Function to export drawn geometries as Shapefile
  document.getElementById("exportButton").onclick = function () {
    if (drawnGraphics.length === 0) {
      alert("No geometries to export.");
      return;
    }

    // Convert drawn geometries to WGS84 coordinates
    var geometriesWGS84 = drawnGraphics.map(function (graphic) {
      if (graphic.geometry.spatialReference.isWebMercator) {
        return webMercatorUtils.webMercatorToGeographic(graphic.geometry);
      }
      return graphic.geometry;
    });

    // Prepare features for SHP writer
    var features = geometriesWGS84.map(function (geometry) {
      return {
        type: "Feature",
        geometry: geometry.toJSON(),
        properties: {},
      };
    });

    // Create shapefile content
    var shpContent = {
      type: "FeatureCollection",
      features: features,
    };

    // Convert shapefile content to Blob
    var blob = new Blob([JSON.stringify(shpContent)], {
      type: "application/json",
    });

    // Save Blob as file (Note: This would be sent to the server instead in a real application)
    saveAs(blob, "drawn_geometries.geojson");
  };

  sketch.visible = false;

  document.getElementById("enableExport").onclick = function () {
    if (sketch.visible) {
      sketch.visible = false;
    } else {
      sketch.visible = true;
    }
  };

  // Onclick Buffer -------------------------------------------------------------------------------------------------------

      // // Get the color input element
      // var colorInput = document.getElementById("favcolor");

      // // Add an event listener to listen for changes in the color input
      // colorInput.addEventListener("input", function() {
      //     // Get the value of the color input
      //     var colorValue = colorInput.value;

      //     // Convert the hexadecimal color value to RGB
      //     var rgbValue = hexToRgb(colorValue);

      //     // Log the RGB value
      //     console.log("RGB Value: " + rgbValue);
      // });

      // // Function to convert hexadecimal color to RGB
      // function hexToRgb(hex) {
      //     // Remove '#' if present
      //     hex = hex.replace('#', '');

      //     // Convert to RGB
      //     var r = parseInt(hex.substring(0, 2), 16);
      //     var g = parseInt(hex.substring(2, 4), 16);
      //     var b = parseInt(hex.substring(4, 6), 16);

      //     // Return RGB value
      //     return 'rgb(' + r + ', ' + g + ', ' + b + ')';
      // }

      



  function buffer(fc_layer) {

    // var color = document.getElementById("favcolor").value;

    //   console.log(color);

    document.getElementById("bufferButton").onclick = function () {
      // Define buffer distance in meters
      const bufferDistance = document.getElementById("distance").value;
      // Query all features from the feature layer
      fc_layer.queryFeatures().then(function (response) {
        // Extract geometry from the response
        const features = response.features.map(function (feature) {
          return feature.geometry;
        });

        // Perform buffer operation on the geometries
        var bufferedGeometries = features.map(function (geometry) {
          // Perform buffer operation
          return geometryEngine.geodesicBuffer(
            geometry,
            bufferDistance,
            "meters"
          );
        });
        // Create graphics for the buffered geometries
        var buffergraphics = bufferedGeometries.map(function (geometry) {
          return new Graphic({
            geometry: geometry,
            symbol: {
              type: "simple-fill",
              //style: "cross",
              color: [0, 255, 0, .3], //document.getElementById("favcolor").value
              outline: {
                color: [0, 0, 0],
                width: 0.9,
              },
            },
          });
        });

        // Clear existing buffer graphics
        view.graphics.removeAll();

        // Add buffered graphics to the view
        view.graphics.addMany(buffergraphics);
      });
    };
  }







    document.getElementById("intersect").onclick = function () {
        // Query all features from the feature layer
        fc_layer.queryFeatures().then(function (response) {
            // Extract geometry from the response
            const features = response.features.map(function (feature) {
                return feature.geometry;
            });

            // Perform intersection operation
            var intersectedGeometry = geometryEngine.intersect(features);

            // Create graphic for the intersected geometry
            var intersectedGraphic = new Graphic({
                geometry: intersectedGeometry,
                symbol: {
                    type: "simple-fill",
                    color: [0, 255, 0, .5], // Green color for intersection
                    outline: {
                        color: [0, 0, 0],
                        width: 0.9,
                    },
                },
            });

            // Clear existing graphics
            view.graphics.removeAll();

            // Add intersected graphic to the view
            view.graphics.add(intersectedGraphic);
        });
    };


















  // Add all widgets to the view  ------------------------------------------------------------------------------------------------------

  const basemapGallery = new BasemapGallery({
    view: view,
    visible: false,
  });

  // Add the widget to the bottom-left corner of the view
  view.ui.add(basemapGallery, {
    position: "bottom-left",
  });

  // Toggle Basemap Gallery visibility based on button click
  document.getElementById("basemapGalleryButton").onclick = function () {
    if (basemapGallery.visible) {
      basemapGallery.visible = false;
    } else {
      basemapGallery.visible = true;
    }
  };

  view.on("click", function (event) {
    // event is the event handle returned after the event fires.
    //console.log(event.mapPoint);
  });

  legend = new Legend({
    view: view,
  });
  view.ui.add(legend, "bottom-right");

  let layerList = new LayerList({
    view: view,
  });
  // Adds widget below other elements in the top left corner of the view
  view.ui.add(layerList, {
    position: "top-right",
  });

  let scaleBar = new ScaleBar({
    view: view,
  });
  // Add widget to the bottom left corner of the view
  view.ui.add(scaleBar, {
    position: "bottom-left",
  });
  // renders the legend in the classic layout
});
