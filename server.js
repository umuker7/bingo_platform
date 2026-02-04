const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { Low, JSONFile } = require("lowdb");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = new Low(new JSONFile("db.json"), { users: [], rooms: [] });

async function init(){ await db.read(); await db.write(); }
init();

app.post("/login", async (req,res)=>{
  const {id,name}=req.body;
  let user=db.data.users.find(u=>u.id==id);
  if(!user){ user={id,name,score:0,coins:10}; db.data.users.push(user); await db.write(); }
  res.json(user);
});

app.get("/leaderboard", async (req,res)=>{
  await db.read();
  const top=[...db.data.users].sort((a,b)=>b.score-a.score).slice(0,10);
  res.json(top);
});

io.on("connection",(socket)=>{
  socket.on("join-room", async ({roomId,user})=>{
    socket.join(roomId);
    let room=db.data.rooms.find(r=>r.id==roomId);
    if(!room){ room={id:roomId,players:[],numbers:[]}; db.data.rooms.push(room); }
    if(!room.players.find(p=>p.id==user.id)){ room.players.push(user); }
    await db.write();
    io.to(roomId).emit("players", room.players);
  });

  socket.on("play", async ({roomId,userId})=>{
    const number=Math.floor(Math.random()*90)+1;
    let user=db.data.users.find(u=>u.id==userId);
    user.score+=5;
    await db.write();
    io.to(roomId).emit("number", number);
    io.to(roomId).emit("score-update", user);
  });
});

server.listen(3000, ()=>console.log("🔥 Server running on 3000"));
