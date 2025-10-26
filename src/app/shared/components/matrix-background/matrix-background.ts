import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-matrix-background',
  standalone: true,
  imports: [],
  template: `<canvas #matrixCanvas class="matrix-canvas"></canvas>`,
  styleUrl: './matrix-background.scss'
})
export class MatrixBackground implements OnInit, OnDestroy{

  @ViewChild('matrixCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private animationId!: number;
  private columns: number = 0;
  private drops: number[] = [];
  private fontSize: number = 10;

  ngOnInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    this.columns = Math.floor(canvas.width / this.fontSize);
    this.drops = Array(this.columns).fill(1);
  }

  private animate(): void {
    const canvas = this.canvasRef.nativeElement;
    
    // Effet de fondu pour créer la trainée
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Couleur verte Matrix
    this.ctx.fillStyle = '#0F0';
    this.ctx.font = `${this.fontSize}px monospace`;
    
    for (let i = 0; i < this.drops.length; i++) {
      // Caractères aléatoires (chiffres et lettres)
      const text = Math.random() > 0.5 
        ? String.fromCharCode(48 + Math.floor(Math.random() * 10)) // 0-9
        : String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
      
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;
      
      this.ctx.fillText(text, x, y);
      
      // Réinitialiser la colonne aléatoirement
      if (y > canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      
      this.drops[i]++;
    }
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
}
