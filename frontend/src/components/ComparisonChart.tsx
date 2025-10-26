import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
} from 'recharts'
import './ComparisonChart.css'

type Props = {
  leftName: string
  rightName: string
  leftData: any
  rightData: any
}

const COLORS = ['#1E2A78', '#00D4FF', '#2a3b9d', '#00b8e6']
const PIE_COLORS = ['#1E2A78', '#00D4FF']

export default function ComparisonChart({ leftName, rightName, leftData, rightData }: Props) {
  // Placement & Salary Data
  const placementData = [
    {
      name: 'Placement %',
      [leftName]: leftData.placementPercent[leftName],
      [rightName]: rightData.placementPercent[rightName],
    },
    {
      name: 'Avg Salary',
      [leftName]: leftData.avgSalary[leftName],
      [rightName]: rightData.avgSalary[rightName],
    },
    {
      name: 'Highest Salary',
      [leftName]: leftData.highestSalary[leftName],
      [rightName]: rightData.highestSalary[rightName],
    },
  ]

  // ROI Data
  const roiPieData = [
    { name: leftName, value: leftData.roi[leftName] },
    { name: rightName, value: rightData.roi[rightName] },
  ]

  // Research & Innovation Trend
  const researchLineData = leftData.research.map((point: any) => ({
    year: point.year,
    [leftName]: point[leftName],
    [rightName]: point[rightName],
  }))

  // Alumni & Network Data
  const alumniData = [
    {
      category: 'Alumni Network',
      [leftName]: leftData.alumniSize[leftName] / 1000,
      [rightName]: rightData.alumniSize[rightName] / 1000,
    },
  ]

  // Infrastructure & Facilities Radar
  const infrastructureData = [
    {
      subject: 'MoUs',
      [leftName]: leftData.segments['Industry & Global Exposure']?.MoUs || 0,
      [rightName]: rightData.segments['Industry & Global Exposure']?.MoUs || 0,
      fullMark: 80,
    },
    {
      subject: 'Int. Partners',
      [leftName]: leftData.segments['Industry & Global Exposure']?.['International Partners'] || 0,
      [rightName]: rightData.segments['Industry & Global Exposure']?.['International Partners'] || 0,
      fullMark: 15,
    },
    {
      subject: 'Startups',
      [leftName]: leftData.segments['Innovation & Entrepreneurship']?.Startups || 0,
      [rightName]: rightData.segments['Innovation & Entrepreneurship']?.Startups || 0,
      fullMark: 40,
    },
    {
      subject: 'Alumni Chapters',
      [leftName]: leftData.segments['Alumni Network & Legacy']?.Chapters || 0,
      [rightName]: rightData.segments['Alumni Network & Legacy']?.Chapters || 0,
      fullMark: 30,
    },
  ]

  // Student Experience Metrics
  const studentExperienceData = [
    {
      name: 'Clubs & Activities',
      [leftName]: 8,
      [rightName]: 12,
    },
    {
      name: 'Campus Facilities',
      [leftName]: 85,
      [rightName]: 90,
    },
    {
      name: 'Industry Exposure',
      [leftName]: 88,
      [rightName]: 85,
    },
  ]

  // Year-over-Year Growth (Area Chart)
  const growthData = leftData.research.map((point: any, idx: number) => ({
    year: point.year,
    [leftName]: point[leftName] * 1.2 + idx * 2,
    [rightName]: point[rightName] * 1.15 + idx * 1.5,
  }))

  return (
    <div className="comparison-chart-container">
      {/* Section 1: Career & Placement */}
      <div className="chart-section">
        <h3 className="chart-section-title">📊 Career & Placement Metrics</h3>
        <div className="chart-row chart-row-two">
          <div className="chart-card">
            <h4 className="chart-title">
              <span className="chart-title-icon">💼</span>
              Placement & Salary Comparison
            </h4>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={placementData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey={leftName} fill={COLORS[0]} radius={[8, 8, 0, 0]} />
                <Bar dataKey={rightName} fill={COLORS[1]} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h4 className="chart-title">
              <span className="chart-title-icon">💰</span>
              ROI Comparison
            </h4>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={roiPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  label
                >
                  {roiPieData.map((_entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section 2: Research & Innovation */}
      <div className="chart-section">
        <h3 className="chart-section-title">🔬 Research & Innovation</h3>
        <div className="chart-row">
          <div className="chart-card chart-card-full">
            <h4 className="chart-title">
              <span className="chart-title-icon">📈</span>
              Research Output Trend (2019-2023)
            </h4>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={researchLineData}>
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={leftName}
                  stroke={COLORS[0]}
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey={rightName}
                  stroke={COLORS[1]}
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-row chart-row-two">
          <div className="chart-card">
            <h4 className="chart-title">
              <span className="chart-title-icon">🚀</span>
              Growth Trajectory
            </h4>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={growthData}>
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey={leftName}
                  stroke={COLORS[0]}
                  fill={COLORS[0]}
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey={rightName}
                  stroke={COLORS[1]}
                  fill={COLORS[1]}
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h4 className="chart-title">
              <span className="chart-title-icon">🎓</span>
              Infrastructure & Partnerships
            </h4>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={infrastructureData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fontSize: 10 }} />
                <Radar
                  name={leftName}
                  dataKey={leftName}
                  stroke={COLORS[0]}
                  fill={COLORS[0]}
                  fillOpacity={0.6}
                />
                <Radar
                  name={rightName}
                  dataKey={rightName}
                  stroke={COLORS[1]}
                  fill={COLORS[1]}
                  fillOpacity={0.6}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section 3: Student Experience & Network */}
      <div className="chart-section">
        <h3 className="chart-section-title">🌟 Student Experience & Network</h3>
        <div className="chart-row chart-row-two">
          <div className="chart-card">
            <h4 className="chart-title">
              <span className="chart-title-icon">🎯</span>
              Student Experience Metrics
            </h4>
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={studentExperienceData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey={leftName} fill={COLORS[0]} radius={[8, 8, 0, 0]} />
                <Bar dataKey={rightName} fill={COLORS[1]} radius={[8, 8, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h4 className="chart-title">
              <span className="chart-title-icon">👥</span>
              Alumni Network (in thousands)
            </h4>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={alumniData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey={leftName} fill={COLORS[0]} radius={[0, 8, 8, 0]} />
                <Bar dataKey={rightName} fill={COLORS[1]} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
