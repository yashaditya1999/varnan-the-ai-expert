let objectDetector;
let ODstatus;
let ODobjects = [];
let ODvideo = document.getElementById('ODMvideo');
let ODcanvas, ODctx;
const ODwidth = ODvideo.width;
const ODheight = ODvideo.height;
const ODelement=document.getElementById('objectDM');

async function makeOD() {
  const capture = await navigator.mediaDevices.getUserMedia({ video: true })
  ODvideo.srcObject = capture;
  objectDetector = await ml5.objectDetector('cocossd', startDetectingOD)
  ODcanvas = createODcanvas(ODwidth, ODheight);
  ODctx = ODcanvas.getContext('2d');
}

function startDetectingOD(){
  document.getElementById('load').style.display='none';
  console.log('model ready');
  window.ODInterval=setInterval(()=>detectOD(),100);
}

function detectOD() {
  objectDetector.detect(ODvideo, function(err, results) {
    if(err){
      //console.log(err);
      return;
    }
    ODobjects = results;

    if(ODobjects){
      drawOD();
    }
  });
}

function drawOD(){
  // Clear part of the ODcanvas
  ODctx.clearRect(0,0, ODwidth, ODheight);

  //ODctx.drawImage(ODvideo, 0, 0);
  for (let i = 0; i < ODobjects.length; i += 1) {
    ODctx.font = "26px Arial";
    ODctx.fillStyle = "blue";
    ODctx.fillText(ODobjects[i].label, ODobjects[i].x + 10, ODobjects[i].y + 24); 

    ODctx.beginPath();
    ODctx.rect(ODobjects[i].x, ODobjects[i].y, ODobjects[i].width, ODobjects[i].height);
    ODctx.strokeStyle = "red";
    ODctx.stroke();
    ODctx.closePath();
  }
}

function createODcanvas(w, h){
  const ODcanvas = document.createElement("canvas");
  ODelement.append(ODcanvas);
  ODcanvas.style.position='absolute';
  const displaySize = { width: w, height: h };
  faceapi.matchDimensions(ODcanvas, displaySize);
  return ODcanvas;
}