import { Client } from './../../../node_modules/@inngest/ai/node_modules/undici-types/client.d';
import { serve } from "inngest/next";
// Update the import path to the correct location of your inngest client
import { inngest } from "../../../inngest/client";
import { aiCareerAgent, aiCareerAgentFunction, helloWorld } from '@/inngest/functions';

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    aiCareerAgentFunction
  ],
});
