
function getWidth(){
  const canvasWidth = window.innerWidth;
  const maxWidth = 1200;

  if(canvasWidth > maxWidth){
    return maxWidth;
  }else{
    return canvasWidth;
  }
}

function getHeight(){
  const canvasHeight = window.innerHeight/100*60;
  const maxHeight    = 600;
  const minHeight    = 500;

  if(canvasHeight > maxHeight){
    return maxHeight;
  }else if(canvasHeight < minHeight){
    return minHeight;
  }else{
    return canvasHeight;
  }
}

function getSliderWidth(diagramHeight){
  return diagramHeight - 128;
}

export {getHeight, getWidth, getSliderWidth};
