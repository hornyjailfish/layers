// Importing necessary modules from esm, a CDN for NPM packages that provides ES Module versions of the packages
import { Collection, Map, View } from "https://esm.sh/ol?dts";
import { click } from "https://esm.sh/ol/events/condition.js?dts";
import { Vector as VectorLayer } from "https://esm.sh/ol/layer?dts";
import { Vector as VectorSource } from "https://esm.sh/ol/source?dts";
import { Fill, Stroke, Style } from "https://esm.sh/ol/style?dts";

import {
  defaults as defaultIntegrations,
  Select,
} from "https://esm.sh/ol/interaction.js?dts";

import GeoJSON from "https://esm.sh/ol/format/GeoJSON?dts";
import { Control } from "https://esm.sh/v135/ol@9.2.4/control?dts";
import LayerSwitcher from "https://cdn.jsdelivr.net/npm/ol-layerswitcher/+esm";
const wall_style = new Style({
  stroke: new Stroke({
    color: "rgba(128, 69, 200, 0.8)",
    width: 3,
  }),
  fill: new Fill({
    color: "rgba(255, 255, 255, 1)",
  }),
  zIndex: 50,
});

const inner_style = new Style({
  stroke: new Stroke({
    color: "rgba(0, 200, 200, 0.6)",
    width: 2,
  }),
  fill: new Fill({
    color: "rgba(0, 200, 200, 1)",
  }),
  zIndex: 1,
});

const wall = new VectorLayer({
  className: "walls",
  source: new VectorSource({
    url: "static/shared_walls.geojson",
    format: new GeoJSON(),
  }),
  style: function (feature) {
    return wall_style;
  },
});

import { lvls } from "./create_map.js";

const indoor_layers = new Collection();
const wall_layers = new Collection();

const indoor_lvl1 = new VectorSource({
  url: "static/1shops.geojson",
  format: new GeoJSON(),
});
const indoor_lvl0 = new VectorSource({
  url: "static/-1shops.geojson",
  format: new GeoJSON(),
});
const indoor_lvl2 = new VectorSource({
  url: "static/2shops.geojson",
  format: new GeoJSON(),
});

const lvl1 = new VectorLayer({
  className: "level1",
  source: indoor_lvl1,
  style: function (feature) {
    return inner_style;
  },
});
const lvl0 = new VectorLayer({
  className: "level0",
  source: indoor_lvl0,
  style: function (feature) {
    return inner_style;
  },
});
const lvl2 = new VectorLayer({
  className: "level2",
  source: indoor_lvl2,
  style: function (feature) {
    return inner_style;
  },
});

// indoor_layers.push(lvl0);
// indoor_layers.push(lvl1);
// indoor_layers.push(lvl2);
const levels = await lvls;
// console.log(levels)
const selected = new Collection();
const select_interation = new Select({
  multi: false,
  layers: levels,
  condition: click,
  style: null,
  // filter: function (feature, layer) {
  //   // Only select features of the 'indoorLayer'
  //   return layer === indoorLayer;
  // },
  features: selected,
});

// const selectedLayer = new VectorLayer({
//   className: "selected",
//   source: select_interation.getFeatures(),
//   style: function (feature) {
//     return inner_style;
//   },
// });
// I add this to window because it ez to debug
window.rio = new Map({
  target: "canvas",
  layers: [levels],
  view: new View({
    center: [
      4166564.476494392,
      7536835.574061215,
    ],
    // ok'ish zoom level
    minZoom: 6,
    zoom: 7,
    maxZoom: 10,
    // Bound box of view
    extent: [
      -20037508.342789244,
      -20037508.342789244,
      20037508.342789244,
      20037508.342789244,
    ],
  }),
  // interactions: defaultIntegrations().extend([select_interation]),
});

const layerSwitcher = new LayerSwitcher({
  tipLayer: "Base",
  activationMode: "click",
  startActive: true,
  groupSelectStyle: "group",
  // reverse: true,
});

import { ArrowsControl } from "./controls.js";
window.rio.addControl(layerSwitcher);

const arrows = new ArrowsControl(window.rio);

window.rio.addControl(arrows);
// window.rio.addInteraction(select_interation);

// select_interation.on("select", function (e) {
//   e.deselected.forEach((f) => {
//     // INFO: this triggers when selection is cleared
//     f.setStyle(null);
//   });
//
//   e.selected.forEach((f) => {
//     f.setStyle(inner_style);
//     const size = window.rio.getSize();
//     size[0] /= 2;
//     size[1] /= 2;
//     const view = window.rio.getView();
//     window.rio.updateSize();
//     view.fit(f.getGeometry().getExtent(), {
//       size: size,
//       constrainResolution: true,
//       duration: 750,
//       padding: [20, 200, 20, 20], // INFO: [t,r,b,l] padding right because of search sidebar
//       maxZoom: 19,
//       callback: function (rdy) {
//         // INFO: htmx request fires only after animation done
//         if (rdy) {
//           htmx.ajax(
//             "GET",
//             "/search?q=" + f.get("name"),
//             "div#search-result",
//           )
//             .then(() => {
//               w3_open(); // open sidebar after request
//             });
//         }
//       },
//     });
//     window.rio.updateSize();
//   });
// });
//
