import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import SegmentCard from '../components/SegmentCard'
import ComparisonChart from '../components/ComparisonChart'
import AIRecommendations from '../components/AIRecommendations'
import './CompetitiveDashboard.css'

const COMPETITOR_DATA: Record<string, any> = {
  'Bannari Amman Institute of Technology': {
    placementPercent: {
      'Bannari Amman Institute of Technology': 92,
      'PSG College of Technology': 88,
      'Kumaraguru College of Technology': 85,
      'Kongu Engineering College': 80,
      'Sri Krishna College of Engineering and Technology': 91,
      'PSG Institute of Technology and Applied Research': 88,
      'Coimbatore Institute of Technology': 88,
    },
    avgSalary: {
      'Bannari Amman Institute of Technology': 6.2,
      'PSG College of Technology': 6.0,
      'Kumaraguru College of Technology': 5.8,
      'Kongu Engineering College': 4.5,
      'Sri Krishna College of Engineering and Technology': 6.2,
      'PSG Institute of Technology and Applied Research': 6.1,
      'Coimbatore Institute of Technology': 5.0,
    },
    highestSalary: {
      'Bannari Amman Institute of Technology': 28,
      'PSG College of Technology': 25,
      'Kumaraguru College of Technology': 24,
      'Kongu Engineering College': 21,
      'Sri Krishna College of Engineering and Technology': 47,
      'PSG Institute of Technology and Applied Research': 36,
      'Coimbatore Institute of Technology': 51,
    },
    roi: {
      'Bannari Amman Institute of Technology': 72,
      'PSG College of Technology': 65,
      'Kumaraguru College of Technology': 60,
      'Kongu Engineering College': 62,
      'Sri Krishna College of Engineering and Technology': 68,
      'PSG Institute of Technology and Applied Research': 66,
      'Coimbatore Institute of Technology': 65,
    },
    research: [
      { 
        year: '2019', 
        'Bannari Amman Institute of Technology': 8,
        'PSG College of Technology': 10,
        'Kumaraguru College of Technology': 5,
        'Kongu Engineering College': 7,
        'Sri Krishna College of Engineering and Technology': 6,
        'PSG Institute of Technology and Applied Research': 2,
        'Coimbatore Institute of Technology': 9,
      },
      { 
        year: '2020', 
        'Bannari Amman Institute of Technology': 10,
        'PSG College of Technology': 12,
        'Kumaraguru College of Technology': 7,
        'Kongu Engineering College': 8,
        'Sri Krishna College of Engineering and Technology': 8,
        'PSG Institute of Technology and Applied Research': 5,
        'Coimbatore Institute of Technology': 11,
      },
      { 
        year: '2021', 
        'Bannari Amman Institute of Technology': 12,
        'PSG College of Technology': 15,
        'Kumaraguru College of Technology': 9,
        'Kongu Engineering College': 9,
        'Sri Krishna College of Engineering and Technology': 10,
        'PSG Institute of Technology and Applied Research': 7,
        'Coimbatore Institute of Technology': 13,
      },
      { 
        year: '2022', 
        'Bannari Amman Institute of Technology': 14,
        'PSG College of Technology': 18,
        'Kumaraguru College of Technology': 11,
        'Kongu Engineering College': 11,
        'Sri Krishna College of Engineering and Technology': 12,
        'PSG Institute of Technology and Applied Research': 9,
        'Coimbatore Institute of Technology': 15,
      },
      { 
        year: '2023', 
        'Bannari Amman Institute of Technology': 16,
        'PSG College of Technology': 20,
        'Kumaraguru College of Technology': 12,
        'Kongu Engineering College': 12,
        'Sri Krishna College of Engineering and Technology': 14,
        'PSG Institute of Technology and Applied Research': 10,
        'Coimbatore Institute of Technology': 19,
      },
    ],
    alumniSize: {
      'Bannari Amman Institute of Technology': 18000,
      'PSG College of Technology': 25000,
      'Kumaraguru College of Technology': 20000,
      'Kongu Engineering College': 15000,
      'Sri Krishna College of Engineering and Technology': 16000,
      'PSG Institute of Technology and Applied Research': 6000,
      'Coimbatore Institute of Technology': 16000,
    },
    nicheAreas: {
      'Bannari Amman Institute of Technology': ['Automotive', 'AI for Manufacturing'],
      'PSG College of Technology': ['Aerospace', 'AI'],
      'Kumaraguru College of Technology': ['Cybersecurity', 'Data Science'],
      'Kongu Engineering College': ['Manufacturing', 'Entrepreneurship'],
      'Sri Krishna College of Engineering and Technology': ['Cloud Computing', 'Robotics'],
      'PSG Institute of Technology and Applied Research': ['IoT', 'Embedded Systems'],
      'Coimbatore Institute of Technology': ['Civil', 'Software'],
    },
    segments: {
      'Institutional Profile': { Established: 1990, Campus: 'Rural', Type: 'Private' },
      'Academic Excellence': { 'Faculty-Student Ratio': '1:18', Accreditation: 'NBA, NAAC A' },
      'Career Opportunities': { 'Top Recruiters': ['TCS', 'Infosys', 'Amazon'], 'Avg Placement': '6.2 LPA' },
      'Industry & Global Exposure': { 'MoUs': 45, 'International Partners': 8 },
      'Student Experience & Campus Life': { Clubs: ['Robotics', 'AI Club'], Hostel: 'Available' },
      'Financial Factors': { Tuition: 'Moderate', Scholarships: 'Merit & Need' },
      'Innovation & Entrepreneurship': { 'Incubation Centre': 'Yes', Startups: 12 },
      'Alumni Network & Legacy': { 'Alumni Strength': 18000, Chapters: 10 },
    },
  },
  'PSG College of Technology': {
    placementPercent: {
      'Bannari Amman Institute of Technology': 92,
      'PSG College of Technology': 88,
      'Kumaraguru College of Technology': 85,
      'Kongu Engineering College': 80,
      'Sri Krishna College of Engineering and Technology': 91,
      'PSG Institute of Technology and Applied Research': 88,
      'Coimbatore Institute of Technology': 88,
    },
    avgSalary: {
      'Bannari Amman Institute of Technology': 6.2,
      'PSG College of Technology': 6.0,
      'Kumaraguru College of Technology': 5.8,
      'Kongu Engineering College': 4.5,
      'Sri Krishna College of Engineering and Technology': 6.2,
      'PSG Institute of Technology and Applied Research': 6.1,
      'Coimbatore Institute of Technology': 5.0,
    },
    highestSalary: {
      'Bannari Amman Institute of Technology': 28,
      'PSG College of Technology': 25,
      'Kumaraguru College of Technology': 24,
      'Kongu Engineering College': 21,
      'Sri Krishna College of Engineering and Technology': 47,
      'PSG Institute of Technology and Applied Research': 36,
      'Coimbatore Institute of Technology': 51,
    },
    roi: {
      'Bannari Amman Institute of Technology': 72,
      'PSG College of Technology': 65,
      'Kumaraguru College of Technology': 60,
      'Kongu Engineering College': 62,
      'Sri Krishna College of Engineering and Technology': 68,
      'PSG Institute of Technology and Applied Research': 66,
      'Coimbatore Institute of Technology': 65,
    },
    research: [
      { 
        year: '2019', 
        'Bannari Amman Institute of Technology': 8,
        'PSG College of Technology': 10,
        'Kumaraguru College of Technology': 5,
        'Kongu Engineering College': 7,
        'Sri Krishna College of Engineering and Technology': 6,
        'PSG Institute of Technology and Applied Research': 2,
        'Coimbatore Institute of Technology': 9,
      },
      { 
        year: '2020', 
        'Bannari Amman Institute of Technology': 10,
        'PSG College of Technology': 12,
        'Kumaraguru College of Technology': 7,
        'Kongu Engineering College': 8,
        'Sri Krishna College of Engineering and Technology': 8,
        'PSG Institute of Technology and Applied Research': 5,
        'Coimbatore Institute of Technology': 11,
      },
      { 
        year: '2021', 
        'Bannari Amman Institute of Technology': 12,
        'PSG College of Technology': 15,
        'Kumaraguru College of Technology': 9,
        'Kongu Engineering College': 9,
        'Sri Krishna College of Engineering and Technology': 10,
        'PSG Institute of Technology and Applied Research': 7,
        'Coimbatore Institute of Technology': 13,
      },
      { 
        year: '2022', 
        'Bannari Amman Institute of Technology': 14,
        'PSG College of Technology': 18,
        'Kumaraguru College of Technology': 11,
        'Kongu Engineering College': 11,
        'Sri Krishna College of Engineering and Technology': 12,
        'PSG Institute of Technology and Applied Research': 9,
        'Coimbatore Institute of Technology': 15,
      },
      { 
        year: '2023', 
        'Bannari Amman Institute of Technology': 16,
        'PSG College of Technology': 20,
        'Kumaraguru College of Technology': 12,
        'Kongu Engineering College': 12,
        'Sri Krishna College of Engineering and Technology': 14,
        'PSG Institute of Technology and Applied Research': 10,
        'Coimbatore Institute of Technology': 19,
      },
    ],
    alumniSize: {
      'PSG College of Technology': 25000,
      'Bannari Amman Institute of Technology': 18000,
      'Kumaraguru College of Technology': 20000,
      'Kongu Engineering College': 15000,
      'Sri Krishna College of Engineering and Technology': 16000,
      'PSG Institute of Technology and Applied Research': 6000,
      'Coimbatore Institute of Technology': 16000,
    },
    nicheAreas: {
      'PSG College of Technology': ['Aerospace', 'AI'],
      'Bannari Amman Institute of Technology': ['Automotive', 'AI for Manufacturing'],
      'Kumaraguru College of Technology': ['Cybersecurity', 'Data Science'],
      'Kongu Engineering College': ['Manufacturing', 'Entrepreneurship'],
      'Sri Krishna College of Engineering and Technology': ['Cloud Computing', 'Robotics'],
      'PSG Institute of Technology and Applied Research': ['IoT', 'Embedded Systems'],
      'Coimbatore Institute of Technology': ['Civil', 'Software'],
    },
    segments: {
      'Institutional Profile': { Established: 1951, Campus: 'Urban', Type: 'Autonomous' },
      'Academic Excellence': { 'Faculty-Student Ratio': '1:16', Accreditation: 'NBA, NAAC A+' },
      'Career Opportunities': { 'Top Recruiters': ['Cognizant', 'Microsoft', 'Tesla'], 'Avg Placement': '6.0 LPA' },
      'Industry & Global Exposure': { 'MoUs': 60, 'International Partners': 12 },
      'Student Experience & Campus Life': { Clubs: ['Aero Club', 'Design Cell'], Hostel: 'Available' },
      'Financial Factors': { Tuition: 'High', Scholarships: 'Merit' },
      'Innovation & Entrepreneurship': { 'Incubation Centre': 'Yes', Startups: 30 },
      'Alumni Network & Legacy': { 'Alumni Strength': 25000, Chapters: 25 },
    },
  },
  'Kumaraguru College of Technology': {
    placementPercent: {
      'Bannari Amman Institute of Technology': 92,
      'PSG College of Technology': 88,
      'Kumaraguru College of Technology': 85,
      'Kongu Engineering College': 80,
      'Sri Krishna College of Engineering and Technology': 91,
      'PSG Institute of Technology and Applied Research': 88,
      'Coimbatore Institute of Technology': 88,
    },
    avgSalary: {
      'Bannari Amman Institute of Technology': 6.2,
      'PSG College of Technology': 6.0,
      'Kumaraguru College of Technology': 5.8,
      'Kongu Engineering College': 4.5,
      'Sri Krishna College of Engineering and Technology': 6.2,
      'PSG Institute of Technology and Applied Research': 6.1,
      'Coimbatore Institute of Technology': 5.0,
    },
    highestSalary: {
      'Bannari Amman Institute of Technology': 28,
      'PSG College of Technology': 25,
      'Kumaraguru College of Technology': 24,
      'Kongu Engineering College': 21,
      'Sri Krishna College of Engineering and Technology': 47,
      'PSG Institute of Technology and Applied Research': 36,
      'Coimbatore Institute of Technology': 51,
    },
    roi: {
      'Bannari Amman Institute of Technology': 72,
      'PSG College of Technology': 65,
      'Kumaraguru College of Technology': 60,
      'Kongu Engineering College': 62,
      'Sri Krishna College of Engineering and Technology': 68,
      'PSG Institute of Technology and Applied Research': 66,
      'Coimbatore Institute of Technology': 65,
    },
    research: [
      { 
        year: '2019', 
        'Bannari Amman Institute of Technology': 8,
        'PSG College of Technology': 10,
        'Kumaraguru College of Technology': 5,
        'Kongu Engineering College': 7,
        'Sri Krishna College of Engineering and Technology': 6,
        'PSG Institute of Technology and Applied Research': 2,
        'Coimbatore Institute of Technology': 9,
      },
      { 
        year: '2020', 
        'Bannari Amman Institute of Technology': 10,
        'PSG College of Technology': 12,
        'Kumaraguru College of Technology': 7,
        'Kongu Engineering College': 8,
        'Sri Krishna College of Engineering and Technology': 8,
        'PSG Institute of Technology and Applied Research': 5,
        'Coimbatore Institute of Technology': 11,
      },
      { 
        year: '2021', 
        'Bannari Amman Institute of Technology': 12,
        'PSG College of Technology': 15,
        'Kumaraguru College of Technology': 9,
        'Kongu Engineering College': 9,
        'Sri Krishna College of Engineering and Technology': 10,
        'PSG Institute of Technology and Applied Research': 7,
        'Coimbatore Institute of Technology': 13,
      },
      { 
        year: '2022', 
        'Bannari Amman Institute of Technology': 14,
        'PSG College of Technology': 18,
        'Kumaraguru College of Technology': 11,
        'Kongu Engineering College': 11,
        'Sri Krishna College of Engineering and Technology': 12,
        'PSG Institute of Technology and Applied Research': 9,
        'Coimbatore Institute of Technology': 15,
      },
      { 
        year: '2023', 
        'Bannari Amman Institute of Technology': 16,
        'PSG College of Technology': 20,
        'Kumaraguru College of Technology': 12,
        'Kongu Engineering College': 12,
        'Sri Krishna College of Engineering and Technology': 14,
        'PSG Institute of Technology and Applied Research': 10,
        'Coimbatore Institute of Technology': 19,
      },
    ],
    alumniSize: {
      'Kumaraguru College of Technology': 20000,
      'Bannari Amman Institute of Technology': 18000,
      'PSG College of Technology': 25000,
      'Kongu Engineering College': 15000,
      'Sri Krishna College of Engineering and Technology': 16000,
      'PSG Institute of Technology and Applied Research': 6000,
      'Coimbatore Institute of Technology': 16000,
    },
    nicheAreas: {
      'Kumaraguru College of Technology': ['Cybersecurity', 'Data Science'],
      'Bannari Amman Institute of Technology': ['Automotive', 'AI for Manufacturing'],
      'PSG College of Technology': ['Aerospace', 'AI'],
      'Kongu Engineering College': ['Manufacturing', 'Entrepreneurship'],
      'Sri Krishna College of Engineering and Technology': ['Cloud Computing', 'Robotics'],
      'PSG Institute of Technology and Applied Research': ['IoT', 'Embedded Systems'],
      'Coimbatore Institute of Technology': ['Civil', 'Software'],
    },
    segments: {
      'Institutional Profile': { Established: 1984, Campus: 'Suburban', Type: 'Autonomous' },
      'Academic Excellence': { 'Faculty-Student Ratio': '1:17', Accreditation: 'NBA, NAAC A' },
      'Career Opportunities': { 'Top Recruiters': ['Wipro', 'HCL', 'Zoho'], 'Avg Placement': '5.8 LPA' },
      'Industry & Global Exposure': { 'MoUs': 30, 'International Partners': 5 },
      'Student Experience & Campus Life': { Clubs: ['Cybersecurity', 'Cultural'], Hostel: 'Available' },
      'Financial Factors': { Tuition: 'Moderate', Scholarships: 'Merit' },
      'Innovation & Entrepreneurship': { 'Incubation Centre': 'Yes', Startups: 8 },
      'Alumni Network & Legacy': { 'Alumni Strength': 20000, Chapters: 12 },
    },
  },
  'Kongu Engineering College': {
    placementPercent: {
      'Bannari Amman Institute of Technology': 92,
      'PSG College of Technology': 88,
      'Kumaraguru College of Technology': 85,
      'Kongu Engineering College': 80,
      'Sri Krishna College of Engineering and Technology': 91,
      'PSG Institute of Technology and Applied Research': 88,
      'Coimbatore Institute of Technology': 88,
    },
    avgSalary: {
      'Bannari Amman Institute of Technology': 6.2,
      'PSG College of Technology': 6.0,
      'Kumaraguru College of Technology': 5.8,
      'Kongu Engineering College': 4.5,
      'Sri Krishna College of Engineering and Technology': 6.2,
      'PSG Institute of Technology and Applied Research': 6.1,
      'Coimbatore Institute of Technology': 5.0,
    },
    highestSalary: {
      'Bannari Amman Institute of Technology': 28,
      'PSG College of Technology': 25,
      'Kumaraguru College of Technology': 24,
      'Kongu Engineering College': 21,
      'Sri Krishna College of Engineering and Technology': 47,
      'PSG Institute of Technology and Applied Research': 36,
      'Coimbatore Institute of Technology': 51,
    },
    roi: {
      'Bannari Amman Institute of Technology': 72,
      'PSG College of Technology': 65,
      'Kumaraguru College of Technology': 60,
      'Kongu Engineering College': 62,
      'Sri Krishna College of Engineering and Technology': 68,
      'PSG Institute of Technology and Applied Research': 66,
      'Coimbatore Institute of Technology': 65,
    },
    research: [
      { 
        year: '2019', 
        'Bannari Amman Institute of Technology': 8,
        'PSG College of Technology': 10,
        'Kumaraguru College of Technology': 5,
        'Kongu Engineering College': 7,
        'Sri Krishna College of Engineering and Technology': 6,
        'PSG Institute of Technology and Applied Research': 2,
        'Coimbatore Institute of Technology': 9,
      },
      { 
        year: '2020', 
        'Bannari Amman Institute of Technology': 10,
        'PSG College of Technology': 12,
        'Kumaraguru College of Technology': 7,
        'Kongu Engineering College': 8,
        'Sri Krishna College of Engineering and Technology': 8,
        'PSG Institute of Technology and Applied Research': 5,
        'Coimbatore Institute of Technology': 11,
      },
      { 
        year: '2021', 
        'Bannari Amman Institute of Technology': 12,
        'PSG College of Technology': 15,
        'Kumaraguru College of Technology': 9,
        'Kongu Engineering College': 9,
        'Sri Krishna College of Engineering and Technology': 10,
        'PSG Institute of Technology and Applied Research': 7,
        'Coimbatore Institute of Technology': 13,
      },
      { 
        year: '2022', 
        'Bannari Amman Institute of Technology': 14,
        'PSG College of Technology': 18,
        'Kumaraguru College of Technology': 11,
        'Kongu Engineering College': 11,
        'Sri Krishna College of Engineering and Technology': 12,
        'PSG Institute of Technology and Applied Research': 9,
        'Coimbatore Institute of Technology': 15,
      },
      { 
        year: '2023', 
        'Bannari Amman Institute of Technology': 16,
        'PSG College of Technology': 20,
        'Kumaraguru College of Technology': 12,
        'Kongu Engineering College': 12,
        'Sri Krishna College of Engineering and Technology': 14,
        'PSG Institute of Technology and Applied Research': 10,
        'Coimbatore Institute of Technology': 19,
      },
    ],
    alumniSize: {
      'Kongu Engineering College': 15000,
      'Bannari Amman Institute of Technology': 18000,
      'PSG College of Technology': 25000,
      'Kumaraguru College of Technology': 20000,
      'Sri Krishna College of Engineering and Technology': 16000,
      'PSG Institute of Technology and Applied Research': 6000,
      'Coimbatore Institute of Technology': 16000,
    },
    nicheAreas: {
      'Kongu Engineering College': ['Manufacturing', 'Entrepreneurship'],
      'Bannari Amman Institute of Technology': ['Automotive', 'AI for Manufacturing'],
      'PSG College of Technology': ['Aerospace', 'AI'],
      'Kumaraguru College of Technology': ['Cybersecurity', 'Data Science'],
      'Sri Krishna College of Engineering and Technology': ['Cloud Computing', 'Robotics'],
      'PSG Institute of Technology and Applied Research': ['IoT', 'Embedded Systems'],
      'Coimbatore Institute of Technology': ['Civil', 'Software'],
    },
    segments: {
      'Institutional Profile': { Established: 1984, Campus: 'Rural', Type: 'Private' },
      'Academic Excellence': { 'Faculty-Student Ratio': '1:20', Accreditation: 'NBA, NAAC A++' },
      'Career Opportunities': { 'Top Recruiters': ['Infosys', 'Wipro', 'Bosch'], 'Avg Placement': '4.5 LPA' },
      'Industry & Global Exposure': { 'MoUs': 30, 'International Partners': 4 },
      'Student Experience & Campus Life': { Clubs: ['Entrepreneurship', 'Coding'], Hostel: 'Available' },
      'Financial Factors': { Tuition: 'Moderate', Scholarships: 'Merit & Need' },
      'Innovation & Entrepreneurship': { 'Incubation Centre': 'Yes', Startups: 8 },
      'Alumni Network & Legacy': { 'Alumni Strength': 15000, Chapters: 8 },
    },
  },
  'Sri Krishna College of Engineering and Technology': {
    placementPercent: {
      'Bannari Amman Institute of Technology': 92,
      'PSG College of Technology': 88,
      'Kumaraguru College of Technology': 85,
      'Kongu Engineering College': 80,
      'Sri Krishna College of Engineering and Technology': 91,
      'PSG Institute of Technology and Applied Research': 88,
      'Coimbatore Institute of Technology': 88,
    },
    avgSalary: {
      'Bannari Amman Institute of Technology': 6.2,
      'PSG College of Technology': 6.0,
      'Kumaraguru College of Technology': 5.8,
      'Kongu Engineering College': 4.5,
      'Sri Krishna College of Engineering and Technology': 6.2,
      'PSG Institute of Technology and Applied Research': 6.1,
      'Coimbatore Institute of Technology': 5.0,
    },
    highestSalary: {
      'Bannari Amman Institute of Technology': 28,
      'PSG College of Technology': 25,
      'Kumaraguru College of Technology': 24,
      'Kongu Engineering College': 21,
      'Sri Krishna College of Engineering and Technology': 47,
      'PSG Institute of Technology and Applied Research': 36,
      'Coimbatore Institute of Technology': 51,
    },
    roi: {
      'Bannari Amman Institute of Technology': 72,
      'PSG College of Technology': 65,
      'Kumaraguru College of Technology': 60,
      'Kongu Engineering College': 62,
      'Sri Krishna College of Engineering and Technology': 68,
      'PSG Institute of Technology and Applied Research': 66,
      'Coimbatore Institute of Technology': 65,
    },
    research: [
      { 
        year: '2019', 
        'Bannari Amman Institute of Technology': 8,
        'PSG College of Technology': 10,
        'Kumaraguru College of Technology': 5,
        'Kongu Engineering College': 7,
        'Sri Krishna College of Engineering and Technology': 6,
        'PSG Institute of Technology and Applied Research': 2,
        'Coimbatore Institute of Technology': 9,
      },
      { 
        year: '2020', 
        'Bannari Amman Institute of Technology': 10,
        'PSG College of Technology': 12,
        'Kumaraguru College of Technology': 7,
        'Kongu Engineering College': 8,
        'Sri Krishna College of Engineering and Technology': 8,
        'PSG Institute of Technology and Applied Research': 5,
        'Coimbatore Institute of Technology': 11,
      },
      { 
        year: '2021', 
        'Bannari Amman Institute of Technology': 12,
        'PSG College of Technology': 15,
        'Kumaraguru College of Technology': 9,
        'Kongu Engineering College': 9,
        'Sri Krishna College of Engineering and Technology': 10,
        'PSG Institute of Technology and Applied Research': 7,
        'Coimbatore Institute of Technology': 13,
      },
      { 
        year: '2022', 
        'Bannari Amman Institute of Technology': 14,
        'PSG College of Technology': 18,
        'Kumaraguru College of Technology': 11,
        'Kongu Engineering College': 11,
        'Sri Krishna College of Engineering and Technology': 12,
        'PSG Institute of Technology and Applied Research': 9,
        'Coimbatore Institute of Technology': 15,
      },
      { 
        year: '2023', 
        'Bannari Amman Institute of Technology': 16,
        'PSG College of Technology': 20,
        'Kumaraguru College of Technology': 12,
        'Kongu Engineering College': 12,
        'Sri Krishna College of Engineering and Technology': 14,
        'PSG Institute of Technology and Applied Research': 10,
        'Coimbatore Institute of Technology': 19,
      },
    ],
    alumniSize: {
      'Sri Krishna College of Engineering and Technology': 16000,
      'Bannari Amman Institute of Technology': 18000,
      'PSG College of Technology': 25000,
      'Kumaraguru College of Technology': 20000,
      'Kongu Engineering College': 15000,
      'PSG Institute of Technology and Applied Research': 6000,
      'Coimbatore Institute of Technology': 16000,
    },
    nicheAreas: {
      'Sri Krishna College of Engineering and Technology': ['Cloud Computing', 'Robotics'],
      'Bannari Amman Institute of Technology': ['Automotive', 'AI for Manufacturing'],
      'PSG College of Technology': ['Aerospace', 'AI'],
      'Kumaraguru College of Technology': ['Cybersecurity', 'Data Science'],
      'Kongu Engineering College': ['Manufacturing', 'Entrepreneurship'],
      'PSG Institute of Technology and Applied Research': ['IoT', 'Embedded Systems'],
      'Coimbatore Institute of Technology': ['Civil', 'Software'],
    },
    segments: {
      'Institutional Profile': { Established: 1998, Campus: 'Urban', Type: 'Private' },
      'Academic Excellence': { 'Faculty-Student Ratio': '1:16', Accreditation: 'NAAC A+' },
      'Career Opportunities': { 'Top Recruiters': ['Microsoft', 'Google', 'Amazon'], 'Avg Placement': '6.2 LPA' },
      'Industry & Global Exposure': { 'MoUs': 25, 'International Partners': 6 },
      'Student Experience & Campus Life': { Clubs: ['Robotics', 'Coding'], Hostel: 'Available' },
      'Financial Factors': { Tuition: 'Moderate', Scholarships: 'Merit' },
      'Innovation & Entrepreneurship': { 'Incubation Centre': 'Yes', Startups: 5 },
      'Alumni Network & Legacy': { 'Alumni Strength': 16000, Chapters: 6 },
    },
  },
  'PSG Institute of Technology and Applied Research': {
    placementPercent: {
      'Bannari Amman Institute of Technology': 92,
      'PSG College of Technology': 88,
      'Kumaraguru College of Technology': 85,
      'Kongu Engineering College': 80,
      'Sri Krishna College of Engineering and Technology': 91,
      'PSG Institute of Technology and Applied Research': 88,
      'Coimbatore Institute of Technology': 88,
    },
    avgSalary: {
      'Bannari Amman Institute of Technology': 6.2,
      'PSG College of Technology': 6.0,
      'Kumaraguru College of Technology': 5.8,
      'Kongu Engineering College': 4.5,
      'Sri Krishna College of Engineering and Technology': 6.2,
      'PSG Institute of Technology and Applied Research': 6.1,
      'Coimbatore Institute of Technology': 5.0,
    },
    highestSalary: {
      'Bannari Amman Institute of Technology': 28,
      'PSG College of Technology': 25,
      'Kumaraguru College of Technology': 24,
      'Kongu Engineering College': 21,
      'Sri Krishna College of Engineering and Technology': 47,
      'PSG Institute of Technology and Applied Research': 36,
      'Coimbatore Institute of Technology': 51,
    },
    roi: {
      'Bannari Amman Institute of Technology': 72,
      'PSG College of Technology': 65,
      'Kumaraguru College of Technology': 60,
      'Kongu Engineering College': 62,
      'Sri Krishna College of Engineering and Technology': 68,
      'PSG Institute of Technology and Applied Research': 66,
      'Coimbatore Institute of Technology': 65,
    },
    research: [
      { 
        year: '2019', 
        'Bannari Amman Institute of Technology': 8,
        'PSG College of Technology': 10,
        'Kumaraguru College of Technology': 5,
        'Kongu Engineering College': 7,
        'Sri Krishna College of Engineering and Technology': 6,
        'PSG Institute of Technology and Applied Research': 2,
        'Coimbatore Institute of Technology': 9,
      },
      { 
        year: '2020', 
        'Bannari Amman Institute of Technology': 10,
        'PSG College of Technology': 12,
        'Kumaraguru College of Technology': 7,
        'Kongu Engineering College': 8,
        'Sri Krishna College of Engineering and Technology': 8,
        'PSG Institute of Technology and Applied Research': 5,
        'Coimbatore Institute of Technology': 11,
      },
      { 
        year: '2021', 
        'Bannari Amman Institute of Technology': 12,
        'PSG College of Technology': 15,
        'Kumaraguru College of Technology': 9,
        'Kongu Engineering College': 9,
        'Sri Krishna College of Engineering and Technology': 10,
        'PSG Institute of Technology and Applied Research': 7,
        'Coimbatore Institute of Technology': 13,
      },
      { 
        year: '2022', 
        'Bannari Amman Institute of Technology': 14,
        'PSG College of Technology': 18,
        'Kumaraguru College of Technology': 11,
        'Kongu Engineering College': 11,
        'Sri Krishna College of Engineering and Technology': 12,
        'PSG Institute of Technology and Applied Research': 9,
        'Coimbatore Institute of Technology': 15,
      },
      { 
        year: '2023', 
        'Bannari Amman Institute of Technology': 16,
        'PSG College of Technology': 20,
        'Kumaraguru College of Technology': 12,
        'Kongu Engineering College': 12,
        'Sri Krishna College of Engineering and Technology': 14,
        'PSG Institute of Technology and Applied Research': 10,
        'Coimbatore Institute of Technology': 19,
      },
    ],
    alumniSize: {
      'PSG Institute of Technology and Applied Research': 6000,
      'Bannari Amman Institute of Technology': 18000,
      'PSG College of Technology': 25000,
      'Kumaraguru College of Technology': 20000,
      'Kongu Engineering College': 15000,
      'Sri Krishna College of Engineering and Technology': 16000,
      'Coimbatore Institute of Technology': 16000,
    },
    nicheAreas: {
      'PSG Institute of Technology and Applied Research': ['IoT', 'Embedded Systems'],
      'Bannari Amman Institute of Technology': ['Automotive', 'AI for Manufacturing'],
      'PSG College of Technology': ['Aerospace', 'AI'],
      'Kumaraguru College of Technology': ['Cybersecurity', 'Data Science'],
      'Kongu Engineering College': ['Manufacturing', 'Entrepreneurship'],
      'Sri Krishna College of Engineering and Technology': ['Cloud Computing', 'Robotics'],
      'Coimbatore Institute of Technology': ['Civil', 'Software'],
    },
    segments: {
      'Institutional Profile': { Established: 2014, Campus: 'Urban', Type: 'Autonomous' },
      'Academic Excellence': { 'Faculty-Student Ratio': '1:15', Accreditation: 'NBA, NAAC' },
      'Career Opportunities': { 'Top Recruiters': ['TCS', 'L&T', 'Cognizant'], 'Avg Placement': '6.1 LPA' },
      'Industry & Global Exposure': { 'MoUs': 18, 'International Partners': 2 },
      'Student Experience & Campus Life': { Clubs: ['Robotics', 'Innovation'], Hostel: 'Available' },
      'Financial Factors': { Tuition: 'Moderate', Scholarships: 'Merit' },
      'Innovation & Entrepreneurship': { 'Incubation Centre': 'Active', Startups: 3 },
      'Alumni Network & Legacy': { 'Alumni Strength': 6000, Chapters: 3 },
    },
  },
  'Coimbatore Institute of Technology': {
    placementPercent: {
      'Bannari Amman Institute of Technology': 92,
      'PSG College of Technology': 88,
      'Kumaraguru College of Technology': 85,
      'Kongu Engineering College': 80,
      'Sri Krishna College of Engineering and Technology': 91,
      'PSG Institute of Technology and Applied Research': 88,
      'Coimbatore Institute of Technology': 88,
    },
    avgSalary: {
      'Bannari Amman Institute of Technology': 6.2,
      'PSG College of Technology': 6.0,
      'Kumaraguru College of Technology': 5.8,
      'Kongu Engineering College': 4.5,
      'Sri Krishna College of Engineering and Technology': 6.2,
      'PSG Institute of Technology and Applied Research': 6.1,
      'Coimbatore Institute of Technology': 5.0,
    },
    highestSalary: {
      'Bannari Amman Institute of Technology': 28,
      'PSG College of Technology': 25,
      'Kumaraguru College of Technology': 24,
      'Kongu Engineering College': 21,
      'Sri Krishna College of Engineering and Technology': 47,
      'PSG Institute of Technology and Applied Research': 36,
      'Coimbatore Institute of Technology': 51,
    },
    roi: {
      'Bannari Amman Institute of Technology': 72,
      'PSG College of Technology': 65,
      'Kumaraguru College of Technology': 60,
      'Kongu Engineering College': 62,
      'Sri Krishna College of Engineering and Technology': 68,
      'PSG Institute of Technology and Applied Research': 66,
      'Coimbatore Institute of Technology': 65,
    },
    research: [
      { 
        year: '2019', 
        'Bannari Amman Institute of Technology': 8,
        'PSG College of Technology': 10,
        'Kumaraguru College of Technology': 5,
        'Kongu Engineering College': 7,
        'Sri Krishna College of Engineering and Technology': 6,
        'PSG Institute of Technology and Applied Research': 2,
        'Coimbatore Institute of Technology': 9,
      },
      { 
        year: '2020', 
        'Bannari Amman Institute of Technology': 10,
        'PSG College of Technology': 12,
        'Kumaraguru College of Technology': 7,
        'Kongu Engineering College': 8,
        'Sri Krishna College of Engineering and Technology': 8,
        'PSG Institute of Technology and Applied Research': 5,
        'Coimbatore Institute of Technology': 11,
      },
      { 
        year: '2021', 
        'Bannari Amman Institute of Technology': 12,
        'PSG College of Technology': 15,
        'Kumaraguru College of Technology': 9,
        'Kongu Engineering College': 9,
        'Sri Krishna College of Engineering and Technology': 10,
        'PSG Institute of Technology and Applied Research': 7,
        'Coimbatore Institute of Technology': 13,
      },
      { 
        year: '2022', 
        'Bannari Amman Institute of Technology': 14,
        'PSG College of Technology': 18,
        'Kumaraguru College of Technology': 11,
        'Kongu Engineering College': 11,
        'Sri Krishna College of Engineering and Technology': 12,
        'PSG Institute of Technology and Applied Research': 9,
        'Coimbatore Institute of Technology': 15,
      },
      { 
        year: '2023', 
        'Bannari Amman Institute of Technology': 16,
        'PSG College of Technology': 20,
        'Kumaraguru College of Technology': 12,
        'Kongu Engineering College': 12,
        'Sri Krishna College of Engineering and Technology': 14,
        'PSG Institute of Technology and Applied Research': 10,
        'Coimbatore Institute of Technology': 19,
      },
    ],
    alumniSize: {
      'Coimbatore Institute of Technology': 16000,
      'Bannari Amman Institute of Technology': 18000,
      'PSG College of Technology': 25000,
      'Kumaraguru College of Technology': 20000,
      'Kongu Engineering College': 15000,
      'Sri Krishna College of Engineering and Technology': 16000,
      'PSG Institute of Technology and Applied Research': 6000,
    },
    nicheAreas: {
      'Coimbatore Institute of Technology': ['Civil', 'Software'],
      'Bannari Amman Institute of Technology': ['Automotive', 'AI for Manufacturing'],
      'PSG College of Technology': ['Aerospace', 'AI'],
      'Kumaraguru College of Technology': ['Cybersecurity', 'Data Science'],
      'Kongu Engineering College': ['Manufacturing', 'Entrepreneurship'],
      'Sri Krishna College of Engineering and Technology': ['Cloud Computing', 'Robotics'],
      'PSG Institute of Technology and Applied Research': ['IoT', 'Embedded Systems'],
    },
    segments: {
      'Institutional Profile': { Established: 1956, Campus: 'Urban', Type: 'Autonomous' },
      'Academic Excellence': { 'Faculty-Student Ratio': '1:16', Accreditation: 'NBA, NAAC A+' },
      'Career Opportunities': { 'Top Recruiters': ['Amazon', 'Microsoft', 'Tata Motors'], 'Avg Placement': '5.0 LPA' },
      'Industry & Global Exposure': { 'MoUs': 24, 'International Partners': 5 },
      'Student Experience & Campus Life': { Clubs: ['Coding', 'Cultural'], Hostel: 'Available' },
      'Financial Factors': { Tuition: 'Moderate', Scholarships: 'Merit' },
      'Innovation & Entrepreneurship': { 'Incubation Centre': 'Active', Startups: 6 },
      'Alumni Network & Legacy': { 'Alumni Strength': 16000, Chapters: 10 },
    },
  },
};

const COMPETITORS = [
  'PSG College of Technology',
  'Kumaraguru College of Technology',
  'Kongu Engineering College',
  'Sri Krishna College of Engineering and Technology',
  'PSG Institute of Technology and Applied Research',
  'Coimbatore Institute of Technology'
]

export default function CompetitiveDashboard() {
  const [competitor, setCompetitor] = useState(COMPETITORS[0])
  const main = 'Bannari Amman Institute of Technology'

  const handleSelect = (name: string) => setCompetitor(name)

  const mainData = COMPETITOR_DATA[main]
  const competitorData = COMPETITOR_DATA[competitor]

  const segmentOrder = [
    'Institutional Profile',
    'Academic Excellence',
    'Career Opportunities',
    'Industry & Global Exposure',
    'Student Experience & Campus Life',
    'Financial Factors',
    'Innovation & Entrepreneurship',
    'Alumni Network & Legacy',
  ]

  return (
    <div className="competitive-dashboard">
      <header className="competitive-header">
        <div className="competitive-header-content">
          <div className="competitive-header-left">
            <div className="competitive-ai-icon">AI</div>
            <div className="competitive-header-text">
              <h1>BIT Competitive Intelligence Center</h1>
              <p>Enterprise analytics & strategic recommendations</p>
            </div>
          </div>
        </div>
      </header>

      <main className="competitive-main">
        <div className="competitive-sidebar-wrapper">
          <Sidebar competitors={COMPETITORS} selected={competitor} onSelect={handleSelect} />
          <select 
            className="mobile-competitor-select"
            value={competitor}
            onChange={(e) => handleSelect(e.target.value)}
          >
            {COMPETITORS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="competitive-content">
          <section>
            <div className="comparison-info-card">
              <h2 className="comparison-info-title">Competitive Analysis</h2>
              <p className="comparison-info-text">
                Detailed comparison between {main} and {competitor} across multiple analytical dimensions including career metrics, research output, infrastructure, and student experience.
              </p>
            </div>

            <div className="charts-section">
              <ComparisonChart 
                leftName={main} 
                rightName={competitor} 
                leftData={mainData}
                rightData={competitorData}
              />
            </div>
          </section>

          <div className="section-divider"></div>

          <section className="segments-section">
            <h3 className="segments-section-title">📋 Detailed Analytical Segments</h3>
            <div className="segments-grid">
              {segmentOrder.map((seg) => (
                <SegmentCard key={seg} title={seg} details={mainData.segments[seg]} />
              ))}
            </div>
          </section>

          <div className="section-divider"></div>

          <AIRecommendations leftName={main} rightName={competitor} data={mainData} />
        </div>
      </main>
    </div>
  )
}
