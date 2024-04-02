var fc_layer, print, legend, folder_Name;

// Function to refresh the page
function refreshPage() {
    window.location.reload();
}


require(["esri/Map","esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/Print", "esri/widgets/Legend", "esri/widgets/LayerList", "esri/widgets/ScaleBar" ], (Map, MapView, FeatureLayer, Print, Legend, LayerList, ScaleBar) => { /* code goes here */ 


    var map = new Map({
        basemap: "streets-vector"
    });

    view = new MapView({
        container: "viewDiv",
        map:map,
        center: [0, 0],
        zoom: 2
    });






    // Folder api  ----------------------------------------------------------------------------------------------------------------------------------------
    var url = "https://sampleserver6.arcgisonline.com/arcgis/rest/services?f=pjson";
    var xhttp = new XMLHttpRequest();
    xhttp.responseType = 'json';
    // Use 'GET' instead of 'get'
    xhttp.open("GET", url, true);  // Add 'true' for asynchronous request
    xhttp.send();  // No need to pass null for a GET request
    xhttp.onload = function() {
        if (xhttp.status == 200) {  // Check the status, not the response                                                nnnnnnmmmmmmmmmm                                                                                                                                                                
            //console.log(xhttp.response.folders[0]);
            let select = document.getElementById('folder');
            let folder = xhttp.response.folders;
            let a = 0
            for (let val of folder){
                var option = document.createElement('option');
                let b = a+=1
                option.value = b;
                option.text = val;
                select.appendChild(option);
            }

            map.remove(fc_layer);
        } else {
            console.error('Error:', xhttp.status);
        }
    };
    xhttp.onerror = function() {
        console.error('Network error');
    };





    // onchange function for services  ----------------------------------------------------------------------------------------------------------------------------------------
    document.getElementById('folder').onchange = function () {
        // code goes here
        document.getElementById('Service').value = 0;
        var folderSelect = document.getElementById('folder');
         folder_Name = folderSelect.options[folderSelect.selectedIndex].text;
        //console.log(folder_Name);
    
        var url = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/" + folder_Name + "?f=pjson";

        // console.log(url);

        var xhttp = new XMLHttpRequest();
        xhttp.responseType = 'json';
    
        xhttp.open("GET", url, true);
        xhttp.send();
    
        xhttp.onload = function () {
            if (xhttp.status == 200) {
                //console.log(xhttp.response.services);
    
                let select = document.getElementById('Service');
    
                // Clear existing options before adding new ones
                select.innerHTML = '<option value="0">Select Service</option>';
    
                // Iterate over services and add options to the dropdown
                xhttp.response.services.forEach(function (service, index) {
                    if(service.type == "FeatureServer"){
                        var option = document.createElement('option');
                        option.value = index + 1; // Assuming you want the index as the value
                        option.text = service.name;
                        select.appendChild(option);
                    }
                });
            } else {
                console.error('Error:', xhttp.status);
            }
        };
    
        xhttp.onerror = function () {
            console.error('Network error');
        };
    };






    

    // onchange function for layers ----------------------------------------------------------------------------------------------------------------------------------------
    document.getElementById('Service').onchange = function () {   
        //document.getElementById('Service').value = 0;
        var ServiceSelect = document.getElementById('Service');
        var Service_Name = ServiceSelect.options[ServiceSelect.selectedIndex].text; // Corrected variable name
        //console.log(Service_Name);

       

        var url  = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/"+ Service_Name + "/FeatureServer?f=pjson";
        //console.log(url);
        var xhttp = new XMLHttpRequest();
        xhttp.responseType = 'json';
    
        xhttp.open("GET", url);
        xhttp.send();
    
        xhttp.onload = function () {
            if (xhttp.status == 200) {
                //console.log(xhttp.response);
    
                let select = document.getElementById('Layer');
                let Layers = xhttp.response.layers;
                //console.log(Layers);
                
                //Clear existing options before adding new ones
                select.innerHTML = '<option value="0">Select Layer</option>';
                for (let layer of Layers) {
                    var option = document.createElement('option');
                    option.value = layer.id;
                    option.text = layer.name;
                    select.appendChild(option);
                }
            } else {
                console.error('Error:', xhttp.status);
            }
        };
    
        xhttp.onerror = function () {
            console.error('Network error');
        };
    };









    // onchange function for layers ----------------------------------------------------------------------------------------------------------------------------------------
    document.getElementById('Layer').onchange = function () {

        map.remove(fc_layer);

        var ServiceSelect = document.getElementById('Service');
        var Service_Name = ServiceSelect.options[ServiceSelect.selectedIndex].text; // Corrected variable name
        //console.log(Service_Name);


        var LayerSelect = document.getElementById('Layer');
        var Layer_Name = LayerSelect.options[LayerSelect.selectedIndex].text; // Corrected variable name
        var Layer_value = document.getElementById('Layer').value;
        //console.log(Layer_Name);

        var url  = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/"+ Service_Name +"/FeatureServer/"+Layer_value;

        // console.log(url);

        //console.log(url);
        var xhttp = new XMLHttpRequest();
        xhttp.responseType = 'json';
    
        xhttp.open("GET", url);
        xhttp.send();
    
        xhttp.onload = function () {
            if (xhttp.status == 200) {
                //console.log(xhttp.response);
    
                let select = document.getElementById('Layer');
                let fc_layer = xhttp.response;
                //console.log(fc_layer);
                
                url =  "https://sampleserver6.arcgisonline.com/arcgis/rest/services/"+ Service_Name +"/FeatureServer/"+Layer_value;

                fc_layer = new FeatureLayer({
                    // URL to the service
                    url: url,
                
                    popupTemplate: {
                        // Function to generate dynamic content for the popup
                        content: function(feature) {
                            // Initialize an empty string to store the popup content
                            let popupContent = '';
                
                            // Get the attributes of the feature
                            const attributes = feature.graphic.attributes;
                
                            // Iterate through each attribute in the feature
                            for (const attribute in attributes) {
                                // Append the attribute name and its value to the popup content
                                popupContent += `<b>${attribute} : </b> ${attributes[attribute]}<br>`;
                            }
                
                            // Return the constructed popup content
                            return popupContent;
                        }
                    }
                });
                
                map.add(fc_layer);



                // Wait for the layer view to be loaded
                view.whenLayerView(fc_layer).then(function(layerView) {
                    // Get the extent of the layer
                    var layerExtent = fc_layer.fullExtent || fc_layer.extent;
                
                    // Zoom to the extent of the layer
                    view.goTo(layerExtent);
                });




                



            } else {
                console.error('Error:', xhttp.status);
            }
        };
    
        xhttp.onerror = function () {
            console.error('Network error');
        };



       

       


    };


           









// Printing functionality ---------------------------------------------------------------

// print = new Print({
//     view: view,
//     // specify your own print service
//     printServiceUrl:"https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
//     visible:true,
//     expanded: false
//   }); 
  
  
//   // Adds widget below other elements in the top left corner of the view
//   // Adds widget below other elements in the top left corner of the view
// view.ui.add(print, "top-right");



view.on("click", function(event){
    // event is the event handle returned after the event fires.
    //console.log(event.mapPoint);
  });


  legend = new Legend({
    view: view
    })
        
  view.ui.add(legend, "bottom-right");


  let layerList = new LayerList({
    view: view
  });
  // Adds widget below other elements in the top left corner of the view
  view.ui.add(layerList, {
    position: "top-right"
  });


  let scaleBar = new ScaleBar({
    view: view
  });
  // Add widget to the bottom left corner of the view
  view.ui.add(scaleBar, {
    position: "bottom-left"
  });

  // renders the legend in the classic layout
  

});