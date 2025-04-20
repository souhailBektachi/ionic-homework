import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  disappointmentLevel: number = 0.2;
  disappointmentColor: string = 'success';
  judgmentMessage: string = 'مزيان! بقى رتاح';

  lastResponse: boolean | null = null;
  responseMessage: string = '';

  dailyWorkHours: number = 0;
  workHistory: { date: string, hours: number }[] = [];

  lowWorkMessages: string[] = [
    'مزيان! بقى رتاح',
    'هادشي زوين! ما تخدمش بزاف',
    'راك غادي مزيان، كمل هاكا',
    'بقى بعيد على الخدمة، راك فالطريق الصحيح'
  ];

  mediumWorkMessages: string[] = [
    'راك كتخدم بزاف، خود شوية دالراحة',
    'مستوى الخدمة مرتفع شوية، فكر ترتاح',
    'الخدمة ماشي هي كولشي، عقل على راسك'
  ];

  highWorkMessages: string[] = [
    'حشومة عليك! راك كتخدم بزاف',
    'وقف الخدمة دابا! راك كتخيب فيا الظن',
    'مستوى الخيبة مرتفع بزاف، رتاح شوية',
    'علاش هاد لخدمة كاملة؟ حشومة عليك!'
  ];

  constructor(private toastController: ToastController) {}

  ngOnInit() {
    this.loadWorkHistory();
    this.calculateDisappointment();
    this.scheduleNextCheckIn();
  }

  reportWorking(isWorking: boolean) {
    this.lastResponse = isWorking;
    
    if (isWorking) {
      const disappointmentResponses = [
        'حشومة عليك! وقف الخدمة دابا',
        'علاش كتخيب فيا الظن هاكا؟ خود شوية دالراحة',
        'أنا حزين حيت راك كتخدم، حاول ترتاح شوية'
      ];
      this.responseMessage = disappointmentResponses[Math.floor(Math.random() * disappointmentResponses.length)];
      
      this.disappointmentLevel = Math.min(1, this.disappointmentLevel + 0.05);
    } else {
      const praiseResponses = [
        'مزيان بزاف! بقى رتاح، هادشي زوين',
        'هاكا هاكا! الراحة هي الأساس',
        'أنا فرحان بيك، بقى مرتاح دائماً'
      ];
      this.responseMessage = praiseResponses[Math.floor(Math.random() * praiseResponses.length)];
      
      this.disappointmentLevel = Math.max(0, this.disappointmentLevel - 0.05);
    }
    
    this.calculateDisappointment();
    this.saveWorkHistory();
  }

  submitDailyHours() {
    if (this.dailyWorkHours < 0) this.dailyWorkHours = 0;
    if (this.dailyWorkHours > 24) this.dailyWorkHours = 24;
    
    const today = new Date().toISOString().split('T')[0];
    
    const existingEntry = this.workHistory.find(entry => entry.date === today);
    if (existingEntry) {
      existingEntry.hours = this.dailyWorkHours;
    } else {
      this.workHistory.push({ date: today, hours: this.dailyWorkHours });
    }
    
    if (this.dailyWorkHours <= 4) {
      this.disappointmentLevel = Math.max(0, this.disappointmentLevel - 0.1);
    } else if (this.dailyWorkHours <= 8) {
      this.disappointmentLevel = Math.min(1, this.disappointmentLevel + 0.1);
    } else {
      this.disappointmentLevel = Math.min(1, this.disappointmentLevel + 0.2);
    }
    
    this.calculateDisappointment();
    this.saveWorkHistory();
    this.presentToast(`تم تسجيل ${this.dailyWorkHours} ساعات ديال الخدمة لهاد النهار`);
  }

  calculateDisappointment() {
    if (this.disappointmentLevel < 0.3) {
      this.disappointmentColor = 'success';
      this.judgmentMessage = this.getRandomMessage(this.lowWorkMessages);
    } else if (this.disappointmentLevel < 0.7) {
      this.disappointmentColor = 'warning';
      this.judgmentMessage = this.getRandomMessage(this.mediumWorkMessages);
    } else {
      this.disappointmentColor = 'danger';
      this.judgmentMessage = this.getRandomMessage(this.highWorkMessages);
    }
  }

  scheduleNextCheckIn() {
    const checkInInterval = 1000 * 60 * 60;
    setTimeout(() => {
      console.log('Time for a work check-in!');
      this.scheduleNextCheckIn();
    }, checkInInterval);
  }

  getRandomMessage(messages: string[]): string {
    return messages[Math.floor(Math.random() * messages.length)];
  }

  saveWorkHistory() {
    localStorage.setItem('workHistory', JSON.stringify(this.workHistory));
    localStorage.setItem('disappointmentLevel', this.disappointmentLevel.toString());
  }

  loadWorkHistory() {
    const storedHistory = localStorage.getItem('workHistory');
    if (storedHistory) {
      this.workHistory = JSON.parse(storedHistory);
    }
    
    const storedDisappointment = localStorage.getItem('disappointmentLevel');
    if (storedDisappointment) {
      this.disappointmentLevel = parseFloat(storedDisappointment);
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
