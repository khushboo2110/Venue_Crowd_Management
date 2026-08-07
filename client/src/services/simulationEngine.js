/**
 * 2D Particle Physics Engine for Crowd Flow Simulation
 */
export class CrowdSimulatorEngine {
  constructor(canvas, nodes, edges) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nodes = nodes;
    this.edges = edges;
    this.particles = [];
    this.numParticles = 120;
    this.animId = null;
    this.isEmergency = false;
    this.speedMultiplier = 1.0;
    
    this.initParticles();
  }

  updateTopology(nodes, edges) {
    this.nodes = nodes;
    this.edges = edges;
  }

  setEmergencyMode(enabled) {
    this.isEmergency = enabled;
    this.speedMultiplier = enabled ? 2.5 : 1.0;
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    // Pick start node (usually gate or random node)
    const startNodes = this.nodes.filter(n => n.type === 'gate');
    const startNode = startNodes.length > 0 
      ? startNodes[Math.floor(Math.random() * startNodes.length)]
      : this.nodes[Math.floor(Math.random() * this.nodes.length)];

    // Target node (food stall, stage, or exit)
    const targetNodes = this.nodes.filter(n => n.type === (this.isEmergency ? 'exit' : 'stage') || n.type === 'stall');
    const targetNode = targetNodes.length > 0 
      ? targetNodes[Math.floor(Math.random() * targetNodes.length)]
      : this.nodes[Math.floor(Math.random() * this.nodes.length)];

    return {
      x: (startNode?.x || 100) + (Math.random() * 20 - 10),
      y: (startNode?.y || 100) + (Math.random() * 20 - 10),
      targetX: (targetNode?.x || 400) + (Math.random() * 30 - 15),
      targetY: (targetNode?.y || 300) + (Math.random() * 30 - 15),
      speed: (0.8 + Math.random() * 0.8),
      size: Math.random() * 2 + 2,
      color: '#00F0FF',
      startNodeId: startNode?.id,
      targetNodeId: targetNode?.id
    };
  }

  start() {
    if (!this.animId) {
      this.render();
    }
  }

  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  render = () => {
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    this.ctx.clearRect(0, 0, width, height);

    // Draw background grid lines
    this.ctx.strokeStyle = 'rgba(31, 41, 61, 0.4)';
    this.ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }

    // Draw Pathway Edges
    (this.edges || []).forEach(edge => {
      const fromNode = this.nodes.find(n => n.id === edge.from);
      const toNode = this.nodes.find(n => n.id === edge.to);
      if (fromNode && toNode) {
        this.ctx.beginPath();
        this.ctx.moveTo(fromNode.x, fromNode.y);
        this.ctx.lineTo(toNode.x, toNode.y);
        this.ctx.strokeStyle = this.isEmergency ? 'rgba(239, 68, 68, 0.5)' : 'rgba(0, 240, 255, 0.25)';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([6, 6]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      }
    });

    // Update & Render Particles
    this.particles.forEach((p, idx) => {
      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 10) {
        // Reached destination, assign new target
        const exitNodes = this.nodes.filter(n => n.type === 'exit');
        const randomTarget = this.isEmergency && exitNodes.length > 0
          ? exitNodes[Math.floor(Math.random() * exitNodes.length)]
          : this.nodes[Math.floor(Math.random() * this.nodes.length)];
        
        p.targetX = (randomTarget?.x || 400) + (Math.random() * 30 - 15);
        p.targetY = (randomTarget?.y || 300) + (Math.random() * 30 - 15);
      } else {
        p.x += (dx / dist) * p.speed * this.speedMultiplier;
        p.y += (dy / dist) * p.speed * this.speedMultiplier;
      }

      // Draw particle dot with glow
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.isEmergency ? '#EF4444' : '#00F0FF';
      this.ctx.shadowColor = this.isEmergency ? '#EF4444' : '#00F0FF';
      this.ctx.shadowBlur = 6;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    });

    // Render Venue Nodes & Density Heatmap halos
    (this.nodes || []).forEach(node => {
      const fillPct = (node.crowd / (node.maxCapacity || 1000));
      let haloColor = 'rgba(16, 185, 129, 0.25)'; // green
      let strokeColor = '#10B981';

      if (fillPct >= 0.8) {
        haloColor = 'rgba(239, 68, 68, 0.4)'; // red
        strokeColor = '#EF4444';
      } else if (fillPct >= 0.5) {
        haloColor = 'rgba(245, 158, 11, 0.35)'; // amber
        strokeColor = '#F59E0B';
      }

      // Heatmap Density Halo
      const radius = 30 + fillPct * 45;
      const grad = this.ctx.createRadialGradient(node.x, node.y, 5, node.x, node.y, radius);
      grad.addColorStop(0, haloColor);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = grad;
      this.ctx.fill();

      // Node Anchor Circle
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, 14, 0, Math.PI * 2);
      this.ctx.fillStyle = '#111827';
      this.ctx.strokeStyle = strokeColor;
      this.ctx.lineWidth = 2.5;
      this.ctx.fill();
      this.ctx.stroke();

      // Label text
      this.ctx.font = 'bold 11px Inter, sans-serif';
      this.ctx.fillStyle = '#F3F4F6';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(node.label, node.x, node.y - 20);

      // Crowd Count badge
      this.ctx.font = '10px Inter, sans-serif';
      this.ctx.fillStyle = strokeColor;
      this.ctx.fillText(`${node.crowd} ppl (${Math.round(fillPct * 100)}%)`, node.x, node.y + 26);
    });

    this.animId = requestAnimationFrame(this.render);
  };
}
