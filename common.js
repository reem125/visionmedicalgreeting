
"use strict";
const CONFIG_URL="./site-config.json";
const STORE_KEY="visionGreetingStudioDraftV3";
function deepCopy(v){return JSON.parse(JSON.stringify(v))}
async function fetchPublishedConfig(){
  const r=await fetch(`${CONFIG_URL}?v=${Date.now()}`,{cache:"no-store"});
  if(!r.ok)throw new Error("Config not found");
  return await r.json();
}
function draftConfig(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||"null")}catch{return null}}
function saveDraft(c){localStorage.setItem(STORE_KEY,JSON.stringify(c))}
function cleanText(v){return (v||"").replace(/\s+/g," ").trim()}
function fitText(ctx,text,props){
  let size=Number(props.fontSize)||32;
  const min=Number(props.minFontSize)||14;
  while(size>min){
    ctx.font=`${props.fontWeight||700} ${size}px "${props.fontFamily||"Arial"}", Arial, sans-serif`;
    if(ctx.measureText(text).width<=(props.maxWidth||720))break;
    size--;
  }
  return size;
}
function drawName(ctx,text,props,direction){
  if(!props.enabled||!text)return;
  ctx.save();ctx.direction=direction;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillStyle=props.color||"#0B91C9";
  const size=fitText(ctx,text,props);
  ctx.font=`${props.fontWeight||700} ${size}px "${props.fontFamily||"Arial"}", Arial, sans-serif`;
  ctx.fillText(text,Number(props.x)||540,Number(props.y)||540,Number(props.maxWidth)||720);
  ctx.restore();
}
function loadImageSource(config){
  return config.backgroundDataUrl||config.template||"default-template.jpg";
}
function safeFilename(v){return (v||"Vision-Medical").replace(/[\\/:*?"<>|]+/g,"").slice(0,48)}
function toast(msg){const el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),1900)}
