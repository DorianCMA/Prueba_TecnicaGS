export const uniqueEmojis = (text) => {
    const emojiRegex = /[\p{Emoji}]/gu;
    const emojis = text.match(emojiRegex) || [];
    return [...new Set(emojis)]; // Devuelve emojis únicos
  };
  
  export const uniqueHashtags = (text) => {
    const hashtagRegex = /#\w+/g;
    const hashtags = text.match(hashtagRegex) || [];
    return [...new Set(hashtags.map(tag => tag.toLowerCase()))]; // Devuelve hashtags únicos en minúsculas
  };
  
  export const uniqueMentions = (text) => {
    const mentionRegex = /@\w+/g;
    const mentions = text.match(mentionRegex) || [];
    return [...new Set(mentions.map(mention => mention.toLowerCase()))]; // Devuelve menciones únicas en minúsculas
  };
  