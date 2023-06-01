// Get multiple cloud elements(Array) and moon elements
let draggableElementList = Array.from(document.getElementsByClassName("Draggable"));
let moon = document.getElementById('moon');
let clouds = Array.from(document.getElementsByClassName("cloud"));

let moonWidth, moonHeight;
let totalOverlapArea = 0;
let maxOverlapArea = 0;
let maxBrightness = 100;

// Get the width and height of the moon and remove the calculation units to convert them into pure numbers for the final calculation.
let moonStyles = window.getComputedStyle(moon);
moonWidth = parseFloat(moonStyles.width);
moonHeight = parseFloat(moonStyles.height);
// Loop through the cloud elements and trigger the "dragStart" function when the mouse is pressed.
for (const draggableElement of draggableElementList) {
  draggableElement.addEventListener("mousedown", dragStart);
}

let dragTarget = null;
let dragStartX, dragStartY, dragObjLeft, dragObjTop;

//When the mouse is pressed, Save the drag target element and initial drag parameters, and add "mousemove" and "mouseup" event listeners.
function dragStart(e) {
  dragTarget = e.target;
  dragObjLeft = e.target.offsetLeft;
  dragObjTop = e.target.offsetTop;
  dragStartX = e.pageX;
  dragStartY = e.pageY;
  window.addEventListener("mousemove", dragMove);
  window.addEventListener("mouseup", dragEnd); 
}

// When the mouse moves, adjust the position of the dragged element, calculate the overlap area of the moon and the clouds,
// and update the value of totalOverlapArea, then call the updateBrightness function.
function dragMove(e) {
  dragTarget.style.position = 'absolute';
  dragTarget.style.left = (dragObjLeft + (e.pageX - dragStartX) + "px");
  dragTarget.style.top = (dragObjTop + (e.pageY - dragStartY) + "px");

  let moonRect = moon.getBoundingClientRect();
  totalOverlapArea = 0;

  for (const cloud of clouds) {
    let cloudRect = cloud.getBoundingClientRect();

    if (
      cloudRect.left < moonRect.right &&
      cloudRect.right > moonRect.left &&
      cloudRect.top < moonRect.bottom &&
      cloudRect.bottom > moonRect.top
    ) {
      let overlapArea = calculateOverlapArea(cloudRect, moonRect);
      totalOverlapArea += overlapArea;
    }
  }

  updateBrightness();
}

// Remove the "mousemove" event listener when the mouse is released.
function dragEnd() {
  window.removeEventListener("mousemove", dragMove);
}

// Calculate the area of overlap between two rectangles.
function calculateOverlapArea(rect1, rect2) {
  let overlapWidth = Math.max(0, Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left));
  let overlapHeight = Math.max(0, Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top));
  return overlapWidth * overlapHeight;
}

// Calculates the brightness based on the overlap area and applies the brightness value to the CSS body element.
function updateBrightness() {
  let brightness = maxBrightness - (totalOverlapArea * maxBrightness) / (moonWidth * moonHeight);
  document.body.style.filter = 'brightness(' + brightness + '%)';
}