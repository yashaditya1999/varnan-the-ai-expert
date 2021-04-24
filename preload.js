const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded',(event)=>{
  let sendVCBSema=document.getElementById('sendVCBSema');
  let sendVCBSemaBtn=document.getElementById('sendVCBSemaBtn');
  sendVCBSemaBtn.addEventListener('click',(event)=>{
    if(sendVCBSema.value!=""){
      ipcRenderer.send('data', sendVCBSema.value);
    }
  });
  ipcRenderer.on('response', function(e, item){
    let x=document.getElementsByClassName('botElementSec');
    if(x[x.length-1].innerHTML=='Thinking...'){
      x[x.length-1].innerHTML='Opening '+item+'...';
      document.getElementById('speakBotMsgBtn').innerHTML='Opening '+item+'...';
      document.getElementById('speakBotMsgBtn').click();
    }
  });
});