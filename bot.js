const { Client, GatewayIntentBits, Partials, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
          ],
  partials: [Partials.Channel]
});

const ROLE_ID = '1376527528641953842'; 
// on voit
client.once(Events.ClientReady, () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'get_access') {
    try {
      const member = interaction.member;
      if (member.roles.cache.has(ROLE_ID)) {
        return interaction.reply({ content: 'Tu as déjà ce rôle !', ephemeral: true });
      }
      await member.roles.add(ROLE_ID);
      return interaction.reply({ content: 'Rôle attribué, bienvenue !', ephemeral: true });
    } catch (error) {
      console.error(error);
      // Ici on vérifie si on a déjà répondu pour éviter l'erreur
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: 'Erreur lors de l’attribution du rôle.', ephemeral: true });
      } else {
        await interaction.followUp({ content: 'Erreur lors de l’attribution du rôle.', ephemeral: true });
      }
    }
  }
});

// Commande pour envoyer le message avec le bouton (à lancer une fois ou via un système de commande)
client.on('messageCreate', async message => {
  if (message.content === '!sendbutton') {
    const button = new ButtonBuilder()
      .setCustomId('get_access')
      .setLabel('Recevoir l’accès')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await message.channel.send({ content: 'Clique sur le bouton pour recevoir ton rôle !', components: [row] });
  }
});

client.login(process.env.TOKEN);
