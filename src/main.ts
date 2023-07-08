import 'zone.js/dist/zone';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { filter, interval, Observable } from 'rxjs';
import { map, scan } from 'rxjs/operators';

// Note: Partially AI generated

interface Row {
  checked: boolean;
  inputValue: string;
  stopWatch: string;
  ticking: boolean;
  timer$: Observable<number>;
}

class Row implements Row {
  constructor(
    public checked = false,
    public inputValue = '',
    public stopWatch = '00:00:00',
    public ticking = false
  ) {
    this.timer$ = interval(1001).pipe(
      filter(() => !this.checked && this.ticking),
      map(() => 1),
      scan((acc, curr) => acc + curr, 0)
    );
  }
}
const padZero = (num: number) => num.toString().padStart(2, '0');

@Pipe({ name: 'time', standalone: true })
export class TimePipe implements PipeTransform {
  transform(value: number | null = null): string {
    return TimePipe.formatTime(value ?? 0);
  }

  static formatTime(time: number) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
  }
}

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, TimePipe],
  template: `
    <div>
      <button (click)="addRow()">Add Row</button>
    </div>
    <div *ngFor="let row of rows; let i = index">
      <input type="checkbox" (click)="lockTask(row)">
      <input type="text">
      <button [disabled]="row.checked" (click)="startStopwatch(row)">Start/Stop</button>
      <!-- <span>{{ row.stopWatch }}</span> -->
      <span [ngClass]="{'timer-paused':row.checked, 'timer-active':row.ticking}" style="margin-left: 5px">{{ row.timer$|async|time }}</span>
    </div>
    <button (click)="reset()">Reset</button>
  `,
})
export class App {
  rows: Row[] = [new Row()];
  intervalId: number = 0;

  addRow() {
    this.rows.push(new Row());
  }

  reset() {
    this.rows = [new Row()];
  }

  lockTask(row: Row) {
    if (row.ticking && !row.checked) {
      row.ticking = false;
    }
    row.checked = !row.checked;
  }

  startStopwatch(row: Row) {
    row.ticking = !row.ticking;
    // This doesn't work
    // row.stopWatch = '00:00:00';
    // const startTime = Date.now();
    // this.intervalId = setInterval(() => {
    //   const currentTime = Date.now();
    //   const elapsedTime = currentTime - startTime;
    //   row.stopWatch = this.formatTime(elapsedTime);
    // }, 1000);
  }
}

bootstrapApplication(App);
