import React, { useRef, useEffect } from 'react';

const NUM_HEADS = 26;
const IMAGE_SRC = '/osimhen.png';
const SIZE = 70;
const MAX_SPEED = 2;
const MIN_SPEED = 0.3;

const FloatingHeads: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heads = useRef<any[]>([]);
  const imgRef = useRef<HTMLImageElement>(new Image());
  const scatterTrigger = useRef(false);

  const getObstacleAreas = () => {
    const button = document.querySelector('button');
    const iframe = document.querySelector('iframe');
    const obstacles: any[] = [];
    if (button) {
      const rect = button.getBoundingClientRect();
      obstacles.push({ x: rect.left - 40, y: rect.top - 40, width: rect.width + 80, height: rect.height + 80 });
    }
    if (iframe) {
      const rect = iframe.getBoundingClientRect();
      obstacles.push({ x: rect.left - 40, y: rect.top - 40, width: rect.width + 80, height: rect.height + 80 });
    }
    return obstacles;
  };

  const pushOutFromObstacle = (head: any, area: any) => {
    const overlapX = Math.min(head.x + SIZE, area.x + area.width) - Math.max(head.x, area.x);
    const overlapY = Math.min(head.y + SIZE, area.y + area.height) - Math.max(head.y, area.y);

    if (overlapX > 0 && overlapY > 0) {
      if (overlapX < overlapY) {
        if (head.x < area.x) head.x -= overlapX * 0.5;
        else head.x += overlapX * 0.5;
        head.vx = -head.vx * 0.6;
      } else {
        if (head.y < area.y) head.y -= overlapY * 0.5;
        else head.y += overlapY * 0.5;
        head.vy = -head.vy * 0.6;
      }
    }
  };

  const applyRepulsion = (headA: any, headB: any) => {
    const dx = headB.x - headA.x;
    const dy = headB.y - headA.y;
    const distSq = dx * dx + dy * dy;
    const minDist = SIZE;
    const minDistSq = minDist * minDist;

    if (distSq < minDistSq && distSq > 0) {
      const dist = Math.sqrt(distSq);
      const overlap = minDist - dist;
      const nx = dx / dist;
      const ny = dy / dist;
      const force = overlap * 0.1;
      headA.vx -= nx * force;
      headA.vy -= ny * force;
      headB.vx += nx * force;
      headB.vy += ny * force;
    }
  };

  const clampSpeed = (head: any) => {
    const speed = Math.sqrt(head.vx * head.vx + head.vy * head.vy);
    if (speed > MAX_SPEED) {
      head.vx = (head.vx / speed) * MAX_SPEED;
      head.vy = (head.vy / speed) * MAX_SPEED;
    } else if (speed < MIN_SPEED) {
      head.vx += (Math.random() - 0.5) * 0.1;
      head.vy += (Math.random() - 0.5) * 0.1;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const img = imgRef.current;
    img.src = IMAGE_SRC;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    function randomVelocity() {
      return (Math.random() - 0.5) * 1.2;
    }

    function initHeads() {
      heads.current = Array.from({ length: NUM_HEADS }).map(() => ({
        x: Math.random() * (canvas.width - SIZE),
        y: Math.random() * (canvas.height - SIZE),
        vx: randomVelocity(),
        vy: randomVelocity(),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        isPopped: false,
        popTime: 0
      }));
    }

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      for (const head of heads.current) {
        if (!head.isPopped && mouseX > head.x && mouseX < head.x + SIZE && mouseY > head.y && mouseY < head.y + SIZE) {
          head.isPopped = true;
          head.popTime = Date.now();
        }
      }
    });

    function update() {
      const obstacleAreas = getObstacleAreas();

      for (let head of heads.current) {
        if (head.isPopped && Date.now() - head.popTime > 300) continue;

        head.x += head.vx;
        head.y += head.vy;
        head.rotation += head.rotationSpeed;

        if (head.x <= 0) {
          head.x = 0;
          head.vx = Math.abs(head.vx) * 0.7;
        }
        if (head.x + SIZE >= canvas.width) {
          head.x = canvas.width - SIZE;
          head.vx = -Math.abs(head.vx) * 0.7;
        }
        if (head.y <= 0) {
          head.y = 0;
          head.vy = Math.abs(head.vy) * 0.7;
        }
        if (head.y + SIZE >= canvas.height) {
          head.y = canvas.height - SIZE;
          head.vy = -Math.abs(head.vy) * 0.7;
        }

        for (const area of obstacleAreas) {
          pushOutFromObstacle(head, area);
        }

        clampSpeed(head);
      }

      for (let i = 0; i < heads.current.length; i++) {
        for (let j = i + 1; j < heads.current.length; j++) {
          applyRepulsion(heads.current[i], heads.current[j]);
        }
      }

      if (scatterTrigger.current) {
        for (let head of heads.current) {
          head.vx = (Math.random() - 0.5) * 6;
          head.vy = (Math.random() - 0.5) * 6;
        }
        scatterTrigger.current = false;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let head of heads.current) {
        if (head.isPopped) {
          const scale = 1 - (Date.now() - head.popTime) / 300;
          if (scale <= 0) continue;
          ctx.save();
          ctx.translate(head.x + SIZE / 2, head.y + SIZE / 2);
          ctx.scale(scale, scale);
          ctx.rotate(head.rotation);
          ctx.drawImage(img, -SIZE / 2, -SIZE / 2, SIZE, SIZE);
          ctx.restore();
        } else {
          ctx.save();
          ctx.translate(head.x + SIZE / 2, head.y + SIZE / 2);
          ctx.rotate(head.rotation);
          ctx.drawImage(img, -SIZE / 2, -SIZE / 2, SIZE, SIZE);
          ctx.restore();
        }
      }
    }

    function animate() {
      update();
      draw();
      requestAnimationFrame(animate);
    }

    img.onload = () => {
      initHeads();
      animate();
    };

    window.addEventListener('resize', () => {
      resizeCanvas();
      initHeads();
    });

    const scatterHandler = () => {
      scatterTrigger.current = true;
    };
    window.addEventListener('osimhen-scatter', scatterHandler);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('osimhen-scatter', scatterHandler);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
};

export default FloatingHeads;
