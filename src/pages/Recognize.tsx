import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Square, Trash2, Volume2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

const Recognize = () => {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [currentLetter, setCurrentLetter] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulated recognition for demo (will be replaced with actual ML model)
  const simulateRecognition = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomConfidence = Math.floor(Math.random() * 30) + 70; // 70-100%
    
    setCurrentLetter(randomLetter);
    setConfidence(randomConfidence);
    
    // Only add letter to text if confidence is above 85%
    if (randomConfidence >= 85) {
      setTimeout(() => {
        setRecognizedText(prev => prev + randomLetter);
        setCurrentLetter("");
        setConfidence(0);
      }, 1500);
    } else {
      // Clear low confidence letters faster
      setTimeout(() => {
        setCurrentLetter("");
        setConfidence(0);
      }, 800);
    }
  };

  const startCamera = async () => {
    try {
      setCameraError(false);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 }, 
          facingMode: "user" 
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          setIsRecognizing(true);
          toast.success("Camera started successfully");
        };
      }
    } catch (error) {
      setCameraError(true);
      toast.error("Failed to access camera. Please allow camera permissions.");
      console.error("Camera error:", error);
    }
  };

  const stopCamera = () => {
    // Clear recognition interval
    if (recognitionIntervalRef.current) {
      clearInterval(recognitionIntervalRef.current);
      recognitionIntervalRef.current = null;
    }
    
    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsRecognizing(false);
    setCurrentLetter("");
    setConfidence(0);
    toast.info("Recognition stopped");
  };

  const clearText = () => {
    setRecognizedText("");
    toast.info("Text cleared");
  };

  const speakText = () => {
    if (!recognizedText) {
      toast.error("No text to speak");
      return;
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(recognizedText);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
      toast.success("Speaking text...");
    } else {
      toast.error("Text-to-speech not supported in this browser");
    }
  };

  const copyText = async () => {
    if (!recognizedText) {
      toast.error("No text to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(recognizedText);
      setIsCopied(true);
      toast.success("Text copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy text");
    }
  };

  // Start/stop recognition simulation when camera state changes
  useEffect(() => {
    if (isRecognizing && !recognitionIntervalRef.current) {
      recognitionIntervalRef.current = setInterval(() => {
        simulateRecognition();
      }, 2500);
    }
    
    return () => {
      if (recognitionIntervalRef.current) {
        clearInterval(recognitionIntervalRef.current);
        recognitionIntervalRef.current = null;
      }
    };
  }, [isRecognizing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionIntervalRef.current) {
        clearInterval(recognitionIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Sign Language <span className="bg-gradient-primary bg-clip-text text-transparent">Recognition</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Start signing and watch your gestures transform into text
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Camera Section */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-6 bg-card border-border/50">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden relative shadow-md">
                  {!cameraError && (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                  )}
                  
                  {!isRecognizing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/95 backdrop-blur-sm">
                      <div className="text-center space-y-4">
                        <Camera className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="text-lg text-muted-foreground">
                          {cameraError ? "Camera access denied" : "Camera not started"}
                        </p>
                        <p className="text-sm text-muted-foreground max-w-xs">
                          {cameraError 
                            ? "Please enable camera permissions in your browser settings"
                            : "Click 'Start Recognition' to begin"
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Detection Frame - Always visible during recognition */}
                  {isRecognizing && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="relative">
                        {/* Hand detection frame */}
                        <div className="w-64 h-64 border-4 border-primary/40 rounded-2xl flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-sm text-primary/60 mb-2">Detection Area</div>
                            {currentLetter && confidence >= 85 ? (
                              <div className="space-y-2">
                                <div className="text-7xl font-bold text-primary animate-pulse-glow">
                                  {currentLetter}
                                </div>
                                <div className="text-lg font-semibold text-success">
                                  {confidence}% Match
                                </div>
                              </div>
                            ) : currentLetter ? (
                              <div className="space-y-2">
                                <div className="text-5xl font-bold text-muted-foreground/50">
                                  {currentLetter}
                                </div>
                                <div className="text-sm text-destructive">
                                  {confidence}% - Too Low
                                </div>
                              </div>
                            ) : (
                              <div className="text-muted-foreground/50">
                                Sign a letter
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-4">
                  {!isRecognizing ? (
                    <Button
                      onClick={startCamera}
                      className="flex-1 gradient-primary shadow-md"
                      size="lg"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Start Recognition
                    </Button>
                  ) : (
                    <Button
                      onClick={stopCamera}
                      variant="destructive"
                      className="flex-1"
                      size="lg"
                    >
                      <Square className="mr-2 h-5 w-5" />
                      Stop Recognition
                    </Button>
                  )}
                </div>
              </Card>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <Card className="p-6 bg-card border-border/50">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  Recognized Text
                </h2>
                
                <div className="bg-muted rounded-lg p-4 min-h-[200px] mb-4 font-mono text-lg break-words">
                  {recognizedText || (
                    <span className="text-muted-foreground italic">
                      Start signing to see text appear here...
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={speakText}
                    variant="outline"
                    className="w-full"
                    disabled={!recognizedText}
                  >
                    <Volume2 className="mr-2 h-4 w-4" />
                    Speak Text
                  </Button>
                  
                  <Button
                    onClick={copyText}
                    variant="outline"
                    className="w-full"
                    disabled={!recognizedText}
                  >
                    {isCopied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Text
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={clearText}
                    variant="outline"
                    className="w-full"
                    disabled={!recognizedText}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Text
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-primary border-0 text-primary-foreground">
                <h3 className="font-semibold mb-2">💡 Tips for Best Results</h3>
                <ul className="space-y-1 text-sm text-primary-foreground/90">
                  <li>• Ensure good lighting</li>
                  <li>• Keep hand in frame</li>
                  <li>• Sign clearly and slowly</li>
                  <li>• Face the camera</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recognize;
