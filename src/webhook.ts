import { Webhook, MessageBuilder } from "webhook-discord";

import config from "./config";
export const discord = new Webhook(config.discordWebhook);

const truncateText = (text: string, limit: number) => {
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit)} ...`;
};

export const unchangedMessage = async (
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
    await discord.send(message);
  } catch (error) {
    console.error(error);
  }
};

export const memberDiffMessage = async ({
  message,
  details,
  corporationName
}) => {
  const formattedMessage = new MessageBuilder()
    .setName(corporationName)
    .setColor("#BADA55")
    .setText(message)
    .addField("Joined", truncateText(details.joined, 1000))
    .addField("Left", truncateText(details.left, 1000))
    .setTime();
  try {
    await discord.send(formattedMessage);
  } catch (error) {
    console.error(error);
  }
};
