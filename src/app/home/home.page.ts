import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { AlertController } from '@ionic/angular';


export interface Urun {
  urunAd:string;
  adet:number;
  tarih:number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  urun:Urun = {urunAd:null, adet:null, tarih:null};
  kayitlar:any;

  constructor(public firestoreService:FirestoreService, public alertController:AlertController) {
    this.listele();
  }

  kayitSil(id)
  {
    this.firestoreService.kayitSil(id);
    console.log('Kayıt Silindi!')

  }

  async presentAlertConfirm(id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Kayıt Sil',
      message: 'Bu kaydı silmek istiyor musunuz?',
      buttons: [
        {
          text: 'Vazgeç',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sil',
          handler: () => {
            this.kayitSil(id);
          }
        }
      ]
    });
  
    await alert.present();
  }

  async yeni() {
    const alert = await this.alertController.create({
      header: 'Ürün Ekle',
      inputs: [
        {
          name: 'urunInput',
          type: 'text',
          placeholder: 'Ürün Giriniz'
        },
        {
          name: 'adetInput',
          type: 'number',
          placeholder: 'Adet Giriniz'
        },
      ],
      buttons: [
        {
          text: 'Vazgeç',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Kaydet',
          handler: (islem) => {
            this.urun.tarih = Math.floor(Date.now() /  1000);
            this.urun.urunAd = islem.urunInput;
            this.urun.adet = islem.adetInput;
            this.firestoreService.yeniKayit(this.urun).then(res=> { 
              console.log(res.id); 
              this.urun.urunAd = null;
              this.urun.adet = null;
              this.urun.tarih = null;
            }).catch(err => {console.log(err)});
          }          }
      ]
    });
  
    await alert.present();
  }

  listele()
  {
    this.firestoreService.listele().subscribe(res=> {
      //console.log(res);
      this.kayitlar = res;
    }, err=>{
      console.log(err);
    });
  }

  async presentAlertPrompt(kayit) {
    const alert = await this.alertController.create({
      header: 'Ürün Güncelle',
      inputs: [
        {
          name: 'urun',
          type: 'text',
          value: kayit.payload.doc.data().urunAd,
          placeholder: 'Ürün Giriniz'
        },
        {
          name: 'adet',
          type: 'number',
          value: kayit.payload.doc.data().adet,
          placeholder: 'Adet Giriniz'
        },
      ],
      buttons: [
        {
          text: 'Vazgeç',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Güncelle',
          handler: (sonuc) => {
  
            let guncellenecekData = {'urunAd':null,'adet':null, tarih:null};
  
            if (sonuc.urun !== '' && sonuc.adet !=='' && (sonuc.urun !== kayit.payload.doc.data().urunAd || sonuc.adet !== kayit.payload.doc.data().adet)) {
              guncellenecekData.tarih = Math.floor(Date.now() / 1000);
              guncellenecekData.urunAd = sonuc.urun;
              guncellenecekData.adet = sonuc.adet;
            this.kayitGuncelle(kayit.payload.doc.id, guncellenecekData);
            }
            else {
              console.log('Değişiklik Yok');
            }
            
  
          }
        }
      ]
    });
  
    await alert.present();
  }

  kayitGuncelle(id, veri)
  {
    this.firestoreService.kayitGuncelle(id, veri);
    //console.log(veri)

  }

}
