const videoEmotion = document.getElementById("videoEmotion");
let emotionModulesLoad=false; predictedAges = [];

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("fdm/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("fdm/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("fdm/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("fdm/models")
]).then(emotionModulesLoad=true);

function startVideoEmotion() {
  //videoEmotion.play();
  navigator.getUserMedia(
    { video: {} },
    stream => (videoEmotion.srcObject = stream),
    err => console.error(err)
  );
  videoEmotion.onloadedmetadata = (e)=>startVideoEmotionCanvas();
}
let canvasEmotion;
function startVideoEmotionCanvas() {
  canvasEmotion = faceapi.createCanvasFromMedia(videoEmotion);
  document.getElementById('emotionM').append(canvasEmotion);
  canvasEmotion.style.position='absolute';
  //console.log(canvasEmotion);
  const displaySize = { width: videoEmotion.width, height: videoEmotion.height };
  faceapi.matchDimensions(canvasEmotion, displaySize);
  document.getElementById('load').style.display='none';
  window.emotionModuleInterval=setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(videoEmotion, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
      /* .withAgeAndGender() ;*/
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvasEmotion.getContext("2d").clearRect(0, 0, canvasEmotion.width, canvasEmotion.height);

    faceapi.draw.drawDetections(canvasEmotion, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvasEmotion, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvasEmotion, resizedDetections);
    /* resizedDetections.forEach(element => {
      const age = element.age;
      const interpolatedAge = interpolateAgePredictions(age);
      const bottomRight = {
        x: element.detection.box.bottomRight.x - 50,
        y: element.detection.box.bottomRight.y
      };

      new faceapi.draw.DrawTextField(
        [`${faceapi.utils.round(interpolatedAge, 0)} years`],
        bottomRight
      ).draw(canvasEmotion);
    }); */
  }, 100);
}

/* function interpolateAgePredictions(age) {
  predictedAges = [age].concat(predictedAges).slice(0, 30);
  const avgPredictedAge =
    predictedAges.reduce((total, a) => total + a) / predictedAges.length;
  return avgPredictedAge;
} */
