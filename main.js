import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import {fromLonLat} from 'ol/proj';
import {toLonLat} from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {Fill, Stroke, Style, Text} from 'ol/style';
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Icon from "ol/style/Icon";
import {containsExtent} from 'ol/extent';
import Modify from "ol/interaction/modify";
import Translate from "ol/interaction/translate";

var iconStyle = new Style({
  image: new Icon({
    anchor: [0.5, 1],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    width: "38",
    height: "24",
    src: 'data/poi.png',
  }),
});

var vectorSource = new VectorSource({
});

var vectorLayer = new VectorLayer({
  source: vectorSource
});

var map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }) , vectorLayer ],
  target: 'map',
  view: new View({
    center: fromLonLat([14.28611, 48.30639]),
    zoom: 14,
  }),
});

var modify = new Modify({
  source: vectorSource
});

var translate = new Translate({
  source: vectorSource
});

map.addInteraction(translate);

map.on('click', function(evt){
    // Get the pointer coordinate
    //let coordinate = toLonLat(evt.coordinate);
  var picker = new Feature({
    geometry: new Point(evt.coordinate)
  });
  picker.setStyle(iconStyle);
  picker.on('change',function(){
    checkFeatures();
  },picker);
  vectorSource.clear();
  vectorSource.addFeature(picker);
  triggerCallback();
});

function checkFeatures() {
  var mapExt = map.getView().calculateExtent(map.getSize());
  vectorSource.forEachFeature(function(fea) {
    var feaExt = fea.getGeometry().getExtent();
    if (!containsExtent(mapExt, feaExt)) {
      vectorSource.removeFeature(fea)
      triggerCallback();
    }
  });
}

map.on('moveend', function(evt){
  if (map!=null) {
    checkFeatures();
  }
});

function triggerCallback() {
  if (vectorSource.getFeatures().length>0) {
    document.dispatchEvent(new Event('pickerSet'));
  } else {
    document.dispatchEvent(new Event('pickerUnset'));
  }
}

export var picker = {
  getLocation : function() {
    return getPickerLocation();
  },
  isSet: function() {
    return (vectorSource.getFeatures().length>0);
  },
  setCenter: function(lat,lon) {
    map.getView().setCenter(fromLonLat([lon, lat]));
  }
};

function getPickerLocation() {
  var feas = vectorSource.getFeatures();
  if (feas.length>0) {
    var pt =  feas[0].getGeometry().getCoordinates();
    var lonLat = toLonLat(pt);
    return lonLat[1]+","+lonLat[0];
  } else {
    return "";
  }
}