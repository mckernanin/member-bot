import { Webhook, MessageBuilder } from "webhook-discord";

import config from "./config";
export const discord = new Webhook(config.discordWebhook);

const truncateText = (text: string, limit: number) => {
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit)} ...`;
};

export const unchangedMessage = (
  text: string,
  memberCount: number,
  corporationName: string
) => {
  const message = new MessageBuilder()
    .setName(corporationName)
    .setColor("#BADA55")
    .setText(text)
    .addField("Members", memberCount);
  try {
    discord.send(message);
  } catch (error) {
    console.error(error);
  }
};

export const memberDiffMessage = ({ message, details, corporationName }) => {
  const formattedMessage = new MessageBuilder()
    .setName(corporationName)
    .setColor("#BADA55")
    .setText(message)
    .addField("Joined", truncateText(details.joined, 1000))
    .addField("Left", truncateText(details.left, 1000))
    .setTime();
  try {
    discord.send(formattedMessage);
  } catch (error) {
    console.error(error);
  }
};
