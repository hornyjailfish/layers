import { Fill, Stroke, Style } from "https://esm.sh/ol/style?dts";
import { isStringColor } from "https://esm.sh/ol/color?dts";
import { Group, Vector as VectorLayer } from "https://esm.sh/ol/layer?dts";
import LayerGroup from "https://esm.sh/ol/layer/Group.js";
import { Vector as VectorSource } from "https://esm.sh/ol/source?dts";
import GeoJSON from "https://esm.sh/ol/format/GeoJSON?dts";

import { initDb, closeDb, getDb, json } from "./surreal.js";


const default_style = new Style({
  stroke: new Stroke({
    color: [69, 69, 69, 1],
    width: 2,
  }),
  // fill: null,
  fill: new Fill({
    color: [69, 69, 69, 0.3],
  }),
  // text: undefined,
  zIndex: 9999,
});

/**
@return ol.style.Style
@param {ol.color.Color} color
@param {number|undefined} stroke
  stroke width
**/
function setStyleColor(color, stroke) {
  if (!isStringColor(color)) color = default_style.getStroke().getColor();

  const style = default_style.clone();
  style.setFill(new Fill({ color: color }));
  style.setStroke(new Stroke({ color: color, width: stroke }));
  return style;
}

const styles = {
  walls: setStyleColor([255, 0, 0], 2),
  shops: setStyleColor([0, 255, 0]),
  markers: default_style.clone(),
};

// i think better have this separated and push to walls
const shared = {
  walls: "static/shared_walls.geojson",
  markers: {},
};
function add_shared_walls() {
  return new VectorLayer({
    type: "base",
    className: "map walls shared",
    // title: "wall",
    source: new VectorSource({
      url: shared.walls,
      format: new GeoJSON(),
    }),
    style: function(feature) {
      return styles.walls;
    },
  });
}

const layers = {
  level0: {
    walls: "static/-1w.geojson",
    shops: "static/-1shops.geojson",
    // markers: {},
  },
  level1: {
    walls: "static/1walls.geojson",
    shops: "static/1shops.geojson",
    // markers: {},
  },
  level2: {
    walls: "static/2walls.geojson",
    shops: "static/2shops.geojson",
    // markers: {},
  },
};

/**
 * @param {number} visible_by_default
 * what lvl showed at start
 */
async function load(visible_by_default) {
  // const levels = new Group({
  //   // A layer must have a title to appear in the layerswitcher
  //   title: "Base",
  //   // Adding a 'fold' property set to either 'open' or 'close' makes the group layer
  //   // collapsible
  //   fold: "open",
  //   combline: false,
  // layers: [
  const lvl0 = new LayerGroup({
    title: "-1 Этаж",
    fold: "close",
    visible: true,
    combine: false,
    // type: "base",
    layers: [
      new LayerGroup({
        title: "Group",
        fold: "close",
        visible: true,
        combine: false,
        layers: [
          // add_shared_walls(),
          new VectorLayer({
            title: "Walls",
            visible: true,
            type: "base",
            // opacity: 0.5,
            style: styles.walls,
            source: new VectorSource({
              url: layers.level0.walls,
              format: new GeoJSON(),
            }),
          }),
        ],
      }),
      new VectorLayer({
        // A layer must have a title to appear in the layerswitcher
        title: "Shops",
        visible: true,
        style: default_style,
        // opacity: 0.5,
        source: new VectorSource({
          url: layers.level0.shops,
          format: new GeoJSON(),
        }),
      }),
    ],
  });

  const lvl1 = new LayerGroup({
    title: "1 Этаж",
    fold: "close",
    combine: false,
    // type: "base",
    visible: false,
    layers: [
      // add_shared_walls(),
      new VectorLayer({
        title: "Walls",
        // visible: true,
        // type: "base",
        // opacity: 0.5,
        style: styles.walls,
        source: new VectorSource({
          url: layers.level1.walls,
          format: new GeoJSON(),
        }),
      }),
      new VectorLayer({
        // A layer must have a title to appear in the layerswitcher
        title: "Shops",
        // visible: true,
        style: default_style,
        // opacity: 0.5,
        source: new VectorSource({
          url: layers.level1.shops,
          format: new GeoJSON(),
        }),
      }),
    ],
  });

  const lvl2 = new LayerGroup({
    title: "2 Этаж",
    fold: "close",
    combine: false,
    // type: "base",
    visible: false,
    layers: [
      // add_shared_walls(),
      new VectorLayer({
        title: "Walls",
        // visible: false,
        type: "base",
        // opacity: 0.5,
        style: styles.walls,
        source: new VectorSource({
          url: layers.level2.walls,
          format: new GeoJSON(),
        }),
      }),
      new VectorLayer({
        // A layer must have a title to appear in the layerswitcher
        title: "Shops",
        // visible: false,
        style: default_style,
        // opacity: 0.5,
        source: new VectorSource({
          url: layers.level2.shops,
          format: new GeoJSON(),
        }),
      }),
    ],
  });

  const db_test = new VectorSource({
    format: new GeoJSON(),
    loader: async (extent, resolution, projection, success, failure) => {
      // const data = await db.query("select features from geo where id = geo:9u68tt9hfmnx83u2smv3");
      const body = await fetch("http://127.0.0.1:8000/key/geo", { method: "GET",  headers: {
        "Accept": "application/json",
        "NS": "ns",
        "DB": "db"
      }});
      const data = await body.json();
      const result = data[0].result;
      // const t = json(data);
      //
      // const data = await db.select("geo");

      const onError = function () {
        db_test.removeLoadedExtent(extent);
        failure();
      };

      const features = db_test.getFormat().readFeature(result[0]);
      features.setStyle(default_style);
      console.log(result,features);
      db_test.addFeatures(features);
      success(features);
    },
    // url: layers.level0.walls,
  });

  const db = await initDb();
  const test_loader = new VectorLayer({
    // title: "Walls",
    visible: true,
    // type: "base",
    // opacity: 0.5,
    style: styles.shops,
    source: db_test,
  });

  const levels = new LayerGroup({
    title: "Levels",
    fold: "close",
    combine: true,
    // type: "base",
    visible: true,
    layers: [test_loader,add_shared_walls()],
    // add_shared_walls(),
  });
  return levels;
}

export const lvls = load();
