import './AIRecommendations.css'

type Props = {
  leftName: string
  rightName: string
  data: any
}

export default function AIRecommendations({ leftName, rightName, data }: Props) {
  // simple logic for recommendations
  const roiLeft = data.roi[leftName]
  const roiRight = data.roi[rightName]
  const alumniLeft = data.alumniSize[leftName]
  const alumniRight = data.alumniSize[rightName]

  const recs = [] as { title: string; text: string; tone: 'success' | 'warning' | 'info' }[]

  if (roiLeft > roiRight) {
    recs.push({ title: 'ROI Advantage', text: `${leftName} shows a stronger ROI vs ${rightName}. Highlight value-for-money in campaigns.`, tone: 'success' })
  } else {
    recs.push({ title: 'ROI Warning', text: `${rightName} has higher ROI. Consider fine-tuning programs or scholarships to improve ROI perception.`, tone: 'warning' })
  }

  if (alumniLeft < alumniRight) {
    recs.push({ title: 'Alumni Gap', text: `Alumni base of ${leftName} is smaller than ${rightName}. Activate alumni storytelling & referral programs.`, tone: 'info' })
  } else {
    recs.push({ title: 'Alumni Strength', text: `Leverage alumni successes as case studies and for mentorship programs.`, tone: 'success' })
  }

  // niche strategy suggestion based on innovation focus
  if (data.nicheAreas && data.nicheAreas[leftName] && data.nicheAreas[leftName].length > 0) {
    recs.push({ title: 'Niche Marketing', text: `Promote ${data.nicheAreas[leftName].slice(0, 2).join(', ')} as signature offerings to differentiate from ${rightName}.`, tone: 'info' })
  }

  return (
    <section className="ai-recommendations-section">
      <h3 className="ai-recommendations-title">AI Recommendations</h3>
      <div className="ai-recommendations-grid">
        {recs.map((r, i) => (
          <div key={i} className={`ai-recommendation-box ${r.tone}`}>
            <h4 className="ai-recommendation-title">{r.title}</h4>
            <p className="ai-recommendation-text">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
