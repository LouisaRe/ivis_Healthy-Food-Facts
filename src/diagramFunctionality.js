
function getWidth(){
  const canvasWidth = window.innerWidth;
  const maxWidth = 1200;
  const minWidth = 860;

  if(canvasWidth > maxWidth){
    return maxWidth;
  }else if(canvasWidth < minWidth) {
    return minWidth - 2.8; //body padding (8)
  } else{
    return canvasWidth - 2*8; //body padding (8)
  }
}

function getHeight(){
  const canvasHeight = window.innerHeight/100*60;
  const maxHeight    = 600;
  const minHeight    = 600;

  if(canvasHeight > maxHeight){
    return maxHeight;
  }else if(canvasHeight < minHeight){
    return minHeight;
  }else{
    return canvasHeight;
  }
}

function getSvgWidth(idDiagramDiv){
  return document.getElementById(idDiagramDiv).offsetWidth;
}

function getSvgHeight(idDiagramDiv){
  return getHeight();
  //return document.getElementById(idDiagramDiv).offsetWidth / 1200 * 600;
}

// Slider functionality
//*****************************************************************

function createSliderGroup(idDiagramDiv){
  const sliderDivWidth = 93.5

  return d3.select("#" +  idDiagramDiv).append("div")
    .attr("class", "year-slider")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 sliderDivWidth " + getHeight())
    .attr("style",  "position      : relative; " +
                    "width         : " + sliderDivWidth + "px; " +
                    "height        : " + getSvgHeight(idDiagramDiv) + "px; " +
                    "margin-bottom : -" + getSvgHeight(idDiagramDiv) + "px;" +
                    "left          : calc(" + getSvgWidth(idDiagramDiv) + "px - " + sliderDivWidth +"px); " +
                    "top           : calc(" + - getSvgHeight(idDiagramDiv) + "px - " + 8 +"px); " +
                    "background    : transparent;");
}

function updateYear(currentYear, sliderGroup, yearId, idDiagramDiv){
    sliderGroup.append("text")
      .attr("id", yearId)
      .attr("class", "year")
      .attr("style", "margin-top: calc(" + getSvgHeight(idDiagramDiv) +"px - 35px)")
      .text(currentYear)
}

function createSlider(sliderGroup, minYear, maxYear, currentYear, sliderId, idDiagramDiv){

  const sliderWidth = getSvgHeight(idDiagramDiv) - 128;

  return sliderGroup.append("input")
    .attr("id", sliderId)
    .attr("type", "range")
    .attr("min", minYear)
    .attr("max", maxYear)
    .attr("step", 1)
    .attr("value", currentYear)
    .attr("style", "background   : transparent; " +
                   "width        : " + sliderWidth + "px; " +
                   "margin-left  : calc(" + -sliderWidth/2 +  "px);" +
                   "margin-top   : calc(" + sliderWidth/2 + "px + 60px);");
}

export {getHeight, getWidth, createSliderGroup, updateYear, createSlider, getSvgWidth};
