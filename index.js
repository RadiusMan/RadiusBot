const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
   console.log("Ia re")
});

client.on("message", message => {
  if(message.content === "!ping") {
    return message.channel.send("Pong " + client.ws.ping)
   }
 })

//Auth
client.login("NzYyNTM5ODY4MTQzNDg0OTI4.X3qolw.T1uv6bK6jFe4YpuSQ88g_sWVXLc");
