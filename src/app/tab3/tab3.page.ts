import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

interface WorkEntry {
  date: string;
  hours: number;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  workHistory: WorkEntry[] = [];
  disappointmentLevel: number = 0.2;
  
  weeklyTotalHours: number = 0;
  weeklyAverage: number = 0;
  overworkDays: number = 0;
  restDays: number = 0;
  
  overworkEntries: WorkEntry[] = [];
  
  judgmentSeverity: string = 'medium';
  reminderFrequency: string = 'hourly';

  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadData();
    this.calculateStatistics();
  }

  ionViewWillEnter() {
    this.loadData();
    this.calculateStatistics();
  }

  calculateStatistics() {
    if (this.workHistory.length === 0) {
      this.weeklyTotalHours = 0;
      this.weeklyAverage = 0;
      this.overworkDays = 0;
      this.restDays = 0;
      this.overworkEntries = [];
      return;
    }

    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    
    const thisWeekEntries = this.workHistory.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= oneWeekAgo && entryDate <= today;
    });
    
    this.weeklyTotalHours = thisWeekEntries.reduce((sum, entry) => sum + entry.hours, 0);
    
    this.weeklyAverage = thisWeekEntries.length > 0 ? 
      this.weeklyTotalHours / thisWeekEntries.length : 0;
    
    this.overworkDays = thisWeekEntries.filter(entry => entry.hours > 8).length;
    this.restDays = thisWeekEntries.filter(entry => entry.hours <= 4).length;
    
    this.overworkEntries = this.workHistory
      .filter(entry => entry.hours > 8)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }

  getDisappointmentColor(): string {
    if (this.disappointmentLevel < 0.3) {
      return 'success';
    } else if (this.disappointmentLevel < 0.7) {
      return 'warning';
    } else {
      return 'danger';
    }
  }

  getDisappointmentMessage(): string {
    if (this.disappointmentLevel < 0.3) {
      return 'راك غادي مزيان! بقى قلل من ساعات ديال الخدمة';
    } else if (this.disappointmentLevel < 0.7) {
      return 'مستوى الخدمة مرتفع شوية، حاول تاخد شوية دالراحة';
    } else {
      return 'حشومة عليك! راك كتخدم بزاف، هادشي ما مزيانش';
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

  async resetDisappointment() {
    const alert = await this.alertController.create({
      header: 'تأكيد',
      message: 'واش باغي تمسح واش كتضحك عالوقت؟',
      buttons: [
        {
          text: 'لا',
          role: 'cancel',
        },
        {
          text: 'نعم',
          handler: () => {
            this.disappointmentLevel = 0.2;
            localStorage.setItem('disappointmentLevel', this.disappointmentLevel.toString());
            this.presentToast('تم تصفية واش كتضحك عالوقت');
          }
        }
      ]
    });

    await alert.present();
  }

  saveSettings() {
    localStorage.setItem('judgmentSeverity', this.judgmentSeverity);
    localStorage.setItem('reminderFrequency', this.reminderFrequency);
    this.presentToast('تم الحفظ ديال الإعدادات');
  }

  loadData() {
    const storedHistory = localStorage.getItem('workHistory');
    if (storedHistory) {
      this.workHistory = JSON.parse(storedHistory);
    }
    
    const storedDisappointment = localStorage.getItem('disappointmentLevel');
    if (storedDisappointment) {
      this.disappointmentLevel = parseFloat(storedDisappointment);
    }
    
    const storedJudgmentSeverity = localStorage.getItem('judgmentSeverity');
    if (storedJudgmentSeverity) {
      this.judgmentSeverity = storedJudgmentSeverity;
    }
    
    const storedReminderFrequency = localStorage.getItem('reminderFrequency');
    if (storedReminderFrequency) {
      this.reminderFrequency = storedReminderFrequency;
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
