import { NextRequest, NextResponse } from "next/server";
import textToSpeech, { protos } from "@google-cloud/text-to-speech";

// credential retrieval

const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (typeof credentials !== "string") {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not a string");
}

const clientConfig = {
  projectId: "vigama",
  credentials: JSON.parse(Buffer.from(credentials, "base64").toString()),
};

const client = new textToSpeech.TextToSpeechClient(clientConfig);

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest =
    {
      input: { text: text },
      voice: {
        languageCode: "en-US",
        name: "en-US-Studio-O",
        ssmlGender: "FEMALE",
      },
      audioConfig: { audioEncoding: "MP3" },
    };

  try {
    // API CALL

    const [response] = await client.synthesizeSpeech(request);

    return NextResponse.json({
      audioContent: response.audioContent,
    });
  } catch (err) {
    // ERROR HANDLING

    if (err instanceof Error) {
      console.error("Error: ", err.message);
      return NextResponse.json(
        { error: `Failed to synthesize text: ${err.message}` },
        { status: 500 }
      );
    } else {
      console.error("Unknown error: ", err);
      return NextResponse.json(
        {
          error: `Failed to transcribe audio: Unknown error occurred.`,
        },
        { status: 500 }
      );
    }
  }
}
