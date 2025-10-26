import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Footer } from './shared/components/footer/footer';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeService, ThemeMode } from './utils/theme-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MatToolbarModule,Footer,MatIconModule,
    MatSidenavModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
    MatListModule,
    RouterLink,
    RouterLinkActive,],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('GenCut2');

   ts = inject(ThemeService);

   constructor(public router: Router) {}

  switchTheme = (theme: ThemeMode) => this.ts.setTheme(theme);

  
}
