import { Control } from "https://esm.sh/ol/control?dts";
import { Map } from "https://esm.sh/ol?dts";

export class ArrowsControl extends Control {
  map;
  constructor(map) {
    let arrowRight = document.createElement("button");
    arrowRight.innerHTML = "&#8594;";
    let elem = document.createElement("div");
    elem.className = "right ol-control";
    elem.append(arrowRight);

    super({
      element: elem,
    });
    this.map = map;
    elem.addEventListener("click", this.handleRightArrow.bind(this), false);
  }

  handleRightArrow() {
    let center = this.map.getView().getCenter();
    this.map.getView().setCenter([
      center[0] + 100 * this.map.getView().getResolution(),
      center[1],
    ]);
  }
}
