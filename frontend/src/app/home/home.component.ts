import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="max-width:720px;margin:64px auto;padding:24px">
      <h1>Bienvenue</h1>
      <p>Vous êtes connecté.</p>
      <button (click)="onLogout()">Se déconnecter</button>
    </div>
  `,
  styles: [`button{padding:8px 16px;border-radius:8px;border:none;background:#444;color:#fff}`]
})
export class HomeComponent {
  private readonly auth = inject(AuthService);

  async onLogout(): Promise<void> {
    await this.auth.logout();
  }
}


