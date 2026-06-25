import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private auth: AuthService,
    private platform: Platform
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.auth.load_jwts();
      this.auth.check_token_fragment();
    });
  }
}
