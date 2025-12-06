'use client';

import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export interface SpiderChartData {
  technicalSkills: number;
  riskTolerance: number;
  communityEngagement: number;
  timeCommitment: number;
  web3Depth: number;
  builderMindset: number;
}

interface SpiderChartProps {
  data: SpiderChartData;
  track?: 'builder' | 'explorer';
}

export function SpiderChart({ data, track = 'explorer' }: SpiderChartProps) {
  const accentColor = track === 'builder' ? '#CFFF04' : '#2CFF05';
  const accentColorRgb = track === 'builder' ? '207, 255, 4' : '44, 255, 5';

  const chartData = {
    labels: [
      'Technical Skills',
      'Risk Tolerance',
      'Community',
      'Time Investment',
      'Web3 Depth',
      'Builder Mindset',
    ],
    datasets: [
      {
        label: track === 'builder' ? 'Builder Profile' : 'Explorer Profile',
        data: [
          data.technicalSkills,
          data.riskTolerance,
          data.communityEngagement,
          data.timeCommitment,
          data.web3Depth,
          data.builderMindset,
        ],
        backgroundColor: `rgba(${accentColorRgb}, 0.2)`,
        borderColor: accentColor,
        borderWidth: 2,
        pointBackgroundColor: accentColor,
        pointBorderColor: '#000',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: accentColor,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 5,
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11,
            weight: 500,
          },
        },
        ticks: {
          display: false,
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: accentColor,
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="h-[280px] w-full">
      <Radar data={chartData} options={options} />
    </div>
  );
}

// Default empty data
export const defaultSpiderData: SpiderChartData = {
  technicalSkills: 0,
  riskTolerance: 0,
  communityEngagement: 0,
  timeCommitment: 0,
  web3Depth: 0,
  builderMindset: 0,
};

