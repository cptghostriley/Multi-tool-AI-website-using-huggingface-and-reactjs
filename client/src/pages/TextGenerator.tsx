import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Copy, Download, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const textGenerationSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(1000, 'Prompt must be less than 1000 characters'),
});

type TextGenerationFormData = z.infer<typeof textGenerationSchema>;

interface GenerationResult {
  prompt: string;
  generatedText: string;
}

const TextGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TextGenerationFormData>({
    resolver: zodResolver(textGenerationSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const watchedPrompt = watch('prompt');

  const onSubmit = async (data: TextGenerationFormData) => {
    setIsGenerating(true);
    try {
      // Send request with default model and settings
      const payload = {
        prompt: data.prompt,
        model: 'gpt-3.5-turbo',
        maxTokens: 500,
      };
      const response = await axios.post('/api/ai/text', payload);
      setResult(response.data.data);
      toast.success('Text generated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to generate text';
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (result?.generatedText) {
      try {
        await navigator.clipboard.writeText(result.generatedText);
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error('Failed to copy to clipboard');
      }
    }
  };

  const downloadText = () => {
    if (result?.generatedText) {
      const blob = new Blob([result.generatedText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-text-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Text downloaded!');
    }
  };

  const examplePrompts = [
    "Write a creative story about a time traveler who visits ancient Rome",
    "Create a professional email template for requesting a meeting",
    "Generate a blog post about the benefits of artificial intelligence",
    "Write a poem about the changing seasons",
    "Create a product description for a sustainable water bottle"
  ];

  const insertExamplePrompt = (prompt: string) => {
    const textarea = document.getElementById('prompt') as HTMLTextAreaElement;
    if (textarea) {
      textarea.value = prompt;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
            <Sparkles size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Text Generator</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Generate creative and professional text content using advanced AI. 
          Simply describe what you want and let AI create it for you.
        </p>
      </div>

      {/* Generated Text Results - Displayed Above Input */}
      {result && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Generated Text</h3>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                className="btn-secondary flex items-center text-sm"
              >
                <Copy size={16} className="mr-2" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={downloadText}
                className="btn-secondary flex items-center text-sm"
              >
                <Download size={16} className="mr-2" />
                Download
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="mb-4 text-sm text-gray-600">
              <strong>Prompt:</strong> {result.prompt}
            </div>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-gray-900">{result.generatedText}</p>
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
                  What would you like me to write?
                </label>
                <textarea
                  id="prompt"
                  rows={6}
                  {...register('prompt')}
                  className={`input-field resize-none ${errors.prompt ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="Describe what you want to generate... (e.g., Write a creative story about a robot learning to paint, Create a professional email template, Write a poem about the seasons)"
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
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="-ml-1 mr-3 h-5 w-5" />
                    Generate Text
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Example Prompts */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Prompts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

        {/* AI Writing Assistant Info */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Writing Assistant</h3>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Powered by <br /> meta-llama/Llama-3.1-8B-Instruct</h4>
                <p className="text-sm text-blue-700 mt-1">
                </p>
              </div>
              
              <div className="text-sm text-gray-600">
                <h4 className="font-medium text-gray-900 mb-2">What can I help you write?</h4>
                <ul className="space-y-1">
                  <li>• Creative stories and fiction</li>
                  <li>• Professional emails and letters</li>
                  <li>• Blog posts and articles</li>
                  <li>• Poetry and creative writing</li>
                  <li>• Product descriptions</li>
                  <li>• Social media content</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Better Results</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Be specific about the tone and style you want
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Include context and background information
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Specify the desired length and format
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Use clear, descriptive language in your prompts
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextGenerator;

