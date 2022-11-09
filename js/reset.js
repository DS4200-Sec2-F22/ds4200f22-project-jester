import { svg, NETWORKFRAME } from "../js/main.js";

function resetButtonClicked() {
  svg.selectAll("*").remove();
  NETWORKFRAME.selectAll("*").remove();
}



document.getElementById("reset").addEventListener("click", resetButtonClicked);
