import { NextRequest, NextResponse } from "next/server";

import { SpeechClient, protos } from "@google-cloud/speech";

const { RecognitionConfig } = protos.google.cloud.speech.v1;
const { AudioEncoding } = RecognitionConfig;

const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (typeof credentials !== "string") {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not a string");
}

const clientConfig = {
  projectId: "vigama",
  credentials: JSON.parse(Buffer.from(credentials, "base64").toString()),
};

const client = new SpeechClient(clientConfig);

export async function POST(req: NextRequest) {
  const { audioData: base64AudioData } = await req.json();

  const audioBuffer = Buffer.from(base64AudioData, "base64");

  const audioContent = {
    content: audioBuffer.toString("base64"),
  };
  const config: protos.google.cloud.speech.v1.IRecognitionConfig = {
    encoding: AudioEncoding.WEBM_OPUS,
    sampleRateHertz: 48000,
    languageCode: "en-US",
  };
  const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
    audio: audioContent,
    config: config,
  };

  try {
    // API CALL

    const [response] = await client.recognize(request);
    const transcription =
      response &&
      response.results &&
      response.results
        .map((result) => {
          return (
            result && result.alternatives && result.alternatives[0].transcript
          );
        })
        .join("\n");

    return NextResponse.json(
      {
        transcription,
      },
      { status: 200 }
    );
  } catch (err) {
    // ERROR HANDLING

    if (err instanceof Error) {
      console.error("Error: ", err.message);
      return NextResponse.json(
        { error: `Failed to transcribe audio: ${err.message}` },
        { status: 500 }
      );
    } else {
      console.error("Unknown error: ", err);
      return NextResponse.json(
        { error: `Failed to transcribe audio: Unknown error occurred.` },
        { status: 500 }
      );
    }
  }
}
