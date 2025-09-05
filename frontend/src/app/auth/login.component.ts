import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width:420px;margin:64px auto;padding:24px;border:1px solid #ddd;border-radius:12px">
      <h2>Connexion</h2>
      <form (ngSubmit)="onSubmit()" #form="ngForm">
        <label>Email</label>
        <input type="email" name="email" [(ngModel)]="email" required class="input" />
        <label>Mot de passe</label>
        <input type="password" name="password" [(ngModel)]="password" required class="input" />
        <button type="submit" [disabled]="loading() || !form.valid">Se connecter</button>
      </form>
      <p *ngIf="error()" style="color:#b00020">{{ error() }}</p>
    </div>
  `,
  styles: [
    `.input{display:block;width:100%;margin:8px 0 16px;padding:8px 10px;border:1px solid #ccc;border-radius:8px}`,
    `button{padding:8px 16px;border-radius:8px;border:none;background:#1976d2;color:#fff}`
  ]
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  async onSubmit(): Promise<void> {
    this.error.set('');
    this.loading.set(true);
    try {
      await this.auth.login(this.email, this.password);
      await this.router.navigateByUrl('/');
    } catch (e: any) {
      this.error.set(e?.message ?? 'Échec de la connexion');
    } finally {
      this.loading.set(false);
    }
  }
}


