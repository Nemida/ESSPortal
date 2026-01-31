import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAutoRefresh } from '../hooks/useSocket';

const AdminGrievancesPage = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [analyses, setAnalyses] = useState({});

  const fetchGrievances = useCallback(async () => {
    try {
      const res = await api.get('/api/grievances');
      setGrievances(res.data);
    } catch (error) {
      console.error("Failed to fetch grievances", error);
      alert('Could not fetch grievances. Ensure you have admin privileges.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGrievances();
  }, [fetchGrievances]);

  // Listen for real-time updates
  useAutoRefresh('grievances', fetchGrievances);

  const analyzeGrievance = async (grievance) => {
    setAnalyzingId(grievance.grievance_id);
    try {
      const res = await api.post('/api/ai/analyze-grievance', {
        subject: grievance.grievance_subject,
        details: grievance.grievance_details,
      });
      setAnalyses(prev => ({
        ...prev,
        [grievance.grievance_id]: res.data,
      }));
    } catch (error) {
      console.error("Failed to analyze grievance", error);
      alert('Could not analyze grievance. AI service may be unavailable.');
    } finally {
      setAnalyzingId(null);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-green-100 text-green-800 border-green-300',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getSentimentEmoji = (sentiment) => {
    const emojis = {
      urgent: '🚨',
      negative: '😟',
      neutral: '😐',
      positive: '😊',
    };
    return emojis[sentiment] || '❓';
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2c3e50]">Grievance Inbox</h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600">Review and analyze employee grievances with AI assistance</p>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
              <span>🤖</span> AI-Powered
            </span>
          </div>
        </div>
        
        <div className="mt-8 space-y-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : grievances.length > 0 ? (
            grievances.map(item => {
              const analysis = analyses[item.grievance_id];
              return (
                <div key={item.grievance_id} className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="p-4 sm:p-5 bg-gray-50">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-3 mb-3">
                      <div className="flex-1">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{item.grievance_subject}</h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          Submitted: {new Date(item.submitted_at).toLocaleString()}
                        </p>
                      </div>
                      {analysis && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(analysis.suggestedPriority)}`}>
                          {analysis.suggestedPriority?.toUpperCase()} PRIORITY
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border">
                      {item.grievance_details}
                    </p>
                    
                    {!analysis && (
                      <button
                        onClick={() => analyzeGrievance(item)}
                        disabled={analyzingId === item.grievance_id}
                        className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 flex items-center gap-2 transition"
                      >
                        {analyzingId === item.grievance_id ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <span>🤖</span> Analyze with AI
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  
                  {/* AI Analysis Results */}
                  {analysis && (
                    <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-t">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🤖</span>
                        <h3 className="font-semibold text-indigo-800">AI Analysis</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                        <div className="bg-white p-3 rounded-lg border">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Sentiment</p>
                          <p className="text-lg font-medium mt-1">
                            {getSentimentEmoji(analysis.sentiment)} {analysis.sentiment}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Severity</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${analysis.severity > 7 ? 'bg-red-500' : analysis.severity > 4 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${analysis.severity * 10}%` }}
                              />
                            </div>
                            <span className="font-medium">{analysis.severity}/10</span>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Category</p>
                          <p className="text-lg font-medium mt-1">{analysis.category}</p>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg border mb-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Summary</p>
                        <p className="text-gray-700">{analysis.summary}</p>
                      </div>
                      
                      <div className="bg-white p-3 rounded-lg border mb-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Suggested Action</p>
                        <p className="text-gray-700">{analysis.suggestedAction}</p>
                      </div>
                      
                      {analysis.keywords && analysis.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {analysis.keywords.map((keyword, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white text-gray-600 text-xs rounded-full border">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 py-10">No grievances have been submitted.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGrievancesPage;