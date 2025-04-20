import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

interface WorkEntry {
  date: string;
  hours: number;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  selectedDate: string = new Date().toISOString();
  workHours: number = 0;
  workHistory: WorkEntry[] = [];

  weeklyAverage: number = 0;
  daysWorkedThisWeek: number = 0;
  maxWorkHours: number = 0;
  minWorkHours: number = 0;

  constructor(private toastController: ToastController) {}

  ngOnInit() {
    this.loadWorkHistory();
    this.calculateStatistics();
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
    const existingEntry = this.workHistory.find(entry => entry.date === this.getDateString(this.selectedDate));
    if (existingEntry) {
      this.workHours = existingEntry.hours;
    } else {
      this.workHours = 0;
    }
  }

  recordWorkHours() {
    if (this.workHours < 0) this.workHours = 0;
    if (this.workHours > 24) this.workHours = 24;

    const dateString = this.getDateString(this.selectedDate);
    const existingEntryIndex = this.workHistory.findIndex(entry => entry.date === dateString);

    if (existingEntryIndex >= 0) {
      this.workHistory[existingEntryIndex].hours = this.workHours;
    } else {
      this.workHistory.push({
        date: dateString,
        hours: this.workHours
      });
    }

    this.saveWorkHistory();
    this.calculateStatistics();
    this.presentToast(`تم تسجيل ${this.workHours} ساعات ديال الخدمة ليوم ${this.formatDate(dateString)}`);

    this.updateDisappointmentLevel();
  }

  deleteWorkEntry(date: string) {
    this.workHistory = this.workHistory.filter(entry => entry.date !== date);
    this.saveWorkHistory();
    this.calculateStatistics();
    this.presentToast('تم الحيد ديال السجل');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('ar-MA', options);
  }

  getDateString(isoString: string): string {
    return isoString.split('T')[0];
  }

  getJudgmentForHours(hours: number): string {
    if (hours <= 4) {
      return 'مزيان بزاف!';
    } else if (hours <= 8) {
      return 'معقول';
    } else {
      return 'حشومة!';
    }
  }

  getColorForHours(hours: number): string {
    if (hours <= 4) {
      return 'success';
    } else if (hours <= 8) {
      return 'warning';
    } else {
      return 'danger';
    }
  }

  calculateStatistics() {
    if (this.workHistory.length === 0) {
      this.weeklyAverage = 0;
      this.daysWorkedThisWeek = 0;
      this.maxWorkHours = 0;
      this.minWorkHours = 0;
      return;
    }

    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    
    const thisWeekEntries = this.workHistory.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= oneWeekAgo && entryDate <= today;
    });
    
    this.daysWorkedThisWeek = thisWeekEntries.length;
    
    if (thisWeekEntries.length > 0) {
      const totalHours = thisWeekEntries.reduce((sum, entry) => sum + entry.hours, 0);
      this.weeklyAverage = totalHours / thisWeekEntries.length;
    } else {
      this.weeklyAverage = 0;
    }

    const hours = this.workHistory.map(entry => entry.hours);
    this.maxWorkHours = hours.length > 0 ? Math.max(...hours) : 0;
    this.minWorkHours = hours.length > 0 ? Math.min(...hours) : 0;
  }

  updateDisappointmentLevel() {
    let disappointmentLevel = 0.2;
    const storedLevel = localStorage.getItem('disappointmentLevel');
    if (storedLevel) {
      disappointmentLevel = parseFloat(storedLevel);
    }

    if (this.workHours <= 4) {
      disappointmentLevel = Math.max(0, disappointmentLevel - 0.05);
    } else if (this.workHours <= 8) {
      disappointmentLevel = Math.min(1, disappointmentLevel + 0.05);
    } else {
      disappointmentLevel = Math.min(1, disappointmentLevel + 0.1);
    }

    localStorage.setItem('disappointmentLevel', disappointmentLevel.toString());
  }

  saveWorkHistory() {
    localStorage.setItem('workHistory', JSON.stringify(this.workHistory));
  }

  loadWorkHistory() {
    const storedHistory = localStorage.getItem('workHistory');
    if (storedHistory) {
      this.workHistory = JSON.parse(storedHistory);
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
