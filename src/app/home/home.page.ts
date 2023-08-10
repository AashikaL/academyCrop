import { Component, ViewChild } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';
import { ImageCroppedEvent, ImageCropperComponent, ImageTransform, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('cropper') cropper: ImageCropperComponent | undefined
  imageChangedEvent: any = '';
  myImage: any;
  croppedImage: any = '';
  isMobile = Capacitor.getPlatform() !== 'web';
  transform: ImageTransform = {}

  constructor(private loadingCtrl: LoadingController) {
  }
  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    });
    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.myImage = `data:image/jpeg;base64, ${image.base64String}`;
    this.croppedImage = null;
  }
  imageLoaded() {
    this.loadingCtrl.dismiss();
  }
  loadImageFailed() {
    console.log('Image load faild!');
  }
  async cropImage() {
    const croppedEvent = await this.cropper?.crop();
    if (croppedEvent) {
      this.croppedImage = croppedEvent.objectUrl;
    }
    console.log('done', this.croppedImage)
    this.myImage = null;
  }
  rotate() {
    const newVale = ((this.transform.rotate ?? 0) + 90) % 360;
    this.transform = { ...this.transform, rotate: newVale }
  }
  flipHorizontal() {
    this.transform = { ...this.transform, flipH: !this.transform.flipH }
  }
  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    }
  }
  discardChanges() {
    this.myImage = null;
    this.croppedImage = null;
  }
}
