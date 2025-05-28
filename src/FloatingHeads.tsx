import React, { useRef, useEffect } from 'react';

type Heart = {
  x: number;
  y: number;
  vy: number;
  alpha: number;
  createdAt: number;
};

type Head = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  isPopped: boolean;
  popTime: number;
  hearts: Heart[];
};

const NUM_HEADS = 13;
const IMAGE_SRC = '/osimhen.png';
const HEART_SRC = '/heart.png';
const SIZE = 63;
const MAX_SPEED = 2;
const MIN_SPEED = 0.3;

const FloatingHeads: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heads = useRef<Head[]>([]);
  const imgRef = useRef<HTMLImageElement>(new Image());
  const heartImgRef = useRef<HTMLImageElement>(new Image());
  const animationFrameId = useRef<number>();

  const getObstacleAreas = () => {
    const button = document.querySelector('button');
    const iframe = document.querySelector('iframe');
    const obstacles: { x: number; y: number; width: number; height: number }[] = [];
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

  const pushOutFromObstacle = (head: Head, area: { x: number; y: number; width: number; height: number }) => {
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

  const clampSpeed = (head: Head) => {
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
    heartImgRef.current.src = HEART_SRC;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    const randomVelocity = () => (Math.random() - 0.5) * 1.2;

    function initHeads() {
      heads.current = Array.from({ length: NUM_HEADS }).map(() => ({
        x: Math.random() * (canvas.width - SIZE),
        y: Math.random() * (canvas.height - SIZE),
        vx: randomVelocity(),
        vy: randomVelocity(),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        isPopped: false,
        popTime: 0,
        hearts: []
      }));
    }

    const handleInteraction = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      for (const head of heads.current) {
        if (!head.isPopped && x > head.x && x < head.x + SIZE && y > head.y && y < head.y + SIZE) {
          head.isPopped = true;
          head.popTime = Date.now();
          for (let i = 0; i < 7; i++) {
            head.hearts.push({
              x: head.x + SIZE / 2,
              y: head.y + SIZE / 2,
              vy: -Math.random() * 2 - 1,
              alpha: 1,
              createdAt: Date.now() + i * 50
            });
          }
        }
      }
    };

    // 🔁 Burada canvas yerine window kullanıyoruz:
    const onClick = (e: MouseEvent) => handleInteraction(e.clientX, e.clientY);
    const onTouchStart = (e: TouchEvent) => handleInteraction(e.touches[0].clientX, e.touches[0].clientY);

    window.addEventListener('click', onClick);
    window.addEventListener('touchstart', onTouchStart);

    function update() {
      const now = Date.now();
      const obstacleAreas = getObstacleAreas();

      for (let head of heads.current) {
        if (!head.isPopped) {
          head.x += head.vx;
          head.y += head.vy;
          head.rotation += head.rotationSpeed;

          if (head.x <= 0 || head.x + SIZE >= canvas.width) head.vx = -head.vx;
          if (head.y <= 0 || head.y + SIZE >= canvas.height) head.vy = -head.vy;

          for (const area of obstacleAreas) pushOutFromObstacle(head, area);
          clampSpeed(head);
        }

        head.hearts = head.hearts.filter((h) => now - h.createdAt < 1000);
        for (let heart of head.hearts) {
          heart.y += heart.vy;
          heart.alpha = 1 - (now - heart.createdAt) / 1000;
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let head of heads.current) {
        if (!head.isPopped) {
          ctx.save();
          ctx.translate(head.x + SIZE / 2, head.y + SIZE / 2);
          ctx.rotate(head.rotation);
          ctx.drawImage(img, -SIZE / 2, -SIZE / 2, SIZE, SIZE);
          ctx.restore();
        }

        for (let heart of head.hearts) {
          ctx.save();
          ctx.globalAlpha = heart.alpha;
          ctx.drawImage(heartImgRef.current, heart.x - 16, heart.y - 16, 32, 32);
          ctx.restore();
        }
      }
    }

    function animate() {
      update();
      draw();
      animationFrameId.current = requestAnimationFrame(animate);
    }

    initHeads();
    animate();

    const onResize = () => {
      resizeCanvas();
      initHeads();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('click', onClick);
      window.removeEventListener('touchstart', onTouchStart);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        pointerEvents: 'none', // 🔁 burada güncelledik
        zIndex: 9999,
      }}
    />
  );
};

export default FloatingHeads;
