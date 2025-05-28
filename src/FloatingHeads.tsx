import React, { useRef, useEffect } from 'react';

type Head = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  isPopped: boolean;
  popTime: number;
};

const NUM_HEADS = 10;
const IMAGE_SRC = '/osimhen.png';
const SIZE = 63;
const MAX_SPEED = 2;
const MIN_SPEED = 0.3;

const FloatingHeads: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heads = useRef<Head[]>([]);
  const imgRef = useRef<HTMLImageElement>(new Image());
  const scatterTrigger = useRef(false);
  const animationFrameId = useRef<number>();

  // Engel alanlarını al, button ve iframe çarpışma alanları
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

  // Engel alanından kafayı dışarı it
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

  // Kafaların birbirini itme fonksiyonu
  const applyRepulsion = (headA: Head, headB: Head) => {
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

  // Hız sınırla ve düşük hızda rastgele hareket ver
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

    // Canvas boyutlarını ayarla
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    // Rastgele hız üret
    function randomVelocity() {
      return (Math.random() - 0.5) * 1.2;
    }

    // Kafaları başlat
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

    // Tıklama ve dokunma ile kafa patlatma
    const handleInteraction = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      for (const head of heads.current) {
        if (!head.isPopped && x > head.x && x < head.x + SIZE && y > head.y && y < head.y + SIZE) {
          head.isPopped = true;
          head.popTime = Date.now();
        }
      }
    };

    const onClick = (e: MouseEvent) => handleInteraction(e.clientX, e.clientY);
    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleInteraction(touch.clientX, touch.clientY);
    };

    canvas.addEventListener('click', onClick);
    canvas.addEventListener('touchstart', onTouchStart);

    // Güncelleme fonksiyonu
    function update() {
      const obstacleAreas = getObstacleAreas();

      for (let head of heads.current) {
        if (head.isPopped && Date.now() - head.popTime > 300) continue;

        head.x += head.vx;
        head.y += head.vy;
        head.rotation += head.rotationSpeed;

        // Kenar çarpışmaları
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

        // Engel alanlarından dışarı it
        for (const area of obstacleAreas) {
          pushOutFromObstacle(head, area);
        }

        clampSpeed(head);
      }

      // Kafaların birbirini itmesi
      for (let i = 0; i < heads.current.length; i++) {
        for (let j = i + 1; j < heads.current.length; j++) {
          applyRepulsion(heads.current[i], heads.current[j]);
        }
      }

      // Scatter trigger
      if (scatterTrigger.current) {
        for (let head of heads.current) {
          head.vx = (Math.random() - 0.5) * 6;
          head.vy = (Math.random() - 0.5) * 6;
        }
        scatterTrigger.current = false;
      }
    }

    // Çizim fonksiyonu
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let head of heads.current) {
        if (head.isPopped) {
          const scale = 1 - (Date.now() - head.popTime) / 300;
          if (scale <= 0) continue;
          ctx.save();
          ctx.translate(head.x + SIZE / 2, head.y + SIZE / 2);
          ctx.rotate(head.rotation);
          ctx.globalAlpha = scale;
          ctx.drawImage(img, -SIZE / 2, -SIZE / 2, SIZE, SIZE);
          ctx.restore();
        } else {
          ctx.save();
          ctx.translate(head.x + SIZE / 2, head.y + SIZE / 2);
          ctx.rotate(head.rotation);
          ctx.globalAlpha = 1;
          ctx.drawImage(img, -SIZE / 2, -SIZE / 2, SIZE, SIZE);
          ctx.restore();
        }
      }
    }

    // Animasyon döngüsü
    function animate() {
      update();
      draw();
      animationFrameId.current = requestAnimationFrame(animate);
    }

    initHeads();
    animate();

    // Pencere yeniden boyutlandığında canvas'ı ve kafaları yeniden ayarla
    const onResize = () => {
      resizeCanvas();
      initHeads();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('touchstart', onTouchStart);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  // Scatter dışarıdan tetikleme (opsiyonel)
  const scatterHeads = () => {
    scatterTrigger.current = true;
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh', // Mobilde de tam yükseklik için
          pointerEvents: 'auto', // Canvas üzerindeki tıklama ve dokunmayı açık tut
          zIndex: 10,
        }}
      />
    </>
  );
};

export default FloatingHeads;
