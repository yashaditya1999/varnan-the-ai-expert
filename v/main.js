if(window.sessionStorage.getItem('chatSection')!=undefined){
    document.getElementById('chatsection').innerHTML=window.sessionStorage.getItem('chatSection');
}
function beforeReloadPage() {
    window.speechSynthesis.cancel();
    saveAllChat();
}
function string_to_arrayYA(str) {
    return str.trim().split(" ");
}
function saveAllChat() {
    let SACHAT = document.getElementById('chatsection').innerHTML.replaceAll('Thinking...', 'Unable to process!');
    SACHAT = SACHAT.replaceAll('?autoplay=1', '');
    window.sessionStorage.setItem('chatSection', SACHAT);
}
function speakBotMsg(text){
    window.speechSynthesis.cancel();
    if(text.innerHTML!='SMSNULL'){
        var msg = new SpeechSynthesisUtterance();
        var voices = window.speechSynthesis.getVoices();
        msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Google UK English Male'; })[0];
        //msg.voiceURI = 'native';
        msg.volume = 1; // 0 to 1
        msg.rate = 1.1; // 0.1 to 10
        msg.pitch = 1.1; //0 to 2
        msg.text = text.innerHTML;
        msg.lang = 'en-US';
        msg.onend = function(e) {
        console.log('Finished in ' + event.elapsedTime + ' seconds.');
        };
        window.speechSynthesis.speak(msg);
        text.innerHTML='SMSNULL';
    }
}
function chatSendRecording() {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    //var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral' ];
    //var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
    let recognitionVARNAN = new SpeechRecognition();
    //let speechRecognitionList = new webkitSpeechGrammarList();
    //speechRecognitionList.addFromString(grammar, 1);
    //recognitionVARNAN.grammars = speechRecognitionList;
    recognitionVARNAN.continuous = false;
    recognitionVARNAN.lang = 'en-US';
    recognitionVARNAN.interimResults = false;
    recognitionVARNAN.maxAlternatives = 1;
    recognitionVARNAN.onstart = function() {
        document.getElementById('chatSendSpeech').style.animation='chatSendSKEY 500ms infinite linear';
        console.log('started');
    };
    recognitionVARNAN.onresult = function(event) {
        console.log('result');
        var transcript = event.results[0][0].transcript;
        var confidence = event.results[0][0].confidence;
        document.getElementById('chatInput').value=transcript;
        chatSendFun();
    };
    recognitionVARNAN.onnomatch = function(event) {
        console.log('I didnt recognize that color.');
    }
    recognitionVARNAN.onerorr = function() {
        console.log('error');
    };
    recognitionVARNAN.onspeechend = function() {
        document.getElementById('chatSendSpeech').style.animation='none';
        console.log('stoped');
        recognitionVARNAN.stop();
    }
    console.log('starting');
    recognitionVARNAN.start();
}
function chatBtnToogle() {
    if(document.getElementById('chatInput').value==''){
        document.getElementById('chatSend').style.display='none';
        document.getElementById('chatSendSpeech').style.display='block';
    }
    else{
        document.getElementById('chatSendSpeech').style.display='none';
        document.getElementById('chatSend').style.display='block';
    }
}
let sendVCBSema=document.getElementById('sendVCBSema');
let sendVCBSemaBtn=document.getElementById('sendVCBSemaBtn');
let dictonaryMainCommands=['open', 'mailto', 'mail to', 'call', 'help', 'play'];
let dictonarySubCommands=['app', 'link', 'audio', 'video', 'song'];
let predefinedApps=['explorer', 'notepad', 'cmd', 'chrome', 'edge', 'firefox', 'opera', 'vlc', 'paint', 'wordpad', 'word', 'powerpoint', 'excel'];
let predefinedLinks=['google', 'bing', 'youtube', 'yahoo', 'facebook', 'gmail', 'instagram', 'twitter'];
let expressionForEmail = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
let regexForEmail = new RegExp(expressionForEmail);
function hitEnter(event,ele) {
    if(ele.id=='chatInput' && event.keyCode==13 ){
        chatSendFun();
    }
}
function chatSendFun() {
    let text=document.getElementById('chatInput');
    let chatsection=document.getElementById('chatsection');
    let userEle=document.createElement('div');
    userEle.setAttribute('class','userElementSec');
    userEle.innerHTML=text.value;
    chatsection.append(userEle);
    chatsection.scrollTo(0,userEle.offsetTop+100);
    let botEle=document.createElement('div');
    botEle.setAttribute('class','botElementSec');
    botEle.innerHTML='Thinking...';
    chatsection.append(botEle);
    chatsection.scrollTo(0,botEle.offsetTop+100);
    thinkingFunction(text.value.toLowerCase());
    text.value="";
    text.focus();
    clearTimeout(window.STFTF);
    window.STFTF=setTimeout(()=> {
        if(botEle.innerHTML=='Thinking...') {
            botEle.innerHTML='Searching...';
            customSearchApi(userEle.innerHTML);
            document.getElementById('speakBotMsgBtn').innerHTML='Searching...';
            document.getElementById('speakBotMsgBtn').click();
        }
    },5000);
}
let ajaxCSAPI=0;
function customSearchApi(text) {
    clearTimeout(window.STFTF);
    let x=document.getElementsByClassName('botElementSec');
    if(x[x.length-1].innerHTML=='Thinking...') {
        x[x.length-1].innerHTML='Searching...';
        document.getElementById('speakBotMsgBtn').innerHTML='Searching...';
        document.getElementById('speakBotMsgBtn').click();
    }
    if(text!=null){
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                ajaxCSAPI=0;
                let data=JSON.parse(this.responseText), elem=data.items[0];
                for (let index = 0; index < data.items.length; index++) {
                    if(data.items[index].displayLink.search('wiki')!=-1 && index!=0){
                        elem = data.items[index];
                        break;
                    }
                }
                let botEle=document.createElement('div');
                botEle.setAttribute('class','botElementSec');
                botEle.innerHTML=`<div><a title="${elem.displayLink}" href="${elem.formattedUrl}">${elem.htmlTitle}</a></div><div>${elem.snippet}</div>`;
                chatsection.append(botEle);
                chatsection.scrollTo(0,botEle.offsetTop+100);
                document.getElementById('speakBotMsgBtn').innerHTML=`${elem.snippet}`;
                document.getElementById('speakBotMsgBtn').click();
            }
            else{
                ajaxCSAPI++;
                if(ajaxCSAPI==4){
                    ajaxCSAPI=0;
                    console.log('Please Try Again!!');
                }
            }
        };
        xhttp.open("GET", `https://www.googleapis.com/customsearch/v1?key=AIzaSyAi3nah3G6arKRj0XOwt0NRc3SgtNmMNHA&cx=c8fc85ed6b1a4ef09&q=${text}`, true);
        xhttp.send();
    }
}
let ajaxCSAPIYT=0;
window.IFRAMEYTP=null;
function customSearchApiYT(text) {
    if(window.IFRAMEYTP!=null){
        window.IFRAMEYTP.remove();
        window.IFRAMEYTP=null;
    }
    let x=document.getElementsByClassName('botElementSec');
    if(x[x.length-1].innerHTML=='Thinking...') {
        x[x.length-1].innerHTML='Searching...';
    }
    if(text!=null){
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                ajaxCSAPIYT=0;
                let data=JSON.parse(this.responseText), elem=data.items[0];
                let botEle=document.createElement('div');
                botEle.setAttribute('class','botElementSec');
                botEle.innerHTML=`<iframe style="width:100%;" src="https://www.youtube.com/embed/${elem.id.videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><div><a title="Open in YouTube" href="https://www.youtube.com/watch?v=${elem.id.videoId}">${elem.snippet.title}</a></div><div>Chennel: ${elem.snippet.channelTitle}</div><div>${elem.snippet.description}</div>`;
                chatsection.append(botEle);
                chatsection.scrollTo(0,botEle.offsetTop+100);
                document.getElementById('speakBotMsgBtn').innerHTML=`Playing...`;
                document.getElementById('speakBotMsgBtn').click();
                window.IFRAMEYTP=botEle.firstChild;
            }
            else{
                ajaxCSAPIYT++;
                if(ajaxCSAPIYT==4){
                    ajaxCSAPIYT=0;
                    console.log('Please Try Again!!');
                }
            }
        };
        xhttp.open("GET", `https://youtube.googleapis.com/youtube/v3/search?q=${text}&videoEmbedeble=true&key=AIzaSyAi3nah3G6arKRj0XOwt0NRc3SgtNmMNHA&part=snippet`, true);
        xhttp.send();
    }
}
function thinkingFunction(text) {
    let mcmd=null,scmd=null,pdap=null,pdlk=null;
    dictonaryMainCommands.every(element => {
        let curstr=text.search(element);
        if(curstr==-1) return true;
        else{
            mcmd=element;
            return false;
        }
        return true;
    });
    if(mcmd=='open' || mcmd=='play'){
        dictonarySubCommands.every(element => {
            let curstr=text.search(element);
            if(curstr==-1) return true;
            else{
                scmd=element;
                return false;
            }
            return true;
        });
    }
    if(mcmd=='open'){
        predefinedApps.every(element => {
            let curstr=text.search(element);
            if(curstr==-1) return true;
            else{
                pdap=element;
                return false;
            }
            return true;
        });
        predefinedLinks.every(element => {
            let curstr=text.search(element);
            if(curstr==-1) return true;
            else{
                pdlk=element;
                return false;
            }
            return true;
        });
    }
    if(mcmd==null){
        customSearchApi(text);
    }
    else if(mcmd=='open'){
        if(scmd=='app'){
            sendVCBSema.value= `{"command":"openapp","app":"${pdap}"}`;
            sendVCBSemaBtn.click();
        }
        else if(scmd=='link'){
            let strNode=string_to_arrayYA(text);
            let link=null,browser='microsoftedge',incognito=false;
            strNode.every(element => {
                if(element.match(regexForEmail)){
                    link=element;
                    return false;
                }
                else {
                    return true;
                }
                return true;
            });
            strNode.every(element => {
                if(element.search('chrome')!=-1){
                    browser='chrome';
                    return false;
                }
                if(element.search('firefox')!=-1){
                    browser='firefox';
                    return false;
                }
                if(element.search('edge')!=-1){
                    browser='microsoftedge';
                    return false;
                }
                if(element.search('opera')!=-1){
                    browser='opera';
                    return false;
                }
                return true;
            });
            strNode.every(element => {
                if(element.search('incognito')!=-1 || element.search('private')!=-1){
                    incognito=true;
                    return false;
                }
                return true;
            });
            if(link!=null){
                sendVCBSema.value= `{"command":"openlink","link":"${link}","browser":"${browser}","incognito":${incognito}}`;
                sendVCBSemaBtn.click();
            }
        }
        else if(scmd==null){
            if((pdap==null) && pdlk!=null){
                let strNode=string_to_arrayYA(text);
                let browser='microsoftedge',incognito=false;
                strNode.every(element => {
                    if(element.search('incognito')!=-1 || element.search('private')!=-1){
                        incognito=true;
                        return false;
                    }
                    return true;
                });
                sendVCBSema.value= `{"command":"openlink","link":"${pdlk}.com","browser":"${browser}","incognito":${incognito}}`;
                sendVCBSemaBtn.click();
            }
            else if(pdap!=null && pdlk==null){
                sendVCBSema.value= `{"command":"openapp","app":"${pdap}"}`;
                sendVCBSemaBtn.click();
            }
            else if(pdap!=null && pdlk!=null){
                let strNode=string_to_arrayYA(text);
                let browser='microsoftedge',incognito=false;
                strNode.every(element => {
                    if(element.search('chrome')!=-1){
                        browser='chrome';
                        return false;
                    }
                    if(element.search('firefox')!=-1){
                        browser='firefox';
                        return false;
                    }
                    if(element.search('edge')!=-1){
                        browser='microsoftedge';
                        return false;
                    }
                    if(element.search('opera')!=-1){
                        browser='opera';
                        return false;
                    }
                    return true;
                });
                strNode.every(element => {
                    if(element.search('incognito')!=-1 || element.search('private')!=-1){
                        incognito=true;
                        return false;
                    }
                    return true;
                });
                sendVCBSema.value= `{"command":"openlink","link":"${pdlk}.com","browser":"${browser}","incognito":${incognito}}`;
                sendVCBSemaBtn.click();
            }
        }
    }
    else if(mcmd=='play'){
        customSearchApiYT(text);
        if(scmd=='audio'){

        }
        else if(scmd=='video'||scmd=='song'){
            
        }
    }
    else if(mcmd=='help'){

    }
    else if(mcmd=='call'){

    }
    else if(mcmd=='mailto' || mcmd=='mail to'){

    }
}
function btnbotfun(ele){
    document.getElementById('botwindow').style.display='block';
    ele.style.display='none';
    document.getElementById('chatInput').focus();
    let text=document.getElementsByClassName('botElementSec');
    document.getElementById('speakBotMsgBtn').innerHTML=text[0].innerHTML;
    document.getElementById('speakBotMsgBtn').click();
    chatsection.scrollTo(0,text[text.length-1].offsetTop+100);
}
function botwindowClose(ele) {
    ele.parentElement.style.display='none';
    document.getElementById('btnbot').style.display='block';
}
window.onload = ()=> emotionModulesLoadfun();
function emotionModulesLoadfun() {
    if(emotionModulesLoad == true)
        document.querySelector('#load').style.display='none';
    else
        setTimeout(()=>emotionModulesLoadfun(),200);
}