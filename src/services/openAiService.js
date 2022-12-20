import { Configuration, OpenAIApi } from 'openai';

export async function aiComponentGenerator(componentTemplate, prompt) {
  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openAiApi = new OpenAIApi(configuration);

  const generatedComponent = await openAiApi.createCompletion({
    model: 'text-davinci-003',
    prompt: `Create a React component using this template "${componentTemplate}", but make the adjustments needed with these instructions as follows "${prompt}"`,
    temperature: 0.7,
    max_tokens: 2000,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 1,
  });

  return generatedComponent.data.choices[0].text;
}
