
(async()=>{
 const canvas=document.getElementById("canvas"),ctx=canvas.getContext("2d",{alpha:false}),loading=document.getElementById("loading");
 let published;try{published=await fetchPublishedConfig()}catch{published=null}
 let config=draftConfig()||published;
 if(!config)return;
 let img=new Image(),ready=false,drag=null,offset={x:0,y:0};const $=id=>document.getElementById(id);
 function hydrate(){
  $("occasion").value=config.occasion||"";$("headingAr").value=config.headingAr||"";
  $("arEnabled").checked=!!config.arabic.enabled;$("arFont").value=config.arabic.fontFamily;$("arSize").value=config.arabic.fontSize;$("arColor").value=config.arabic.color;$("arColorText").value=config.arabic.color;
  $("enEnabled").checked=!!config.english.enabled;$("enFont").value=config.english.fontFamily;$("enSize").value=config.english.fontSize;$("enColor").value=config.english.color;$("enColorText").value=config.english.color;
 }
 function sync(){
  config.occasion=$("occasion").value;config.headingAr=$("headingAr").value;
  Object.assign(config.arabic,{enabled:$("arEnabled").checked,fontFamily:$("arFont").value,fontSize:+$("arSize").value||38,color:$("arColor").value});
  Object.assign(config.english,{enabled:$("enEnabled").checked,fontFamily:$("enFont").value,fontSize:+$("enSize").value||27,color:$("enColor").value});
  $("arColorText").value=config.arabic.color;$("enColorText").value=config.english.color;draw()
 }
 function loadImg(){ready=false;loading.classList.remove("hide");img=new Image();img.onload=()=>{ready=true;draw();loading.classList.add("hide")};img.src=loadImageSource(config)}
 function draw(){if(!ready)return;ctx.clearRect(0,0,1080,1080);ctx.drawImage(img,0,0,1080,1080);drawName(ctx,$("arPreview").value||"محمد أحمد",config.arabic,"rtl");drawName(ctx,$("enPreview").value||"Mohamed Ahmed",config.english,"ltr")}
 function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*1080/r.width,y:(e.clientY-r.top)*1080/r.height}}
 function hit(p,props,text){if(!props.enabled)return false;ctx.font=`${props.fontWeight} ${props.fontSize}px "${props.fontFamily}",Arial`;const w=Math.min(props.maxWidth,ctx.measureText(text).width+60),h=props.fontSize+34;return p.x>props.x-w/2&&p.x<props.x+w/2&&p.y>props.y-h/2&&p.y<props.y+h/2}
 canvas.addEventListener("pointerdown",e=>{const p=point(e);if(hit(p,config.arabic,$("arPreview").value||"محمد أحمد"))drag="arabic";else if(hit(p,config.english,$("enPreview").value||"Mohamed Ahmed"))drag="english";if(drag){offset.x=p.x-config[drag].x;offset.y=p.y-config[drag].y;canvas.setPointerCapture(e.pointerId)}});
 canvas.addEventListener("pointermove",e=>{if(!drag)return;const p=point(e);config[drag].x=Math.max(0,Math.min(1080,p.x-offset.x));config[drag].y=Math.max(0,Math.min(1080,p.y-offset.y));draw()});
 canvas.addEventListener("pointerup",()=>drag=null);canvas.addEventListener("pointercancel",()=>drag=null);
 document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".admin-section").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.getElementById(b.dataset.tab).classList.add("active")});
 ["occasion","headingAr","arEnabled","arPreview","arFont","arSize","arColor","enEnabled","enPreview","enFont","enSize","enColor"].forEach(id=>$(id).addEventListener("input",sync));
 $("arColorText").onchange=()=>{if(/^#[0-9a-f]{6}$/i.test($("arColorText").value)){$("arColor").value=$("arColorText").value;sync()}};
 $("enColorText").onchange=()=>{if(/^#[0-9a-f]{6}$/i.test($("enColorText").value)){$("enColor").value=$("enColorText").value;sync()}};
 $("templateFile").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{config.backgroundDataUrl=r.result;loadImg();toast("Template loaded")};r.readAsDataURL(f)};
 $("defaultTemplate").onclick=()=>{config.backgroundDataUrl="";config.template="default-template.jpg";loadImg();toast("Default template restored")};
 $("saveDraft").onclick=()=>{sync();saveDraft(config);toast("Draft saved in this browser")};
 $("export").onclick=()=>{sync();const blob=new Blob([JSON.stringify(config,null,2)],{type:"application/json"}),u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download="site-config.json";a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);toast("Publish file downloaded")};
 $("reset").onclick=()=>{if(confirm("Reset to the published version?")){localStorage.removeItem(STORE_KEY);location.reload()}};
 hydrate();loadImg();
})();
