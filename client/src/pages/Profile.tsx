import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Calendar, 
  Activity, 
  Clock, 
  Type, 
  Image as ImageIcon, 
  Volume2,
  Download,
  Trash2
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ActivityItem {
  id: number;
  tool_type: string;
  input_data: string;
  output_data: string;
  created_at: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get('/api/auth/activity');
        setRecentActivity(response.data.activity);
      } catch (error) {
        console.error('Failed to fetch activity:', error);
        toast.error('Failed to load activity history');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
        return <ImageIcon size={16} className="text-purple-600" />;
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

  const getToolColor = (toolType: string) => {
    switch (toolType) {
      case 'text_generation':
        return 'bg-blue-100 text-blue-800';
      case 'image_generation':
        return 'bg-purple-100 text-purple-800';
      case 'voice_generation':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadActivity = (activity: ActivityItem) => {
    try {
      const inputData = JSON.parse(activity.input_data);
      const outputData = JSON.parse(activity.output_data);
      
      let content = '';
      if (activity.tool_type === 'text_generation') {
        content = `Prompt: ${inputData.prompt}\n\nGenerated Text:\n${outputData.result}`;
      } else if (activity.tool_type === 'image_generation') {
        content = `Prompt: ${inputData.prompt}\nImage URL: ${outputData.imageUrl}`;
      } else if (activity.tool_type === 'voice_generation') {
        content = `Text: ${inputData.text}\nAudio URL: ${outputData.audioUrl}`;
      }

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activity.tool_type}-${activity.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Activity downloaded!');
    } catch (error) {
      toast.error('Failed to download activity');
    }
  };

  const deleteActivity = async (activityId: number) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await axios.delete(`/api/auth/activity/${activityId}`);
        setRecentActivity(prev => prev.filter(activity => activity.id !== activityId));
        toast.success('Activity deleted successfully');
      } catch (error) {
        toast.error('Failed to delete activity');
      }
    }
  };

  const stats = {
    total: recentActivity.length,
    text: recentActivity.filter(a => a.tool_type === 'text_generation').length,
    image: recentActivity.filter(a => a.tool_type === 'image_generation').length,
    voice: recentActivity.filter(a => a.tool_type === 'voice_generation').length,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mr-4">
            <User size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Manage your account and view your AI tool usage history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{user?.username}</h4>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm">
                  <Mail size={16} className="text-gray-400 mr-3" />
                  <span className="text-gray-600">{user?.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar size={16} className="text-gray-400 mr-3" />
                  <span className="text-gray-600">
                    Joined {user?.created_at ? formatDate(user.created_at) : 'Recently'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Type size={20} className="text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Text Generations</p>
                    <p className="text-xs text-gray-500">AI-powered content</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-600">{stats.text}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <ImageIcon size={20} className="text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Images Created</p>
                    <p className="text-xs text-gray-500">Visual content</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-purple-600">{stats.image}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Volume2 size={20} className="text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Voice Generations</p>
                    <p className="text-xs text-gray-500">Audio content</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">{stats.voice}</span>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Total Activities</span>
                  <span className="text-lg font-bold text-primary-600">{stats.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity History */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock size={20} className="mr-2" />
                Recent Activity
              </h3>
              <span className="text-sm text-gray-500">
                {recentActivity.length} activities
              </span>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getToolIcon(activity.tool_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-sm font-medium text-gray-900">
                              {getToolName(activity.tool_type)}
                            </h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getToolColor(activity.tool_type)}`}>
                              {activity.tool_type.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            {(() => {
                              try {
                                const inputData = JSON.parse(activity.input_data);
                                if (activity.tool_type === 'text_generation') {
                                  return `Prompt: ${inputData.prompt?.substring(0, 100)}${inputData.prompt?.length > 100 ? '...' : ''}`;
                                } else if (activity.tool_type === 'image_generation') {
                                  return `Prompt: ${inputData.prompt?.substring(0, 100)}${inputData.prompt?.length > 100 ? '...' : ''}`;
                                } else if (activity.tool_type === 'voice_generation') {
                                  return `Text: ${inputData.text?.substring(0, 100)}${inputData.text?.length > 100 ? '...' : ''}`;
                                }
                                return 'Generated content';
                              } catch {
                                return 'Generated content';
                              }
                            })()}
                          </div>
                          
                          <p className="text-xs text-gray-400">
                            {formatDate(activity.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => downloadActivity(activity)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => deleteActivity(activity.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
