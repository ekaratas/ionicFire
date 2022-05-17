import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public angularFirestore:AngularFirestore) { }


  yeniKayit(urun)
  {
      return this.angularFirestore.collection('DenemeListesi').add(urun);

  }

  listele()
  {
      return this.angularFirestore.collection('DenemeListesi', sirala => sirala.orderBy('tarih','desc')).snapshotChanges();

  }

  kayitGuncelle(id, urun)
{
  this.angularFirestore.doc('DenemeListesi/'+id).update(urun);
}

kayitSil(id)
{
  this.angularFirestore.doc('DenemeListesi/'+id).delete();
}

}
