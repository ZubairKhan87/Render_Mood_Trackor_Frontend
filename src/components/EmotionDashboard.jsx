import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Calendar, Clock, ChevronDown, BarChart2, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import './EmotionDashboard.css';
import axiosInstance from './axiosInstance';
const EmotionDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeRange, setTimeRange] = useState('day');
  const [interval, setInterval] = useState('hour');
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('trends');
  const [selectedEmotions, setSelectedEmotions] = useState({});

  const emotionColors = {
    happy: '#10B981',
    sad: '#60A5FA',
    angry: '#EF4444',
    relaxed: '#8B5CF6',
    excited: '#F59E0B',
    fear: '#6366F1',
    scared: '#4B5563',
    joyful: '#EC4899',
    depressed: '#1F2937',
    peaceful: '#06B6D4',
    confident: '#14B8A6',
    love: '#F43F5E',
    disappointed: '#6B7280'
  };
  const timeRangeOptions = [
    { value: 'day', label: 'Last 24 Hours', Icon: Clock, interval: 'hour' },
    { value: 'month', label: 'Last 30 Days', Icon: Calendar, interval: 'day' },
    { value: 'year', label: 'Last Year', Icon: Calendar, interval: 'month' }
  ];

  const tabs = [
    { id: 'trends', label: 'Emotion Trends', Icon: TrendingUp },
    { id: 'distribution', label: 'Distribution', Icon: PieChartIcon },
    { id: 'timeline', label: 'Timeline', Icon: BarChart2 }
  ];

  useEffect(() => {
    if (analyticsData?.emotion_distribution) {
      // Initialize selected emotions based on the distribution data
      const emotionsFromDistribution = analyticsData.emotion_distribution.map(
        (item) => item.mood
      );
      const initialEmotions = emotionsFromDistribution.reduce(
        (acc, emotion) => {
          acc[emotion] = true;
          return acc;
        },
        {}
      );
      setSelectedEmotions(initialEmotions);
    }
  }, [analyticsData]);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, interval]);

  const fetchAnalytics = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/analytics/?range=${timeRange}&interval=${interval}`,
        { withCredentials: true } // Ensure cookies are sent
      );

      const data = response.data;

      // Process the time series data to include all emotions
      if (data.emotion_distribution && data.emotions_over_time) {
        const allEmotions = data.emotion_distribution.map((item) => item.mood);
        const processedTimeData = data.emotions_over_time.map((timePoint) => {
          const newTimePoint = { period: timePoint.period };
          allEmotions.forEach((emotion) => {
            newTimePoint[emotion] = timePoint[emotion] || 0;
          });
          return newTimePoint;
        });
        data.emotions_over_time = processedTimeData;
      }

      setAnalyticsData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setIsLoading(false);
    }
  };


  const handleLegendClick = (emotion) => {
    setSelectedEmotions(prev => ({
      ...prev,
      [emotion]: !prev[emotion]
    }));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    switch(timeRange) {
      case 'day':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case 'month':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      case 'year':
        return date.toLocaleDateString([], { month: 'short', year: 'numeric' });
      default:
        return date.toLocaleDateString();
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{formatTimestamp(label)}</p>
          <div className="tooltip-content">
            {payload.map((entry, index) => (
              <div key={index} className="tooltip-item">
                <div 
                  className="tooltip-color-indicator"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="tooltip-name">{entry.name}:</span>
                <span className="tooltip-value">{Math.round(entry.value)}%</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const RenderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const RADIAN = Math.PI / 180;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (isLoading || !analyticsData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Get all available emotions from the distribution data
  const availableEmotions = analyticsData.emotion_distribution.map(item => item.mood);

  const currentTimeRange = timeRangeOptions.find(opt => opt.value === timeRange);
  const CurrentIcon = currentTimeRange.Icon;

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header Section */}
        <div className="header-card">
          <div className="header-content">
            <h1 className="dashboard-title">Track and Explore Your Emotions</h1>
            
            <div className="time-range-selector">
              <button 
                className="time-range-button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <CurrentIcon className="icon" />
                <span>{currentTimeRange.label}</span>
                <ChevronDown className="icon" />
              </button>
              
              {dropdownOpen && (
                <div className="dropdown-menu">
                  {timeRangeOptions.map((option) => {
                    const OptionIcon = option.Icon;
                    return (
                      <button
                        key={option.value}
                        className="dropdown-item"
                        onClick={() => {
                          setTimeRange(option.value);
                          setInterval(option.interval);
                          setDropdownOpen(false);
                        }}
                      >
                        <OptionIcon className="icon" />
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="tabs-container">
            {tabs.map((tab) => {
              const TabIcon = tab.Icon;
              return (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <TabIcon className="icon" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="main-chart-card">
            {activeTab === 'trends' && analyticsData.emotions_over_time && (
              <div className="chart-container">
                <h2 className="chart-title">Emotion Trends Over Time</h2>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.emotions_over_time}>
                    <defs>
                      {availableEmotions.map((emotion) => (
                        <linearGradient key={emotion} id={`gradient-${emotion}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={emotionColors[emotion]} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={emotionColors[emotion]} stopOpacity={0.1}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
                    <XAxis 
                      dataKey="period" 
                      tickFormatter={formatTimestamp}
                      className="chart-axis"
                    />
                    <YAxis className="chart-axis" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      onClick={(e) => handleLegendClick(e.value)}
                      wrapperStyle={{ cursor: 'pointer' }}
                    />
                    {availableEmotions.map((emotion) => (
                      selectedEmotions[emotion] && (
                        <Area
                          key={emotion}
                          type="monotone"
                          dataKey={emotion}
                          name={emotion}
                          stroke={emotionColors[emotion]}
                          fill={`url(#gradient-${emotion})`}
                          strokeWidth={2}
                        />
                      )
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeTab === 'distribution' && (
              <div className="chart-container">
                <h2 className="chart-title">Emotion Distribution</h2>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.emotion_distribution}
                      dataKey="count"
                      nameKey="mood"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label={RenderCustomizedLabel}
                      labelLine={false}
                      onClick={(data) => handleLegendClick(data.mood)}
                      className="pie-chart"
                    >
                      {analyticsData.emotion_distribution.map((entry) => (
                        <Cell 
                          key={entry.mood} 
                          fill={emotionColors[entry.mood]}
                          opacity={selectedEmotions[entry.mood] ? 1 : 0.3}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend 
                      onClick={(e) => handleLegendClick(e.value)}
                      wrapperStyle={{ cursor: 'pointer' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeTab === 'timeline' && analyticsData.emotions_over_time && (
              <div className="chart-container">
                <h2 className="chart-title">Emotion Timeline</h2>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.emotions_over_time}>
                    <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
                    <XAxis dataKey="period" tickFormatter={formatTimestamp} className="chart-axis" />
                    <YAxis className="chart-axis" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      onClick={(e) => handleLegendClick(e.value)}
                      wrapperStyle={{ cursor: 'pointer' }}
                    />
                    {availableEmotions.map((emotion) => (
                      selectedEmotions[emotion] && (
                        <Bar
                          key={emotion}
                          dataKey={emotion}
                          name={emotion}
                          fill={emotionColors[emotion]}
                          stackId="a"
                        />
                      )
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="recent-emotions-card">
            <h2 className="chart-title">Your Recent Emotional Journey</h2>
            <div className="emotions-list">
              {analyticsData.recent_emotions.map((emotion, index) => (
                <div 
                  key={index}
                  className="emotion-item"
                >
                  <div className="emotion-item-content">
                    <div 
                      className="emotion-indicator"
                      style={{ backgroundColor: emotionColors[emotion.mood] }}
                    />
                    <div className="emotion-details">
                      <span className="emotion-name">{emotion.mood}</span>
                      <span className="emotion-emoji">{emotion.emojis}</span>
                    </div>
                  </div>
                  <span className="emotion-timestamp">
                    {new Date(emotion.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionDashboard;