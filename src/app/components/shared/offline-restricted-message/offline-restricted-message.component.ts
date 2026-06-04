import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OFFLINE_OTHER_USERS_MESSAGE } from '../../../core/offline/offline-mode.constants';

@Component({
  selector: 'app-offline-restricted-message',
  standalone: true,
  template: `<p class="offline-restricted-message">{{ message }}</p>`,
  styles: [
    `
      .offline-restricted-message {
        margin: 1rem 0;
        padding: 12px 16px;
        background: #fff8e6;
        border: 1px solid #f0d78c;
        border-radius: 8px;
        color: #5c4a1a;
        font-size: 0.95rem;
        line-height: 1.45;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfflineRestrictedMessageComponent {
  readonly message = OFFLINE_OTHER_USERS_MESSAGE;
}
