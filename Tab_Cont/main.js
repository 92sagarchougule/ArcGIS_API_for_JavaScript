var map;

      require(["esri/map", "dojo/domReady!"], function(Map) {
        map = new Map("map", {
          basemap: "topo-vector",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
          center: [80, 22], // longitude, latitude
          zoom: 5
        });
      });