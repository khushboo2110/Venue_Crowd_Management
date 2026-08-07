import { InferenceClient } from "@huggingface/inference";

/**
 * Crowd Flow AI Inference Service
 * Supports Hugging Face API call with Qwen / Mistral models,
 * with intelligent rule-based fallback when offline or API token missing.
 */
export async function analyzeCrowdRisk({ nodes, capacity, eventType, hfToken }) {
  const token = hfToken || process.env.HF_TOKEN;

  // Calculate crowd metrics from venue nodes
  let totalCrowd = 0;
  let bottleneckNodes = [];
  let gateCrowdTotal = 0;
  let exitCrowdTotal = 0;

  nodes.forEach(node => {
    totalCrowd += Number(node.crowd || 0);
    const fillRatio = (node.crowd / (node.maxCapacity || 1000)) * 100;
    if (fillRatio >= 80) {
      bottleneckNodes.push({
        id: node.id,
        label: node.label,
        crowd: node.crowd,
        maxCapacity: node.maxCapacity,
        fillRatio: Math.round(fillRatio)
      });
    }
    if (node.type === 'gate') gateCrowdTotal += Number(node.crowd || 0);
    if (node.type === 'exit') exitCrowdTotal += Number(node.crowd || 0);
  });

  const overallOccupancyPct = Math.min(100, Math.round((totalCrowd / (capacity || 50000)) * 100));

  // Determine Risk Level & Score
  let riskScore = Math.min(99, Math.round(overallOccupancyPct * 0.6 + bottleneckNodes.length * 15));
  let riskLevel = "Low";
  if (riskScore >= 75 || bottleneckNodes.length >= 2) riskLevel = "High";
  else if (riskScore >= 45 || bottleneckNodes.length === 1) riskLevel = "Medium";

  // Calculate average waiting time estimate
  const avgWaitTimeMins = Math.round(Math.max(2, (gateCrowdTotal / 250) + (bottleneckNodes.length * 4)));

  let aiRecommendationText = "";

  // Attempt Hugging Face API call if token provided
  if (token) {
    try {
      const hf = new InferenceClient(token);
      const prompt = `You are an AI Safety & Crowd Management System at a major venue (${eventType || 'Concert/Event'}).
Live Metrics:
- Total Crowd: ${totalCrowd} / ${capacity} (${overallOccupancyPct}% capacity)
- High Congestion Bottlenecks: ${bottleneckNodes.map(n => `${n.label} (${n.crowd}/${n.maxCapacity})`).join(', ') || 'None'}
- Gate Crowd: ${gateCrowdTotal}
- Risk Score: ${riskScore}% (${riskLevel} Risk)

Provide 3 short, actionable, emergency/safety rerouting instructions to event managers to prevent stampede and lower wait times.`;

      const response = await hf.chatCompletion({
        model: "Qwen/Qwen2.5-Coder-32B-Instruct", // or Qwen/Qwen3-4B-Instruct
        messages: [{ role: "user", content: prompt }],
        max_tokens: 250
      });

      aiRecommendationText = response?.choices[0]?.message?.content || "";
    } catch (err) {
      console.warn("Hugging Face API call failed or unauthenticated, switching to built-in fallback AI logic:", err.message);
    }
  }

  // Fallback intelligent recommendation engine if HF call wasn't made or failed
  if (!aiRecommendationText) {
    if (bottleneckNodes.length > 0) {
      const worstNode = bottleneckNodes[0];
      const safeExit = nodes.find(n => n.type === 'exit' && (n.crowd / n.maxCapacity) < 0.4) || nodes.find(n => n.type === 'exit');
      aiRecommendationText = `🚨 CRITICAL BOTTLENECK DETECTED at ${worstNode.label} (${worstNode.fillRatio}% full). 
1. Immediately deploy ground security staff to divert incoming flow away from ${worstNode.label}.
2. Open auxiliary exit route ${safeExit ? safeExit.label : 'Emergency Exit 4'} to absorb 35% of crowd overflow.
3. Broadcast digital signage guidance directing visitors toward low-density food court zones.`;
    } else {
      aiRecommendationText = `✅ VENUE FLOW OPTIMAL. Current risk level is ${riskLevel} (${riskScore}%).
1. Maintain regular gate monitoring and standard pedestrian pacing.
2. Ensure emergency exit pathways remain clear of temporary kiosks.
3. Monitor upcoming surge during peak halftime / exit hours.`;
    }
  }

  return {
    riskScore,
    riskLevel,
    overallOccupancyPct,
    avgWaitTimeMins,
    totalCrowd,
    bottleneckNodes,
    recommendation: aiRecommendationText,
    timestamp: new Date().toISOString()
  };
}
