import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Volume2, Download, Loader2, Sparkles, Play, Pause } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const voiceGenerationSchema = z.object({
  text: z.string().min(1, 'Text is required').max(1000, 'Text must be less than 1000 characters'),
});

type VoiceGenerationFormData = z.infer<typeof voiceGenerationSchema>;

interface GenerationResult {
  text: string;
  audioUrl: string;
}

const VoiceGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<VoiceGenerationFormData>({
    resolver: zodResolver(voiceGenerationSchema),
    defaultValues: {
      text: '',
    },
  });

  const watchedText = watch('text');

  const onSubmit = async (data: VoiceGenerationFormData) => {
    setIsGenerating(true);
    try {
      // Send request with default settings
      const payload = {
        text: data.text,
        voice: 'alloy',
        model: 'eleven_monolingual_v1',
      };
      const response = await axios.post('/api/ai/voice', payload);
      setResult(response.data.data);
      toast.success('Voice generated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to generate voice';
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const downloadAudio = async () => {
    if (result?.audioUrl) {
      try {
        const response = await fetch(result.audioUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `generated-voice-${new Date().toISOString().split('T')[0]}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Audio downloaded!');
      } catch (error) {
        toast.error('Failed to download audio');
      }
    }
  };

  const exampleTexts = [
    "Welcome to our AI-powered voice generation tool. Create natural-sounding speech from any text.",
    "The quick brown fox jumps over the lazy dog. This is a test of our voice synthesis capabilities.",
    "Hello! I'm excited to demonstrate the power of artificial intelligence in creating human-like speech.",
    "In a world where technology continues to advance, voice synthesis has become an essential tool.",
    "Thank you for using our platform. We hope you enjoy creating amazing audio content with AI."
  ];

  const insertExampleText = (text: string) => {
    const textarea = document.getElementById('text') as HTMLTextAreaElement;
    if (textarea) {
      textarea.value = text;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-4">
            <Volume2 size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Voice Generator</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Convert text to natural-sounding speech using advanced AI voice synthesis. 
          Create high-quality audio content from any text input.
        </p>
      </div>

      {/* Generated Audio Results - Displayed Above Input */}
      {result && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Generated Audio</h3>
            <button
              onClick={downloadAudio}
              className="btn-secondary flex items-center text-sm"
            >
              <Download size={16} className="mr-2" />
              Download
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="mb-4 text-sm text-gray-600">
                <strong>Text:</strong> {result.text}
              </div>
              
              <div className="flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={togglePlayback}
                      className="w-12 h-12 bg-primary-600 hover:bg-primary-700 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                      {isPlaying ? (
                        <Pause size={20} />
                      ) : (
                        <Play size={20} />
                      )}
                    </button>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        AI Generated Voice
                      </p>
                      <p className="text-xs text-gray-500">
                        High-quality speech synthesis
                      </p>
                    </div>
                  </div>
                  
                  <audio
                    ref={audioRef}
                    src={result.audioUrl}
                    onEnded={handleAudioEnded}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                  What would you like me to say?
                </label>
                <textarea
                  id="text"
                  rows={6}
                  {...register('text')}
                  className={`input-field resize-none ${errors.text ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="Enter the text you want to convert to speech... (e.g., Hello, welcome to our AI voice generator!)"
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {watchedText?.length || 0}/1000 characters
                  </span>
                  {errors.text && (
                    <span className="text-xs text-red-600">{errors.text.message}</span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full btn-primary flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Generating Voice...
                  </>
                ) : (
                  <>
                    <Sparkles className="-ml-1 mr-3 h-5 w-5" />
                    Generate Voice
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Example Texts */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Texts</h3>
            <div className="grid grid-cols-1 gap-3">
              {exampleTexts.map((text, index) => (
                <button
                  key={index}
                  onClick={() => insertExampleText(text)}
                  className="text-left p-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                >
                  {text.length > 80 ? `${text.substring(0, 80)}...` : text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Voice Generator Info */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Voice Generator</h3>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900">Powered by hexgrad/Kokoro-82M</h4>
                <p className="text-sm text-green-700 mt-1">
                </p>
              </div>
              
              <div className="text-sm text-gray-600">
                <h4 className="font-medium text-gray-900 mb-2">Perfect for:</h4>
                <ul className="space-y-1">
                  <li>• Audiobooks and narrations</li>
                  <li>• Presentations and tutorials</li>
                  <li>• Podcast intros and outros</li>
                  <li>• Voice-overs for videos</li>
                  <li>• Accessibility applications</li>
                  <li>• Language learning content</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Better Audio</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Use clear punctuation for natural pauses
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Keep sentences at a reasonable length
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Avoid excessive abbreviations or acronyms
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Use proper capitalization for better pronunciation
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceGenerator;
