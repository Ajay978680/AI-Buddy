import { gemini } from "inngest";
import { inngest } from "./client";
import { createAgent, anthropic, openai } from '@inngest/agent-kit';

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const aiCareerAgent = createAgent({
    name: 'Ai-Career Chat Agent',
    description: 'An Ai answer Carrer Related Questions',
    system: 'You are an AI assistant that answers career-related questions. You provide helpful and accurate information to users seeking career advice.',
    model: gemini({
        model: "gemini-2.0-flash-lite",
        apiKey: process.env.GEMINI_API_KEY,
    })
});

export const aiCareerAgentFunction = inngest.createFunction(
    {
        id: 'AiCareerAgent'
    },
    { event: 'AiCareerAgent' },
    async ({ event, step }) => {
        const { userInput } = await event?.data;
        const result = await aiCareerAgent.run(userInput);
        return result;
    }
);