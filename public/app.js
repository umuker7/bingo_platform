const tg=window.Telegram.WebApp; tg.expand();
const socket=io();
const user=tg.initDataUnsafe.user;
let roomId="";

fetch("/login",{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify({id:user.id,name:user.first_name})});

function join(){ roomId=document.getElementById("room").value; socket.emit("join-room",{roomId,user}); }
function play(){ socket.emit("play",{roomId,userId:user.id}); }

socket.on("players",(p)=>{ document.getElementById("players").innerText="Players: "+p.length; });
socket.on("number",(n)=>{ document.getElementById("number").innerText=n; });

fetch("/leaderboard").then(r=>r.json()).then(d=>{
  const ul=document.getElementById("board");
  d.forEach(x=>{ const li=document.createElement("li"); li.innerText=x.name+" - "+x.score; ul.appendChild(li); });
});
