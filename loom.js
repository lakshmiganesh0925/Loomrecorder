let video=document.querySelector("video");
let recordBtnCont=document.querySelector(".record-btn-cont");
let recordBtn=document.querySelector(".record-btn");
let captureBtnCont=document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let recordFlag = false;
let transparentColor = "transparent";

let recorder;
let chunks = [];

let constraints={
    audio:true,
    video:true,
}

navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
      //console.log(stream);
       video.srcObject=stream;

       recorder = new MediaRecorder(stream);
       recorder.addEventListener("start" , (e)=>{
             chunks=[];
       });
       recorder.addEventListener("dataavailable" ,(e)=>{
         chunks.push(e.data);
       })

       recorder.addEventListener("stop", (e)=>{
        //convert the media chunk data to video
        let blob = new Blob(chunks, {type : "video/mp4 "});
        let videoUrl =URL.createObjectURL(blob);
        let a = document.createElement('a')
        a.href=videoUrl;
        a.download = "stream.mp4";
        a.click();
       })

       recordBtnCont.addEventListener("click",(e)=>{
            if(!recorder) return;

            recordFlag = !recordFlag;
            if(recordFlag){
                  recorder.start();
                  recordBtn.classList.add("scale-record");
                  startTimer();
            }else{  //stop
                  recorder.stop();
                  recordBtn.classList.remove("scale-record");
                  stopTimer();
            } 
       })
});

let timerId;
let counter=0;
let timer=document.querySelector(".timer");
function startTimer(){
      timer.style.dispaly="block";
      function dispalyTimer(){
            let totalSeconds = counter;
            let hours=Number.parseInt(totalSeconds/3600);
            totalSeconds=totalSeconds%3600;
            let minutes= Number.parseInt(totalSeconds/60);
            totalSeconds=totalSeconds%60;
            let seconds=totalSeconds;
            hours=(hours<10) ? `0${hours}`:hours;
            minutes=(minutes<10) ? `0${minutes}`:minutes;
            seconds=(seconds<10) ? `0${seconds}`: seconds;
            timer.innerText= `${hours}:${minutes}:${seconds}`;
            counter++;
      }

      timerId=setInterval(dispalyTimer,1000);
}

function stopTimer(){
      clearInterval(timerId);
      timer.innerText="00:00:00";
      timer.style.dispaly="none";
}

captureBtnCont.addEventListener("click",(e)=>{
      captureBtnCont.classList.add("scale-capture")

      let canvas = document.createElement("canvas");
      canvas.width=video.videoWidth;
      canvas.height=video.videoHeight;
      let imageUrl=canvas.toDataURL("image/jpeg");


      let tool= canvas.getContext("2d");
      tool.drawImage(video,0,0,canvas.width,canvas.height);
      tool.fillStyle=transparentColor;
      tool.fillRect(0,0,canvas.width,canvas.height);
      
      let a = document.createElement('a');
      a.href=imageUrl;
      a.download = "Image.jpeg";
      a.click();

      setTimeout(()=>{
            captureBtn.classList.remove("scale-capture");
      },1000);
})

let filter=document.querySelector(".filter-layer");
let allFilter = document.querySelector(".filter");
allFilter.forEach((filterElem)=>{
      filterElem.addEventListener("click",(e)=>{
            transparentColor=getComputedStyle(filterElem).getPropertyValue("background-color");
            filter.style.backgroundColor=transparentColor;
      })
});