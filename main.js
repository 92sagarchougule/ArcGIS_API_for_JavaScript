require(['esri/Map','esri/views/MapView','esri/layers/FeatureLayer', 'esri/widgets/AreaMeasurement2D', 'esri/widgets/Editor', 'esri/widgets/FeatureTable', 'esri/widgets/Popup'],
    function(Map, MapView, FeatureLayer, AreaMeasurement2D, Editor, FeatureTable, Popup){
    var map = new Map({
        basemap:'topo-vector',
        ground: "world-elevation"
    })

    var mapview = new MapView({
        map:map,
        container:'mapview',
        center:[-80,30],
        zoom:6       
    });


    // var view = new MapView({
    //     map:map,
    //     container:'mapview1',
    //     center:[-80,30],
    //     zoom:6       
    // });
    


    // const mesurementool = new AreaMeasurement2D({
    //     view:mapview,
        
    // });

    // mapview.ui.add(mesurementool,'top-right');


    // const editor = new Editor({
    //     view: mapview
    // })

    // mapview.ui.add(editor, 'bottom-left')

    
// Templete for popup

    const templet = {

        title:"Popup for Feature : ",

        content:
        [
            {

            type:"fields",

            fieldInfos:[
            {
                fieldName:"AREANAME",
                label:"Place"
            },
            {
                fieldName:"CLASS",
                label:"Class"
            },
            {
                fieldName:"CAPITAL",
                label:"Capital"
            },
            {
                fieldName:"ST",
                label:"St"
            },
            {
                fieldName:"POP2000",
                label:"Population"
            }
            
        ]
        }
    ]
    }

    // console.log(templet.content);


// Featur Layer
    const fclayer = new FeatureLayer({
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0",
        popupTemplate: templet,
        objectIdField: "OBJECTID",
        // definitionExpression: "POP2000 <= '2000'"
    })


    fclayer.definitionExpression = "ST = 'AL' AND POP2000 <= '40000'"

    // fclayer.effect = [
    //     {
    //       scale: 36978595,
    //       value: "drop-shadow(3px, 3px, 4px)"
    //     },
    //     {
    //       scale: 18489297,
    //       value: "drop-shadow(2px, 2px, 3px)"
    //     },
    //     {
    //       scale: 4622324,
    //       value: "drop-shadow(1px, 1px, 2px)"
    //     }
    //   ];


    // fclayer.when(function(){
    //     mapview.extent = fclayer.fullExtent;
    //   });

    // fclayer.opacity = 0.5;
    // the layer will be refreshed every 6 seconds.
    // fclayer.refreshInterval = 0.1;


    // print out layer's relationship length and each relationship info to console


// all features in the layer will be visualized with
// a 6pt black marker symbol and a thin, white outline
        fclayer.renderer = {
            type: "simple",  // autocasts as new SimpleRenderer()
            symbol: {
            type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
            size: 8,
            color: "blue",
            outline: {  // autocasts as new SimpleLineSymbol()
                width: 1,
                color: "red"
            }
            }
        };

        // fclayer.screenSizePerspectiveEnabled = true


    map.add(fclayer);




    


  
// Featur Table
    const fctable = new FeatureTable({
        container:'fctable',
        layer:fclayer,
        relatedRecordsEnabled: true,
        view: mapview,
        spatialReference: { wkid: 4326 }
    });

    fctable.actionColumnConfig = {
        label: "Go to feature",
         icon: "zoom-to-object",
         callback: (params) => {
            mapview.goTo(params.feature);
       }
      }

    mapview.ui.add(fctable,'bottom');

    
    mapview.on('click',function(evt){
        // console.log(evt);
        // const query = {
        //     geometry: evt.mapPoint,
        //     spatialRelationship: 'intersects',
        //     outFields: ['*'],  // '*' means all fields; you can specify specific fields if needed
        //     returnGeometry: true,
        //     outSpatialReference: mapview.spatialReference
        // };

        // console.log(query);

        // Query the feature layer
            // fclayer.queryFeatures(query).then(function(response) {
            //     if (response.features.length < 0) {
            //         const feature = response.features[0];
            //         console.log(feature);
            //     }
                
            // })

    })
    


  

    
     



//    console.log(map.allLayers);

})