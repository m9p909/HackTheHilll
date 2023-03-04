import { z } from "zod";

import { message, Message } from "~/interfaces/message";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Configuration, OpenAIApi } from "openai";
import { inferRouterInputs } from "@trpc/server";

const salesPersonPrompt = "canadiantier phone sales person: ";
const customerPrompt = "customer: ";

const openAIKey = process.env.OPENAI;
if (!openAIKey) throw new Error("No API KEY");

const configuration = new Configuration({
  apiKey: openAIKey,
});

const openai = new OpenAIApi(configuration);

const callChatGPT = (input: string) =>
  openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: input,
      temperature: 0,
      max_tokens: 200,
    })
    .then((data) => data.data.choices[0]?.text)
    .catch((err) => {
      console.log(err);
      return err;
    });

const createHistoryPrompt = (input: Message[]): string =>
  input.reduce((prev, current) => {
    if (current.person == "user") {
      prev += customerPrompt + current.message;
    } else {
      prev += salesPersonPrompt + current.message;
    }
    return prev + "\n";
  }, "");

const getResponse = async (input: Message[]): Promise<Message[]> => {
  let prompt = createHistoryPrompt(input);
  prompt += salesPersonPrompt;

  const response = callChatGPT(prompt);
  input.push({
    message: await response,
    person: "bot",
  });
  console.log(6);
  return input;
};

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  chat: publicProcedure.input(z.array(message)).query(({ input }) => {
    return getResponse(input);
  }),
});
