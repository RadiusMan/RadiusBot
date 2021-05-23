// Load up libraries and set consts
const Discord = require("discord.js");
const random = require('random');
const fs = require('fs');
const GaiaOfficialRole = '594967855473360926';

//Set script as client-bot.
const client = new Discord.Client();

//Load the config-file with token.
const config = require("./config.json");

//Define owner. Me.
const ownerID = '537320927378014211';



//console.log('All users listed.');

client.on('messageDelete', message => {
  //Should only execute on dbo9h server.
  if (message.guild.id != '540138104900812814')return;{
    //Dont execute if its a webhook or a bot, preventing infinite loops and crashes.
    if (message.webhookID || message.author.bot) {
    } else {
let botembed = new Discord.RichEmbed()
.setDescription(`💬 Message deleted!`)
        .setColor('#FFF400')
        .setTimestamp()
        .setFooter("dbo9h-T&S", " https://i.imgur.com/HHrPPYY.png")
        .setThumbnail(" https://i.imgur.com/HHrPPYY.png")
        .addField(`**The message**`, `${message.cleanContent}`, false)
        .addField(`**Message info**`, `From ${message.author} in ${message.channel}`, false);      
client.channels.get("695099267454599198").send(botembed)
}}});

//Define cooldown variable and amount of seconds.
let cooldown = new Set();
let cdseconds = 2.5;

//Bot startup, print to log if successfull and the bots activity. 
client.on("ready", () => {

  console.log(`${client.user.username} bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 

  client.user.setActivity(`dbo9h-T&S | Patch Updates`);
});


//Print to log when bot have joined a server.
client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

//Print to log when bot have been removed from a server.
client.on("guildDelete", guild => {
  console.log(`${client.user.username} have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

//Scans all new messages, deletes and notifies user that they are not permitted to use the swear words if its match the filter below.
let set = new Set(['nigger', 'negro', 'nigga', 'wigga', 'wigger'])
client.on('message', (msg) => {
    if(msg.author.bot) {
    return
  }
  let wordArray = msg.content.split(' ')
  console.log(wordArray)
  for(var i = 0; i < wordArray.length; i++) {
    if(set.has(wordArray[i])) {
    msg.delete()
    msg.channel.send(`${msg.author.username}, that's a word I dont like.`)
    break
    }
    console.log(`Message scanned`)
  }
});

//Base setup behavior and ignoring other prefixes and bots.
client.on("message", async message => {
  if(message.author.bot) return;
    if(message.content.indexOf(config.prefix) !== 0) return;
  
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

//Coldown logic
if(!message.content.startsWith(config.prefix)) return; 
if(cooldown.has(message.author.id)){
  return message.reply("عليك الانتظار قليلاً بين استخدام الأوامر.")
}
cooldown.add(message.author.id);

setTimeout(() =>{
  cooldown.delete(message.author.id)
}, cdseconds * 1000)

//Kick command.
if(command == "kick") {
        message.delete()
        let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!message.member.hasPermission('ADMINISTRATOR'))
        return message.reply("لا يسمح لك باستخدام هذا الأمر.");
        if(!kUser) return message.channel.send("Kick failed, please **@mention** your target.");
        let kReason = args.join(" ").slice(0);
    
        let kickEmbed = new Discord.RichEmbed()
        .setDescription("**User kicked**")
        .setColor('#FFF400')
        .addField("Username", `${kUser}`)
        .addField("Moderator", `<@${message.author.id}>`)
        .addField("Reason", `**\`\`\`${kReason}\`\`\`**`);
        message.guild.member(kUser).kick(kReason);
        message.channel.send(kickEmbed);
    };

//Admin commands.
if(command === "admin") {
       message.delete().catch(O_o=>{});
          if(!message.member.hasPermission('ADMINISTRATOR'))
          return message.reply("لا يسمح لك باستخدام هذا الأمر.")

              let botembed = new Discord.RichEmbed()
          .setDescription(`💬 __**dbo9h server admin commands**__\nYou must have the [*G_D_A*] role to be able to use these commands.`)
          .setColor('#FFF400')
          .setTimestamp()
          .setFooter("Command used by " + message.author.username, message.author.avatarURL)
          .setThumbnail(" https://i.imgur.com/HHrPPYY.png")
          .addField(`${config.prefix}` + "purge", "Deletes messages in bulk.")
          .addField(`${config.prefix}` + "ping", "API latency check.")
          .addField(`${config.prefix}` + "uptime", "Show system uptime.")
          .addField(`${config.prefix}` + "addfaq", "Adds a faq-entry to <#425582389411053568>.")
          .addField(`${config.prefix}` + "addtodo", "Adds a todo-entry to <#335008973126107139>.")
          .addField(`${config.prefix}` + "addvote", "Adds a vote-entry to <#335008891450687491>.")
          .addField(`${config.prefix}` + "addjob", "Adds a new listing to <#421330450418499605>.")
          .addField(`${config.prefix}` + "dbo9htsupdate", "Adds a update-entry for dbo9h in the channel command was used.")
          .addField(`${config.prefix}` + "say", "Let the bot do the talking.")
          .addField(`${config.prefix}` + "servers", "Show all servers bot is connected to.")
          .addField(`${config.prefix}` + "kick", "Kicks user specified with reason specified.")
          .addField(`${config.prefix}` + "google", "Shows people how to use Google.")
          .addField(`${config.prefix}` + "kickbot", "Kicks bot from server ID. This can only be used by bot owner.");
          .addField(`${config.prefix}` + "activity", "Change activity. This can only be used by bot owner");
         message.channel.send(botembed);
       }

//Ping command. Regular and bot-to-websocket.  
  if(command === "ping") {
     message.delete().catch(O_o=>{});
 if(!message.member.hasPermission('ADMINISTRATOR'))
      return message.reply("لا يسمح لك باستخدام هذا الأمر.");

    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

//Give official server role
  if(command === "addofficial") {
     message.delete().catch(O_o=>{});
     if (message.guild.id != '540138104900812814')
      return;{
      let member = message.member;
       message.member.addRole('594967855473360926');
       return message.reply("role granted!");
          }
    }

//Remove official server role
  if(command === "removeofficial") {
     message.delete().catch(O_o=>{});
     if (message.guild.id != '540138104900812814')
      return;{
      let member = message.member;
       message.member.removeRole('594967855473360926');
       return message.reply("role removed!");
          }
    }

  //Say command. 
  if(command === "say") {
 if(!message.member.hasPermission('ADMINISTRATOR'))
      return message.reply("لا يسمح لك باستخدام هذا الأمر.");
    
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    //message.channel.send(sayMessage);
    client.user.setActivity(sayMessage);
  }

//Change Activity
    if(command === "activity") {
 if(!message.member.hasPermission('ADMINISTRATOR'))
      return message.reply("لا يسمح لك باستخدام هذا الأمر.");
    
    const activitym = args.join(" ");
    message.delete().catch(O_o=>{}); 
    client.user.setActivity(activitym);
  }
//Help command.
if(command === "help") {
       message.delete().catch(O_o=>{});
   if(!message.member.hasPermission('ADMINISTRATOR'))
   return message.reply("لا يسمح لك باستخدام هذا الأمر.");
  
      let days = Math.floor(client.uptime / 86400000);
      let hours = Math.floor(client.uptime / 3600000) % 24;
      let minutes = Math.floor(client.uptime / 60000) % 60;
      let seconds = Math.floor(client.uptime / 1000) % 60;
      let botembed = new Discord.RichEmbed()
          .setDescription(`💬 [**dbo9h-T&S v1.0**](https://discord.gg/HXbzYJy7QS). Running on [**Node.js v11.4.2**](https://nodejs.org/en/) & [**Discord.js v11.5.1**](https://discord.js.org/)\nBot uptime **${days}d ${hours}h ${minutes}m ${seconds}s**.`)
          .setColor('#FFF400')
          .setTimestamp()
          .setFooter("dbo9h-T&S", " https://i.imgur.com/HHrPPYY.png")
          .setThumbnail(" https://i.imgur.com/HHrPPYY.png")
        //.setAuthor("dbo9h bot", "https://discordapp.com", " https://i.imgur.com/HHrPPYY.png")//
          //.addField("__**Information**__", "Gaia [**Website**](https://arkgaia.net/) can be found here.\nSpawncodes, engramentries and spawnlocations can be found [**here**](https://arkgaia.net/spawncodes/).\nGaia branded mods, [**Gaia**](http://steamcommunity.com/sharedfiles/filedetails/?id=1125442531) - [**Gaia Beacons**](https://steamcommunity.com/sharedfiles/filedetails/?id=1686302787) - [**Gaia Wyverns**](https://steamcommunity.com/sharedfiles/filedetails/?id=1921128412) - [**Dino Hunter**](https://steamcommunity.com/sharedfiles/filedetails/?id=1401103561) - [**BombDo**](https://steamcommunity.com/sharedfiles/filedetails/?id=1555286809).", false)
          //.addField("__**General**__", "Donations - [**Paypal**](https://arkmod.net/donations/).\nFrequently asked questions - [**FAQ**](https://arkgaia.net/faq/).\nInvite to Gaia discord - [**Gaia**](https://discord.gg/u8dqgzp).", false)
          //.addField("__**Community**__", "Submit a [**suggestion**](https://arkgaia.net/suggestion/) to Gaia devteam.\nSubmit a [**bugreport**](https://arkgaia.net/bugreport/) here.\n[**Invite**](https://goo.gl/NoHCDC) Gaia bot to your server.", false)
          //.addField("__**Sponsor/Credits**__", "[**Nitrado**](http://nitra.do/prome) - Official server and testserver.\n[**Credits**](https://arkgaia.net/credits/) - Without these people, Gaia wouldnt be.", false);
         message.channel.send(botembed);
       }

//Add into the joblist channel
if (command === 'addjob') {
  message.delete().catch(O_o=>{});
if(!message.member.hasPermission('ADMINISTRATOR'))
  return message.reply("لا يسمح لك باستخدام هذا الأمر.");
  
  let str = `${args.join(' ')}` ;
  let Title = str.split(/"/)[1];
  let Desc = str.split(/"/)[3];
  const addJob = message.guild.channels.find(channel > channel.name === "joblist")

    if(Title == null || Desc == null){
    message.reply(`usage: \n${config.prefix}addjob "Title" "Desc"`);
    }else{
    

  let botembed = new Discord.RichEmbed()
    .setThumbnail(" https://i.imgur.com/HHrPPYY.png")
    .addField("__**Title**__",
    Title)
    .addField("__**Description**__",
    Desc)
    .setColor("#FFF400")
    .setTimestamp()
    .setFooter("dbo9h-T&S", " https://i.imgur.com/HHrPPYY.png")
  
    addJob.send(botembed);
    }
}

//Add into the faq channel
if (command === 'addfaq') {
  message.delete().catch(O_o=>{});
if(!message.member.hasPermission('ADMINISTRATOR'))
  return message.reply("لا يسمح لك باستخدام هذا الأمر.");
  
  let str = `${args.join(' ')}` ;
  let Question = str.split(/"/)[1];
  let Answer = str.split(/"/)[3];
  const addfaq = message.guild.channels.find(channel => channel.name === "faq")

    if(Question == null || Answer == null){
    message.reply(`usage: \n${config.prefix}addfaq "Question" "Answer"`);
    }else{
    

  let botembed = new Discord.RichEmbed()
    .setThumbnail(" https://i.imgur.com/HHrPPYY.png")
    .addField("__**Question**__",
    Question)
    .addField("__**Answer**__",
    Answer)
    .setColor("#FFF400")
    .setTimestamp()
    .setFooter("dbo9h-T&S", " https://i.imgur.com/HHrPPYY.png")
  
    addfaq.send(botembed);
    }
}

//Add into the todolist channel
if (command === 'addtodo') {
  message.delete().catch(O_o=>{});
 if(!message.member.hasPermission('ADMINISTRATOR'))
   return message.reply("لا يسمح لك باستخدام هذا الأمر.");
  
  let str = `${args.join(' ')}` ;
  let TodoThing = str.split(/"/)[1];
  const addTodo = message.guild.channels.find(channel => channel.name === "todo_list")

    if(TodoThing == null){
    message.reply(`usage: \n${config.prefix}addtodo "Text"`);
    }else{
    

  let botembed = new Discord.RichEmbed()
    .setThumbnail(" https://i.imgur.com/HHrPPYY.png")
    .addField("__**Look into this**__",
    TodoThing)
    .setColor("#FFF400")
    .setTimestamp()
    .setFooter("dbo9h-T&S", " https://i.imgur.com/HHrPPYY.png")
  
    addTodo.send(botembed);
    }
}

//Voting system
if (command === 'addvote') {
  message.delete().catch(O_o=>{});
  if(!message.member.hasPermission('ADMINISTRATOR'))
    return message.reply("لا يسمح لك باستخدام هذا الأمر.");
  
  let str = `${args.join(' ')}` ;
  let VoteThing = str.split(/"/)[1];
  const addVote = message.guild.channels.find(channel => channel.name === "announcements")

    if(VoteThing == null){
    message.reply(`usage: \n${config.prefix}addVote "Text"`);
    }else{
    

  let botembed = new Discord.RichEmbed()
    .setThumbnail(" https://i.imgur.com/HHrPPYY.png")
    .addField("__**New vote**__",
    VoteThing)
    .setColor("#FFF400")
    .setTimestamp()
    .setFooter("dbo9h-T&S", " https://i.imgur.com/HHrPPYY.png")
  
    addVote.send(botembed).then(sentEmbed => {
          sentEmbed.react("👍")
          sentEmbed.react("👎")
          });
    }
}

// Command used for announcing Gaia Wyverns updates.
// if(command === "gwupdate") {
//       message.delete().catch(O_o=>{});
//  if(!message.member.hasPermission('ADMINISTRATOR')) return;
//       
//       message.channel.send("@everyone");
//       let botembed = new Discord.RichEmbed()
//           .setColor('#FFF400')
//           .setTimestamp()
//           .setFooter("Gaia bot", " http://nanaki.ddns.net/files/ARK/Random/Images/Gaia/Gaia_ML.png")
//           .setThumbnail(" http://nanaki.ddns.net/files/ARK/Random/Images/Gaia/Gaia_ML.png")
//           .addField("__**Gaia Wyverns updated!**__", "\nChangenotes can be found [**here**](https://steamcommunity.com/sharedfiles/filedetails/changelog/1921128412).\n\nSend in a bugreport [**here**](https://www.arkgaia.net/community/bugreport). Unsure if it's a bug or not? Send it anyway!\nSuggestions should be sent in [**here**](https://www.arkgaia.net/community/suggestion), we'd love to hear from you.\nSupport our work by [**donating**](https://arkmod.net/donations/) a few bucks.\n\nHope you enjoy the update!", false);
//          message.channel.send(botembed).then(sentEmbed => {
//           sentEmbed.react("🇦🇺")
//           sentEmbed.react("🇧🇷")
//           sentEmbed.react("🇨🇦")
//           sentEmbed.react("🇩🇪")
//           sentEmbed.react("🇪🇺")
//           sentEmbed.react("🇬🇧")
//           sentEmbed.react("🇰🇷")
//           sentEmbed.react("🇸🇪")
//           sentEmbed.react("🇺🇸")
//           sentEmbed.react("🇺🇳")
//           sentEmbed.react("🇷🇺")
//           sentEmbed.react("🇳🇱")
//           sentEmbed.react("🇹🇷")
//           sentEmbed.react("🇬🇷")
//           sentEmbed.react("🇪🇸")
//           sentEmbed.react("🇫🇷")
//           sentEmbed.react("🇯🇵")
//           sentEmbed.react("🇮🇹")
//           sentEmbed.react("🇮🇩")
//           sentEmbed.react("🇨🇳")
//             });
//           }

//Command used for announcing Dino Hunter updates.
//if(command === "dhupdate") {
//      message.delete().catch(O_o=>{});
// if(!message.member.hasPermission('ADMINISTRATOR')) return;
//      
//      message.channel.send("@everyone");
//      let botembed = new Discord.RichEmbed()
//          .setColor('#FFF400')
//          .setTimestamp()
//          .setFooter("Gaia bot", " http://nanaki.ddns.net/files/ARK/Random/Images/Gaia/Gaia_ML.png")
//          .setThumbnail(" http://nanaki.ddns.net/files/ARK/Random/Images/Gaia/Gaia_ML.png")
//          .addField("__**Dino Hunter updated!**__", "\nChangenotes can be found [**here**](https://steamcommunity.com/sharedfiles/filedetails/changelog/1401103561).\n\nSend in a bugreport [**here**](https://www.arkgaia.net/community/bugreport). Unsure if it's a bug or not? Send it anyway!\nSuggestions should be sent in [**here**](https://www.arkgaia.net/community/suggestion), we'd love to hear from you.\nSupport our work by [**donating**](https://arkmod.net/donations/) a few bucks.\n\nHope you enjoy the update!", false);
//         message.channel.send(botembed).then(sentEmbed => {
//          sentEmbed.react("🇦🇺")
//          sentEmbed.react("🇧🇷")
//          sentEmbed.react("🇨🇦")
//          sentEmbed.react("🇩🇪")
//          sentEmbed.react("🇪🇺")
//          sentEmbed.react("🇬🇧")
//          sentEmbed.react("🇰🇷")
//          sentEmbed.react("🇸🇪")
//          sentEmbed.react("🇺🇸")
//          sentEmbed.react("🇺🇳")
//          sentEmbed.react("🇷🇺")
//          sentEmbed.react("🇳🇱")
//          sentEmbed.react("🇹🇷")
//          sentEmbed.react("🇬🇷")
//          sentEmbed.react("🇪🇸")
//          sentEmbed.react("🇫🇷")
//          sentEmbed.react("🇯🇵")
//          sentEmbed.react("🇮🇹")
//          sentEmbed.react("🇮🇩")
//          sentEmbed.react("🇨🇳")
//            });
//          }
//
//Command used for announcing dbo9h updates.
if(command === "dbo9htsupdate") {
      message.delete().catch(O_o=>{});
 if(!message.member.hasPermission('ADMINISTRATOR'))
   return message.reply("لا يسمح لك باستخدام هذا الأمر.");
      
      message.channel.send("@everyone");
      let botembed = new Discord.RichEmbed()
          .setColor('#FFF400')
          .setTimestamp()
          .setFooter("dbo9h-T&S", " https://i.imgur.com/HHrPPYY.png")
          .setThumbnail(" https://i.imgur.com/HHrPPYY.png")
          .addField("__**dbo9h Tools & Structures تم تحديثه!!**__", "\nيمكنك العثور على المتغيرات بالضغط على [**هنا**](https://steamcommunity.com/sharedfiles/filedetails/changelog/1832884459).\n\nاذا وجدت خطأ ارسله [**هنا**](https://steamcommunity.com/workshop/filedetails/discussion/1832884459/1637549649101660969/). غير متأكد ما إذا كان خطأ أم لا؟ أرسلها على أي حال!\nاذا لديك اقتراح ارسله [**هنا**](https://steamcommunity.com/workshop/filedetails/discussion/1832884459/1637549649101663119/), نحب ان نسمع منك.\nدعم عملنا من خلال [**الدعم**](https://www.paypal.com/paypalme/db9h) بضعة دولارات.\n\nأتمنى أن تستمتع بالتحديث!", false);
         message.channel.send(botembed).then(sentEmbed => {
            });
          }

////Command used for announcing Gaia updates.
//if(command === "gaiabeaconsupdate") {
//      message.delete().catch(O_o=>{});
// if(!message.member.hasPermission('ADMINISTRATOR')) return;
//      
//      message.channel.send("@everyone");
//      let botembed = new Discord.RichEmbed()
//          .setColor('#FFF400')
//          .setTimestamp()
//          .setFooter("Gaia bot", " https://i.imgur.com/HHrPPYY.png")
//          .setThumbnail(" https://i.imgur.com/HHrPPYY.png")
//          .addField("__**Gaia Beacons updated!**__", "\nChangenotes can be found [**here**](https://steamcommunity.com/sharedfiles/filedetails/changelog/1686302787).\n\nSend in a bugreport [**here**](https://www.arkgaia.net/community/bugreport). Unsure if it's a bug or not? Send it anyway!\nSuggestions should be sent in [**here**](https://www.arkgaia.net/community/suggestion), we'd love to hear from you.\nSupport our work by [**donating**](https://arkmod.net/donations/) a few bucks.\n\nHope you enjoy the update!", false);
//         message.channel.send(botembed).then(sentEmbed => {
//          sentEmbed.react("🇦🇺")
//          sentEmbed.react("🇧🇷")
//          sentEmbed.react("🇨🇦")
//          sentEmbed.react("🇩🇪")
//          sentEmbed.react("🇪🇺")
//          sentEmbed.react("🇬🇧")
//          sentEmbed.react("🇰🇷")
//          sentEmbed.react("🇸🇪")
//          sentEmbed.react("🇺🇸")
//          sentEmbed.react("🇺🇳")
//          sentEmbed.react("🇷🇺")
//          sentEmbed.react("🇳🇱")
//          sentEmbed.react("🇹🇷")
//          sentEmbed.react("🇬🇷")
//          sentEmbed.react("🇪🇸")
//          sentEmbed.react("🇫🇷")
//          sentEmbed.react("🇯🇵")
//          sentEmbed.react("🇮🇹")
//          sentEmbed.react("🇮🇩")
//          sentEmbed.react("🇨🇳")
//            });
//          }
//
//Show testserver info
if(command === "testserver") {
    message.delete().catch(O_o=>{});
 if(!message.member.hasPermission('ADMINISTRATOR'))
   return message.reply("لا يسمح لك باستخدام هذا الأمر.");
      
      let string = '';
 {
        string += 'Server is running dbo9h(Testmod) and ACM. Sometimes it runs other mods that I need to test.\n\nIP: steam://connect/95.156.250.51:21501\nAdmin Password: REMOVED\nRCON port: 26815\nRCON Password: REMOVED';
}

      let botembed = new Discord.RichEmbed()
        .setColor("#FFF400")
        .addField("dbo9h testserver", string)
        .setTimestamp()
        .setFooter("Command used by " + message.author.username, message.author.avatarURL);
     message.channel.send(botembed);
}


//Servers command
  if (command === "servers") {
  message.delete().catch(O_o=>{});
 if(!message.member.hasPermission('ADMINISTRATOR'))
   return message.reply("لا يسمح لك باستخدام هذا الأمر.");
      
    let string = '';

    client.guilds.forEach(guild => {
        string += 'Server - ' + guild.name + '\n' + 'Total users -` ' + guild.memberCount + ' ` ' + '\n' + 'Server ID - ` ' + guild.id + ' ` ' + '\n\n';

    })

    let botembed = new Discord.RichEmbed()
        .setColor("#FFF400")
        .addField("dbo9h-T&S is currently connected to, and serving,", string)
        .setTimestamp()
        .setFooter("Command used by " + message.author.username, message.author.avatarURL);
    message.channel.send(botembed);
}

//Google.
  if(command === "google") {
      message.delete().catch(O_o=>{});
 if(!message.member.hasPermission('ADMINISTRATOR'))
   return message.reply("لا يسمح لك باستخدام هذا الأمر.");
      
      message.channel.send(`The answer to your question can be found here <http://tiny.cc/bd8gfz>.`);
  }

//Uptime command. Specified in milliseconds. % is modulo.
  if(command === "uptime") {
      message.delete().catch(O_o=>{});
 if(!message.member.hasPermission('ADMINISTRATOR'))
   return message.reply("لا يسمح لك باستخدام هذا الأمر.");
      
      let days = Math.floor(client.uptime / 86400000);
      let hours = Math.floor(client.uptime / 3600000) % 24;
      let minutes = Math.floor(client.uptime / 60000) % 60;
      let seconds = Math.floor(client.uptime / 1000) % 60;

      message.channel.send(`I've been up and running for **${days}** days **${hours}** hours **${minutes}** minutes & **${seconds}** seconds.`);
  }

//Purge command. 
if(command === "purge") {
 if(!message.member.hasPermission('ADMINISTRATOR'))
   return message.reply("لا يسمح لك باستخدام هذا الأمر.");
      
    const deleteCount = parseInt(args[0], 10);
        if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("please provide a number between 2 and 100 for the number of messages to delete");

    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`couldn't delete messages because of: ${error}`));
  }

//Kickbot command
  if (command === "kickbot") {
    message.delete().catch(O_o=>{});
         if (message.author.id !== ownerID) return message.channel.reply("لا يسمح لك باستخدام هذا الأمر.");

         var error17 = new Discord.RichEmbed().setColor("990033")
             .setDescription('Please enter a valid server ID. **.servers** shows servers ID.')
             .setColor(0xff0000)

         var error18 = new Discord.RichEmbed().setColor("990033")
             .setDescription('You cannot kick the bot from this server!')
             .setColor(0xff0000)


         if (isNaN(args[0])) return message.channel.send(error17).then(msg => {
             msg.delete(9000)
         });

         client.guilds.get(args[0]).leave();
         message.channel.send(`dbo9h-T&S was been removed from server id **[${args[0]}]**`)
     }

  });

//Welcome message.
client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.find(ch => ch.name === "wlc");
  if (!channel) return;
  let botembed = new Discord.RichEmbed()
  .setColor("#FFF400")
  //.setAuthor('dbo9h-T&St', ' https://i.imgur.com/HHrPPYY.png')
  .setThumbnail(member.user.avatarURL)
  .setDescription(`Welcome to dbo9h discord, ${member}!\nPlease read through <#335009347287515137> prior to using this discord.`)
  .setTimestamp()
  .setFooter("dbo9h-T&S", client.user.avatarURL);
    channel.send(botembed);
      console.log('User ' + member.user.tag + ' has joined ' + member.guild.name + '.');
  });

//Auth
client.login(process.env.TOKEN);
