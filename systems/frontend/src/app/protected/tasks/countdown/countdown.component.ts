import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import type { Subscription } from 'rxjs';

import { CountdownService } from '../countdown.service';

export enum CountdownType {
  LONG_BREAK = 'long break',
  POMODORO = 'pomodoro',
  SHORT_BREAK = 'short break',
}

@Component({
  selector: 'app-countdown',
  styleUrls: ['./countdown.component.css'],
  templateUrl: './countdown.component.html',
})
export class CountdownComponent implements OnInit {
  @Input()
  declare type: CountdownType;

  @ViewChild('videoElement')
  declare videoElement: ElementRef<HTMLVideoElement>;

  @Output()
  countdownComplete: EventEmitter<{
    type: CountdownType;
  }> = new EventEmitter();

  @Output()
  taskFinish: EventEmitter<{
    type: CountdownType;
  }> = new EventEmitter();

  @Output()
  timerStart: EventEmitter<{
    type: CountdownType;
  }> = new EventEmitter();

  protected countdownMs = 0;

  countdownSubscription?: Subscription;

  runDown = 0;

  constructor(private countDownService: CountdownService) {}

  private getCountdownMs(): number {
    switch (this.type) {
      case CountdownType.POMODORO:
        return 60000 * 25;
      case CountdownType.SHORT_BREAK:
        return 60000 * 5;
      case CountdownType.LONG_BREAK:
        return 60000 * 15;
      default:
        return 0;
    }
  }

  get countdownVideoUrl(): string | undefined {
    switch (this.type) {
      case CountdownType.POMODORO:
        return '/assets/25-minutes.mp4';
      case CountdownType.SHORT_BREAK:
        return '/assets/5-minutes.mp4';
      case CountdownType.LONG_BREAK:
        return '/assets/15-minutes.mp4';
      default:
        return undefined;
    }
  }

  async ngOnInit() {
    this.countdownMs = this.getCountdownMs();
    this.runDown = this.countdownMs;
  }

  get hasFocusedTask(): boolean {
    return this.countDownService.hasTaskFocused();
  }

  get isTimerRunning(): boolean {
    return this.countDownService.running;
  }

  get canStartTimer(): boolean {
    return this.countDownService.canStart();
  }

  private async reset() {
    const videoElement = this.videoElement.nativeElement;
    videoElement.currentTime = 0;
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    }
    this.countDownService.stop();
    this.runDown = this.countdownMs;
  }

  private async complete() {
    await this.reset();
    this.countdownComplete.emit({
      type: this.type,
    });
  }

  async start(): Promise<void> {
    if (this.type === CountdownType.POMODORO) {
      this.timerStart.emit({
        type: this.type,
      });
    }
    this.countdownSubscription = this.countDownService
      .start(this.countdownMs)
      .subscribe({
        complete: () => this.complete(),
        next: ms => {
          this.runDown = this.countdownMs - ms;
        },
      });
    const videoElement = this.videoElement.nativeElement;
    videoElement.currentTime = 0;
    await videoElement
      .play()
      .then(() => {
        return videoElement.requestPictureInPicture();
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
  }

  async stop(): Promise<void> {
    this.countdownSubscription?.unsubscribe();
    await this.reset();
  }

  async finish() {
    await this.reset();
    this.taskFinish.emit({ type: this.type });
  }
}
