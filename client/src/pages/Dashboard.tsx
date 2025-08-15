import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Type, 
  Image, 
  Volume2, 
  ArrowRight, 
  Clock, 
  Activity,
  Sparkles,
  Zap,
  Palette,
  Mic
} from 'lucide-react';
import axios from 'axios';

interface ActivityItem {
  id: number;
  tool_type: string;
  input_data: string;
  output_data: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const tools = [
    {
      name: 'Text Generator',
      description: 'Generate creative text content using advanced AI models',
      icon: Type,
      href: '/text-generator',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      features: ['Uses meta-llama/Llama-3.1-8B-Instruct']
    },
    {
      name: 'Image Generator',
      description: 'Create stunning images from text descriptions',
      icon: Image,
      href: '/image-generator',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      features: ['Uses black-forest-labs/FLUX.1-schnell']
    },
    {
      name: 'Voice Generator',
      description: 'Convert text to natural-sounding speech instantly',
      icon: Volume2,
      href: '/voice-generator',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      features: ['Uses hexgrad/Kokoro-82M']
    }
  ];

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const response = await axios.get('/api/auth/activity');
        setRecentActivity(response.data.activity);
      } catch (error) {
        console.error('Failed to fetch activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getToolIcon = (toolType: string) => {
    switch (toolType) {
      case 'text_generation':
        return <Type size={16} className="text-blue-600" />;
      case 'image_generation':
        return <Image size={16} className="text-purple-600" />;
      case 'voice_generation':
        return <Volume2 size={16} className="text-green-600" />;
      default:
        return <Activity size={16} className="text-gray-600" />;
    }
  };

  const getToolName = (toolType: string) => {
    switch (toolType) {
      case 'text_generation':
        return 'Text Generation';
      case 'image_generation':
        return 'Image Generation';
      case 'voice_generation':
        return 'Voice Generation';
      default:
        return 'Unknown Tool';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.username}! 👋</h1>
            <p className="mt-2 text-primary-100">
              Ready to create something amazing with AI? Explore our powerful tools below.
            </p>
          </div>
          <div className="hidden sm:block">
            <Sparkles size={48} className="text-primary-200" />
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.name}
                to={tool.href}
                className="group block"
              >
                <div className={`${tool.bgColor} rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 group-hover:scale-105`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-lg flex items-center justify-center`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <ArrowRight size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                  
                  <div className="space-y-2">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-500">
                        <Zap size={12} className="mr-2 text-yellow-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Clock size={20} className="text-gray-400" />
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {getToolIcon(activity.tool_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {getToolName(activity.tool_type)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {JSON.parse(activity.input_data)?.prompt || JSON.parse(activity.input_data)?.text || 'Generated content'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No activity yet. Start using our AI tools!</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Type size={20} className="text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Text Generations</p>
                  <p className="text-xs text-gray-500">AI-powered content</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {recentActivity.filter(a => a.tool_type === 'text_generation').length}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <Palette size={20} className="text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Images Created</p>
                  <p className="text-xs text-gray-500">Visual content</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-purple-600">
                {recentActivity.filter(a => a.tool_type === 'image_generation').length}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Mic size={20} className="text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Voice Generations</p>
                  <p className="text-xs text-gray-500">Audio content</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {recentActivity.filter(a => a.tool_type === 'voice_generation').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
