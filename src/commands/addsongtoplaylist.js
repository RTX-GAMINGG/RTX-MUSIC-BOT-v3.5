const { SlashCommandBuilder } = require('discord.js');
const Playlist = require('../models/Playlist');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addsongtoplaylist')
    .setDescription('Add a song to a playlist.')
    .addStringOption(option => 
      option.setName('name')
        .setDescription('Name of the playlist.')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('song')
        .setDescription('URL or name of the song.')
        .setRequired(true)),
  
  async execute(interaction) {
    const name = interaction.options.getString('name');
    const song = interaction.options.getString('song');
    const userId = interaction.user.id;

    const playlist = await Playlist.findOne({ name, userId });
    if (!playlist) {
      return interaction.reply('Playlist not found or you do not have permission to modify it.');
    }

    playlist.songs.push(song);
    await playlist.save();

    await interaction.reply(`Song **${song}** has been added to **${name}**.`);
  },
};