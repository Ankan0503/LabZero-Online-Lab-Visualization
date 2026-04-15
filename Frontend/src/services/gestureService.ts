// @ts-ignore
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision';

let gestureRecognizer: GestureRecognizer | null = null;
let isLoading = false;

export const getGestureRecognizer = async (): Promise<GestureRecognizer> => {
  if (gestureRecognizer) return gestureRecognizer;
  if (isLoading) {
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
      if (gestureRecognizer) return gestureRecognizer;
    }
  }

  isLoading = true;
  try {
    // Temporarily suppress console.info, console.log, and console.warn to hide the TFLite initialization message
    const originalInfo = console.info;
    const originalLog = console.log;
    const originalWarn = console.warn;
    console.info = () => {};
    console.log = () => {};
    console.warn = () => {};

    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
    
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
        delegate: "CPU"
      },
      runningMode: "VIDEO",
      numHands: 1
    });
    
    // Restore console methods after a short delay to ensure all init logs are caught
    setTimeout(() => {
      console.info = originalInfo;
      console.log = originalLog;
      console.warn = originalWarn;
    }, 3000);

    return gestureRecognizer;
  } finally {
    isLoading = false;
  }
};
