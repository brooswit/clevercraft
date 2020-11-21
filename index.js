const cleverbot = require("cleverbot-free");

const mineFlayer = require('mineflayer');
const mineFlayerPathFinder = require('mineflayer-pathfinder');

const { pathfinder, Movements, goals } = mineFlayerPathFinder;
const { GoalFollow, GoalNear } = goals;

let client = null;
let botInstance = null;
let hosts = ['minecraft.andrewcorp.com', 'play.duckmania.net', 'StoneTechMC.mcserver.us', 'oceaniacraft.net', 'kaboom.pw', 'Earthmc.se', 'mc.trilliumhq.com', 'wolfpackmc.net', 'avas.cc', 'play.medievalmc.org', 'play.toxigon.com', 'mc.enchantedsword.net'];
let blockedUsernames = ["ADMIN", "VIP", "Default", "ClearLag", "org", "HL", "PvPManager", "Era", "Help", "Server", "KSXB4LQPCNS7", "Member", "Discord", "already", "players"]
let config = {
    host: hosts[0],//[Math.floor(Math.random() * hosts.length)],
    port: 25565,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    version: false
};
const bot = mineFlayer.createBot(config);
client = bot._client;
botInstance = bot;
botInstance.loadPlugin(pathfinder)

let chatLogs = {};

  botInstance.on('connect', function() {
    console.info(`connected to ${config.host}`);
  });
  botInstance.on('login', function() {
    console.info('logged in');
  });
  botInstance.on('disconnect', function(packet) {
    console.log('disconnected: '+ packet.reason);
  });
  botInstance.on('kicked', function(msg) {
    console.log('kicked: ' + msg);
  });
  botInstance.on('end', function() {
    console.log('Connection lost');
  });
  botInstance.on('error', function(err) {
    console.log('Error: ' + err);
  });

botInstance.on('chat', function(username, message) {
    message = message.toLowerCase();
    if (username !== 'brooswit') return
    if (!message.includes('kys')) return
    botInstance.chat( '/kill' );
})

botInstance.on('chat', function(username, message) {
    message = message.toLowerCase();
    if (username !== 'brooswit') return;
    if (!message.includes('go to spawn')) return;

    botInstance.chat( '/spawn' );
})

  let wanderX = 0;
  let wanderY = 0;
  let wanderZ = 0;

botInstance.on('chat', function(username, message) {
      const cmd = message.split(' ')

      if (cmd[0] = 'goto' && cmd.length === 3) { // goto x z
        const wanderX = parseInt(cmd[1], 10)
        const wanderZ = parseInt(cmd[2], 10)
      }
})

botInstance.on('chat', function(username, message) {
    message = message.toLowerCase();
    if (blockedUsernames.indexOf(username) !== -1) return;
    if (username === botInstance.username) return
    console.log(`${username}: ${message}`);
    let shouldReference = Math.random() < 0.66;
    if (Math.random() < 0.05) return;
    if (Math.random() < 0.4) chatLogs[username] = undefined;
    if (!chatLogs[username] && (message.includes(botInstance.username) || message.includes('awate') ||  message.includes('welcome') || message.includes('awa') || message.includes('bot') || message.includes('lol') || message.includes('lmao') || message.includes('hi') || message.includes('hello') || message.includes('sup') || message.includes('help') ||  message.includes('tp') /*|| Math.random() < 0.01*/)) {
        chatLogs[username] = chatLogs[username] || [];
        shouldReference = true;
    }
    if (!chatLogs[username]) return
    let chatLog = chatLogs[username];
    let readDelay = message.length * 60000 / 1400;
    if (Math.random() < 0.1 || message.includes('tp')) {
        // console.log(`requesting to tp to ${username}`)
        // botInstance.chat( `/tp ${username}` );
    }
    console.log(`(typing)`);
    cleverbot(message, chatLog).then(response => {
        if (shouldReference) {
            response[0] = response[0].toLowerCase
            response = `${username}, ${response}`
        }
        let writeDelay = message.length * 60000 / 250;
        setTimeout(()=>{
            chatLog.push(message);
            chatLog.push(response);
            botInstance.chat( response );
            
            console.log(`${botInstance.username}: ${response}`);
        }, readDelay + writeDelay);
    });
});

stillCount = 0;
prevX = null;
prevZ = null;
setInterval(()=>{
    let roundX = Math.round(botInstance.entity.position.x);
    let roundY = Math.round(botInstance.entity.position.y);
    let roundZ = Math.round(botInstance.entity.position.z);
    let roundWanderX = Math.round(wanderX);
    let roundWanderY = Math.round(wanderY);
    let roundWanderZ = Math.round(wanderZ);
    if (prevX === roundX && prevZ === roundZ) {
        stillCount ++;
        if (stillCount > 3) {
            stillCount = 0
            wanderX = roundX
            wanderY = roundY
            wanderZ = roundZ
            console.log('give up')
        }
    } else {
        stillCount--;
    }
    stillCount=stillCount<0?0:stillCount;
    prevX = roundX
    prevZ = roundZ

    diffX = roundWanderX - roundX
    diffY = roundWanderY - roundY
    diffZ = roundWanderZ - roundZ

    // botInstance.chat( `${botInstance.entity.position}` );
    if(stillCount>0) {
        console.log(`${roundX} ${roundY} ${roundZ} -> ${diffX>0?'+':''}${diffX} ${diffY>0?'+':''}${diffY} ${diffZ>0?'+':''}${diffZ}`);
    }
}, 1000);

// setInterval(()=>{
//     if(Math.random()<0.1) return;
//     botInstance.chat( 'Bored' );
// }, 60000 + (240000*Math.random()))

botInstance.once('spawn', () => {
  wanderX = botInstance.entity.position.x;
  wanderY = botInstance.entity.position.y;
  wanderZ = botInstance.entity.position.z;
  const mcData = require('minecraft-data')(botInstance.version)
  const defaultMove = new Movements(botInstance, mcData)
    let targetName = null;
    setInterval(()=>{
        let oldTargetName = targetName
        if (Math.random()<0.1) targetName = null;
        if (targetName === null) {
            const keys = Object.keys(chatLogs);//botInstance.players);
            targetName = keys[Math.floor(Math.random() * keys.length)];
        }
        let target = botInstance.players[targetName] && botInstance.players[targetName].entity || null;
        if (!target) {
            wanderX+=(-32+(64*Math.random()))*Math.max(0,(1-Math.abs(wanderX-botInstance.entity.position.x)/256));
            wanderY+=(-1+(2*Math.random()))*Math.max(0,(1-Math.abs(wanderY-botInstance.entity.position.y)/16));
            wanderZ+=(-32+(64*Math.random()))*Math.max(0,(1-Math.abs(wanderZ-botInstance.entity.position.z)/256));
            targetName = null;
                bot.pathfinder.setGoal(new GoalNear(wanderX, wanderY, wanderZ, 1))
            return
        } else {
            wanderX = target.position.x;
            wanderY = target.position.y;
            wanderZ = target.position.z;
        }
        const p = target.position

        botInstance.pathfinder.setMovements(defaultMove)
        if (oldTargetName != targetName) {
            botInstance.pathfinder.setGoal(new GoalFollow(target, 3))
        }
    }, 1000);
});
