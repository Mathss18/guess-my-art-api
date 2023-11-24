import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private openAi: OpenAI;

  constructor() {
    this.openAi = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORGANIZATION_ID,
    });
  }

  async createImage(prompt: string): Promise<string> {
    const image = await this.openAi.images.generate({
      prompt,
      model: 'dall-e-3',
      quality: 'standard',
      size: '1024x1024',
    });

    return image.data[0].url;
  }

  async getPercentage(prompt: string): Promise<string> {
    const sentences = prompt.split('|').map((s) => s.trim());
    if (sentences.length !== 2) {
      throw new Error(
        'Prompt should contain exactly two sentences separated by |',
      );
    }

    const response = await this.openAi.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `What is the percentage of similarity between the following two sentences?\n
      Sentence 1: ${sentences[0]}
      Sentence 2: ${sentences[1]}
      Give a percentage between 0.0 and 100.0, and give me just the number`,
    });

    const matches = response.choices[0].text.match(/\d+(\.\d+)?/);

    if (matches) {
      return `${matches[0]}%`;
    } else {
      throw new Error('Could not find a percentage in the response');
    }
  }
}
