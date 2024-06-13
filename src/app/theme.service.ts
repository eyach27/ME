import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private modeSubject = new BehaviorSubject<string>(this.getInitialMode());
  public mode$ = this.modeSubject.asObservable();

  constructor() {
    const body = document.body;
    body.classList.add(this.mode); // body.classList.add('light');  initialize body with light mode
  }
  get mode(): string {
    return this.modeSubject.value;
  }

  set mode(value: string) 
  {
    this.modeSubject.next(value);
    const body = document.body;
    if (value === "dark") {
      body.classList.remove('light');
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
      body.classList.add('light');
    }
  
    // update localStorage with the selected mode
    localStorage.setItem('mode', value);
  }
  
  toggleMode() {
    const icon = document.getElementById('changemode');
    const mode = this.mode;
    
    // set the body class and icon based on the mode
    if (mode === "dark") {
      icon.classList.add("bx-sun");
      icon.classList.remove("bx-moon");
      this.mode = 'light'; // set to light mode when toggled from dark
    } else {
      icon.classList.add("bx-moon");
      icon.classList.remove("bx-sun");
      this.mode = 'dark'; // set to dark mode when toggled from light
    }
  }
  

  observeMode() {
    return this.mode$;
  }

  private getInitialMode(): string {
    // get the mode from localStorage, or default to light mode
    const storedMode = localStorage.getItem('mode');
    return storedMode || 'light';
  }
}
