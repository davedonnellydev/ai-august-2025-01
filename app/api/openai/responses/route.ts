import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { MODEL } from '@/app/config/constants';
import { InputValidator, ServerRateLimiter } from '@/app/lib/utils/api-helpers';

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const ip =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Server-side rate limiting
    if (!ServerRateLimiter.checkLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const { input } = await request.json();

    // Enhanced validation
    const textValidation = InputValidator.validateText(input, 2000);
    if (!textValidation.isValid) {
      return NextResponse.json({ error: textValidation.error }, { status: 400 });
    }

    // Environment validation
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'Translation service temporarily unavailable' },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey,
    });

    // Enhanced content moderation
    const moderatedText = await client.moderations.create({
      input,
    });

    const { flagged, categories } = moderatedText.results[0];

    if (flagged) {
      const keys: string[] = Object.keys(categories);
      const flaggedCategories = keys.filter(
        (key: string) => categories[key as keyof typeof categories]
      );
      return NextResponse.json(
        {
          error: `Content flagged as inappropriate: ${flaggedCategories.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const instructions: string =
      "You are an expert organiser. You have excellent understanding of all topics and your main function is to break down goals into managable, clear and concise tasks. Ensure you don't generate more than 5 tasks per goal. Each task should only be one sentance (maximum) to describe the task.";

      const GoalTasks = z.object({
        order: z.number(),
        task: z.string()
      })

      const TaskList = z.object({
        goal: z.string(),
        tasks: z.array(GoalTasks)
      })



    const response = await client.responses.parse({
      model: MODEL,
      instructions,
      input: `I have a goal described between the ### characters. Break that goal down into a maximum of 5 separate tasks:
      ###
      ${input}
      ###
      `,
      text: {
        format: zodTextFormat(TaskList, "task_breakdown"),
      },
    });

    if (response.status !== 'completed') {
      throw new Error(`Responses API error: ${response.status}`);
    }

    return NextResponse.json({
      response: response.output_parsed || 'Response recieved',
      originalInput: input,
      remainingRequests: ServerRateLimiter.getRemaining(ip),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'OpenAI failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
