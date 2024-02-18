import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  try {
    // API CALL

    const response = await axios.post(`${API_URL}/engine`, {
      prompt,
    });
    return NextResponse.json({
      response: response.data.response,
    });
  } catch (err) {
    // ERROR HANDLING

    if (err instanceof Error) {
      console.error("Error: ", err.message);
      return NextResponse.json(
        { error: `Failed to response with task: ${err.message}` },
        { status: 500 }
      );
    } else {
      console.error("Unknown error: ", err);
      return NextResponse.json(
        { error: `Failed to response with task: Unknown error occurred.` },
        { status: 500 }
      );
    }
  }
}
