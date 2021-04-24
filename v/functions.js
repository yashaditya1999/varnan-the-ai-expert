let navflag=true, currentModule=null, LMF=false, FDM=false, ODM=false, VK=false;
function navflagfun(){
    if(navflag==true) {
        document.getElementById('nav').style.display='block';
        navflag=false;
    }
    else {
        document.getElementById('nav').style.display='none';
        navflag=true;
    }
}
function navele(ele) {
    ele.parentElement.style.display='none';
    navflag=true;
}
let emotionModfun = function () {
    if(FDM==false) {
        FDM=true;
        if(currentModule!=null) currentModule();
        if(currentModule==null) currentModule=emotionModfun;
        document.querySelector('#navcontent').style.display='none';
        document.querySelector('#emotionM').style.display='flex';
        document.getElementById('load').style.display='block';
        startVideoEmotion();
    }
    else{
        FDM=false;
        currentModule=null;
        document.querySelector('#emotionM').style.display='none';
        document.querySelector('#navcontent').style.display='block';
        clearInterval(window.emotionModuleInterval);
        videoEmotion.srcObject=null;
        canvasEmotion.remove();
    }
}
let objectDMfun = function () {
    if(ODM==false) {
        ODM=true;
        if(currentModule!=null) currentModule();
        if(currentModule==null) currentModule=objectDMfun;
        document.querySelector('#navcontent').style.display='none';
        document.querySelector('#objectDM').style.display='flex';
        document.getElementById('load').style.display='block';
        makeOD();
    }
    else{
        ODM=false;
        currentModule=null;
        document.querySelector('#objectDM').style.display='none';
        document.querySelector('#navcontent').style.display='block';
        clearInterval(window.ODInterval);
        ODvideo.srcObject=null;
        ODcanvas.remove();
    }
}