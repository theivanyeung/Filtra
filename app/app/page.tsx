"use client";

import { useEffect, useState, useRef } from "react";

import { Button, Flex, Heading } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

import { IpcRendererEvent } from "electron";

import useToastManager from "@/components/modules/useToastManager";

import OpticalCircle from "@/Vesper/OpticalCircle";

const Home = () => {
  const [focus, setFocus] = useState(false);
  const [prompt, setPrompt] = useState<string>("");
  const [activeWindow, setActiveWindow] = useState<string>("");

  const { errorToast2, responseToast } = useToastManager();

  {
    /**
     * SPEECH TO TEXT MODULE
     */
  }

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  // Function to start recording
  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      audioContextRef.current = new AudioContext();
      const audioStream =
        audioContextRef.current.createMediaStreamSource(stream);

      processorRef.current = audioContextRef.current.createScriptProcessor(
        2048,
        1,
        1
      );

      audioStream.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current?.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current?.start();
    });
  };

  // Function to handle available audio data
  const handleDataAvailable = async (e: BlobEvent) => {
    const audioData = new Blob([e.data], { type: "audio/webm; codecs=opus" });
    const arrayBuffer = await new Response(audioData).arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64AudioData = Buffer.from(uint8Array).toString("base64");

    const response = await fetch("/api/transcribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audioData: base64AudioData }),
    });

    if (response.ok) {
      const { transcription } = await response.json();
      if (transcription) {
        console.log(transcription);
      } else {
        console.log("");
      }
    } else {
      const errorMessage = await response.text();
      console.error("Failed to transcribe audio:", errorMessage);
      throw new Error(`Failed to transcribe audio: ${errorMessage}`);
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    processorRef.current?.disconnect();
    audioContextRef.current?.close();
  };

  {
    /**
     * TEXT TO SPEECH MODULE
     */
  }

  const speakText = async (text: string) => {
    const response = await fetch("/api/synthesize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();

    const audioContent = data.audioContent;

    const buffer = new Uint8Array(audioContent.data).buffer;
    const blob = new Blob([buffer], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
  };

  {
    /**
     * ENGINE
     */
  }

  const submitMessage = async (prompt: string) => {
    const command = prompt;
    setPrompt("");

    try {
      const response = await fetch("/api/engine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: command }),
      });

      console.log(response);
    } catch (error) {
      errorToast2(error);
    }
  };

  const handleFormSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    submitMessage(prompt);
  };

  {
    /**
     * AUDIO
     */
  }

  const modeAudio = useRef(new Audio());

  const playModeAudio = (mode: boolean) => {
    modeAudio.current.src = mode
      ? "/sound-effects/focus.mp3"
      : "/sound-effects/leisure.mp3";
    modeAudio.current.play();
  };

  {
    /**
     * DEVICE CONNECTION MODULE
     */
  }

  {
    /**
     * MODE MODULE
     */
  }

  // useEffect(() => {
  //   if (window.electron && window.electron.ipcRenderer) {
  //     const fetchProcessesAndActiveWindow = () => {
  //       window.electron.ipcRenderer.send("request-active-window");
  //     };

  //     const activeWindowListener = (event: IpcRendererEvent, data: any) => {
  //       console.log(data);
  //     };

  //     window.electron.ipcRenderer.on(
  //       "provide-active-window",
  //       activeWindowListener
  //     );

  //     const pollingInterval = setInterval(fetchProcessesAndActiveWindow, 1000);

  //     return () => {
  //       clearInterval(pollingInterval);
  //       window.electron.ipcRenderer.removeListener(
  //         "provide-active-window",
  //         activeWindowListener
  //       );
  //     };
  //   }
  // }, []);

  const toggleMode = () => {
    setFocus(!focus);
  };

  const postAPI = async () => {
    const str = "";

    const response = await fetch("/api/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ str }),
    });

    if (response.ok) {
      const { message } = await response.json();
      console.log(message);
    } else {
      const errorMessage = await response.text();
      console.error("Failed to receive message:", errorMessage);
      throw new Error(`Failed to receive message: ${errorMessage}`);
    }
  };

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      w={"100vw"}
      h={"100vh"}
    >
      <Flex
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        w={"90%"}
        h={"90%"}
        borderRadius={"1000px"}
        border={"1px solid #FFFFFF"}
        bgColor={"rgba(30, 30, 30, 0.75)"}
        boxShadow={
          "0px 0px 25px 0px rgba(255, 255, 255, 0.15), 0px 0px 100px 0px rgba(255, 255, 255, 0.15) inset"
        }
      >
        <OpticalCircle width={"350px"} height={"350px"} mouseRotate={"false"} />

        {/** BUTTON */}

        <Button
          variant={"ghost"}
          colorScheme={"whiteAlpha"}
          alignItems={"center"}
          mb={"25px"}
          w={"200px"}
          gap={"15px"}
          borderRadius={"100px"}
          border={"1px solid rgba(255, 255, 255, 0.5)"}
          boxShadow={
            "0px 0px 25px 0px rgba(255, 255, 255, 0.25), 0px 0px 25px 0px #rgba(255, 255, 255, 0.25) inset"
          }
          transition="box-shadow 0.3s ease-in-out"
          _hover={{
            boxShadow:
              "0px 0px 25px 0px rgba(255, 255, 255, 0.5), 0px 0px 25px 0px rgba(255, 255, 255, 0.5) inset",
          }}
          onClick={() => {
            toggleMode();
            playModeAudio(!focus);
          }}
        >
          {focus ? (
            <SunIcon color={"#FFFFFF"} />
          ) : (
            <MoonIcon color={"#FFFFFF"} />
          )}
          <Heading
            fontWeight={"normal"}
            fontSize={"xl"}
            letterSpacing={"0.1em"}
            textShadow={"0px 0px 10px #FFFFFF"}
            color={"#FFFFFF"}
          >
            {focus ? "Leisure Mode" : "Focus Mode"}
          </Heading>
        </Button>
      </Flex>
    </Flex>
  );
};

export default Home;

