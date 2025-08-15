import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Image as ImageIcon, Download, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const imageGenerationSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(1000, 'Prompt must be less than 1000 characters'),
});

type ImageGenerationFormData = z.infer<typeof imageGenerationSchema>;

interface GenerationResult {
  prompt: string;
  imageUrl: string;
}

const ImageGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ImageGenerationFormData>({
    resolver: zodResolver(imageGenerationSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const watchedPrompt = watch('prompt');

  const onSubmit = async (data: ImageGenerationFormData) => {
    setIsGenerating(true);
    try {
      // Send request with default settings
      const payload = {
        prompt: data.prompt,
        size: '512x512',
        style: 'realistic',
      };
      const response = await axios.post('/api/ai/image', payload);
      setResult(response.data.data);
      toast.success('Image generated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to generate image';
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (result?.imageUrl) {
      try {
        const response = await fetch(result.imageUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `generated-image-${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Image downloaded!');
      } catch (error) {
        toast.error('Failed to download image');
      }
    }
  };

  const examplePrompts = [
    "A majestic dragon soaring over a medieval castle",
    "A futuristic city with flying cars and neon lights",
    "A serene forest with a crystal clear lake and mountains",
    "A cute robot playing with a cat in a garden",
    "An underwater scene with colorful coral reefs and fish"
  ];

  const insertExamplePrompt = (prompt: string) => {
    const textarea = document.getElementById('prompt') as HTMLTextAreaElement;
    if (textarea) {
      textarea.value = prompt;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
            <ImageIcon size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Image Generator</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create stunning, high-quality images from your text descriptions using advanced AI. 
          Simply describe what you want to see and let our AI bring it to life.
        </p>
      </div>

      {/* Generated Image Results - Displayed Above Input */}
      {result && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Generated Image</h3>
            <button
              onClick={downloadImage}
              className="btn-secondary flex items-center text-sm"
            >
              <Download size={16} className="mr-2" />
              Download
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="mb-4 text-sm text-gray-600">
                <strong>Prompt:</strong> {result.prompt}
              </div>
              
              <div className="flex justify-center">
                <img
                  src={result.imageUrl}
                  alt="AI generated artwork"
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  style={{ maxHeight: '500px' }}
                />
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
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                  What would you like me to create?
                </label>
                <textarea
                  id="prompt"
                  rows={4}
                  {...register('prompt')}
                  className={`input-field resize-none ${errors.prompt ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="Describe the image you want to generate... (e.g., A majestic dragon soaring over a medieval castle)"
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {watchedPrompt?.length || 0}/1000 characters
                  </span>
                  {errors.prompt && (
                    <span className="text-xs text-red-600">{errors.prompt.message}</span>
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
                    Generating Image...
                  </>
                ) : (
                  <>
                    <Sparkles className="-ml-1 mr-3 h-5 w-5" />
                    Generate Image
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Example Prompts */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Prompts</h3>
            <div className="grid grid-cols-1 gap-3">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => insertExamplePrompt(prompt)}
                  className="text-left p-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Image Generator Info */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Image Generator</h3>
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900">Powered by <br />black-forest-labs/FLUX.1-schnell</h4>
                <p className="text-sm text-purple-700 mt-1">
                </p>
              </div>
              
              <div className="text-sm text-gray-600">
                <h4 className="font-medium text-gray-900 mb-2">What can I create?</h4>
                <ul className="space-y-1">
                  <li>• Fantasy and sci-fi artwork</li>
                  <li>• Realistic scenes and landscapes</li>
                  <li>• Character designs and portraits</li>
                  <li>• Abstract and artistic compositions</li>
                  <li>• Product mockups and concepts</li>
                  <li>• Architectural visualizations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Better Images</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                Be specific about colors, lighting, and mood
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                Include artistic style references (e.g., "in watercolor style")
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                Describe composition and camera angles
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                Use descriptive adjectives for better results
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
