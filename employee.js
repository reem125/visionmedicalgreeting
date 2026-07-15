
(async()=>{
 const canvas=document.getElementById("canvas"),ctx=canvas.getContext("2d",{alpha:false});
 const ar=document.getElementById("arName"),en=document.getElementById("enName"),err=document.getElementById("error"),loading=document.getElementById("loading");
 let config,img=new Image(),ready=false;
 try{config=await fetchPublishedConfig()}catch(e){err.textContent="تعذر تحميل إعدادات التصميم.";return}
 document.getElementById("mainHeading").textContent=config.headingAr||"أنشئ معايدتك الخاصة";
 function draw(){if(!ready)return;ctx.clearRect(0,0,1080,1080);ctx.drawImage(img,0,0,1080,1080);drawName(ctx,cleanText(ar.value),config.arabic,"rtl");drawName(ctx,cleanText(en.value),config.english,"ltr")}
 img.onload=()=>{ready=true;draw();loading.classList.add("hide")};img.onerror=()=>{loading.innerHTML="<strong>تعذر تحميل صورة التصميم.</strong>"};img.src=loadImageSource(config);
 function update(){document.getElementById("arCount").textContent=`${ar.value.length}/40`;document.getElementById("enCount").textContent=`${en.value.length}/44`;err.textContent="";draw()}
 ar.addEventListener("input",update);en.addEventListener("input",update);
 document.getElementById("clear").onclick=()=>{ar.value="";en.value="";update();ar.focus()};
 document.getElementById("download").onclick=()=>{if(!cleanText(ar.value)&&!cleanText(en.value)){err.textContent="اكتب الاسم بالعربي أو الإنجليزي أولًا.";ar.focus();return}if(!ready){err.textContent="انتظر حتى يكتمل تحميل التصميم.";return}draw();canvas.toBlob(blob=>{if(!blob){err.textContent="تعذر إنشاء الصورة.";return}const u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=`${safeFilename(en.value||ar.value)}-${safeFilename(config.occasion)}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1200);toast("تم تحميل المعايدة")},"image/png",1)};
 update();
})();
