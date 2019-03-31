import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})

export class NotificationComponent implements OnInit {
  constructor(
  ) {
  }

  public isNotification: boolean = false;
  notificationSub: any;


  notificationMessage: { text: string, url: string, newTab: string }[] = [];
  notificationWithoutSlider: boolean = true;
  notificationType: string = "all";
  loopingNotification: any;
  isLooping: boolean;
  currentIndex: number = 0;
  readMoreText: string = 'Read more';
  otherNotifications:string="Other notifications";
  flightOrRoute: string = "";
  mouseOver:boolean=false;


  @ViewChild('notificationBlock') notificationBlock: ElementRef;


  ngOnInit() {

        this.readMoreText = "Read More"
        this.otherNotifications="Other notifications";
      
        let data:any={
          "message": [
                              {
                              "all": [
                                        {
                                        "text": "<b>Connect with me:</b> My name is Gangesh Raj . I love to build full stack apps. You can connect connect <a href=\"https://www.facebook.com/gangesh.raj.359\" target=\"_blank\" >GANGESH RAJ</a> for fun",
                                        "url": "",
                                        "newTab": ""
                                        },
                                        {
                                        "text": "<b>Hobbies:</b> There are lot of hobbies.I love to sing ,dance in my free time. I also love to solve coding problems.My passion is towards adventures sports.",
                                        "url": "",
                                        "newTab": "TRUE"
                                        }
                                      ]
                                }
                      ]
          };

        let a = (this.notValidStructure(data, this.flightOrRoute));
        if (a == true) {
          this.isNotification = false;
        }
        else {
          this.isNotification = true;
          this.startLoopNotification();
        }
          let usersearch='KUL-CGK';
            if (usersearch == undefined)
              return;
            let apiResponse = this.notValidStructure(data, usersearch);

            if (apiResponse == true) {
              this.notificationMessage = [];
              this.currentIndex = 0;
              this.isNotification = false;
              this.isLooping = false;
              this.clearLoopNotification();
            }
            else {
              this.currentIndex = 0;
              this.isNotification = true;
              if (this.notificationMessage.length > 1)
                this.startLoopNotification();
              else
                this.clearLoopNotification();
              
            }

  }



notValidStructure: (data: any, flightRoute?: string) => boolean = (data, flightRoute?: string) => {
    this.notificationMessage = [];
    if (data == null || data.message == null || data.message.length == null)
      return true;
    else {
      for (let index in data.message) {
        let objectNow = data.message[index]
        if (objectNow == null)
          return true;
        else {
          let key = Object.keys(objectNow)
          if (key.length != 1)
            return true;
          else {
            if (key[0].toLowerCase() == 'all' || (flightRoute != null && key[0].toLowerCase() == flightRoute.toLowerCase())) {

              let arrayCurrent = objectNow[key[0]];
              if (arrayCurrent.constructor !== Array) {
                return true;
              }
              for (let i = 0; i < arrayCurrent.length; ++i) {
                if (arrayCurrent[i] == null || arrayCurrent[i].text == null || arrayCurrent[i].url == null || arrayCurrent[i].newTab == null || arrayCurrent[i].text == '')
                  {
                    return true;
                  }
                else {
                  let newNotification: { text: string, url: string, newTab: string } = { text: "", url: "", newTab: "" };
                  newNotification.newTab = arrayCurrent[i].newTab;
                  newNotification.text = arrayCurrent[i].text;
                  if (arrayCurrent[i].newTab.toLowerCase() === "true") {
                    let index: number = newNotification.text.indexOf("<a ");
                    if (index !== -1)
                      newNotification.text = newNotification.text.slice(0, index + 3) + " " + "target=\"_blank\" " + newNotification.text.slice(index + 3);
                  }
                  newNotification.url = arrayCurrent[i].url;
                  this.notificationMessage.push(newNotification);
                }
              }
            }
          }
        }
      }
    }
    this.flightOrRoute = flightRoute;
    if (this.notificationMessage.length >= 1)
      {
        return false;
      }
    else
      {
        this.clearLoopNotification();
        return true;
      }
  }




  showHideSlider = () => {
    this.notificationWithoutSlider = !this.notificationWithoutSlider;
    if (this.notificationWithoutSlider === true) {
      if (this.isLooping === false)
        this.clearLoopNotification();

    } else {
      if (this.isLooping === true)
        this.startLoopNotification();
    }
    return this.notificationWithoutSlider;
  }



  startClearLoopNotification: (argument: string) => void = (mouseevent: string) => {

    if (this.notificationMessage.length <= 1) {
        this.clearLoopNotification();
        this.isLooping = false;
        return;
    }
    if (mouseevent === 'over') {
      this.mouseOver=true;
      if (this.isLooping == true) {
        if (this.notificationWithoutSlider) {
          this.clearLoopNotification();
          this.isLooping = false;
        }
      }
      else {

      }
    }
    else if (mouseevent = 'leave') {
      this.mouseOver=false;
      if (this.isLooping == false) {
        if (this.notificationWithoutSlider) {
          this.startLoopNotification();
          this.isLooping = true;
        }
      }

    }
  }

  openSlider = () => {
    this.clearLoopNotification();
    this.isLooping=false;
    this.notificationWithoutSlider = !this.notificationWithoutSlider;
  }


  clearLoopNotification: () => void = () => {
    try{
    clearInterval(this.loopingNotification);
    this.notificationBlock.nativeElement.classList.remove('animate');
    this.isLooping = false;
    }
    catch(error){
      console.log("This is not error the element which you want to do operation on does not exist")
    }
  }

  closeSlider = () => {
    this.notificationWithoutSlider = !this.notificationWithoutSlider;
    this.isLooping=true;
    this.startLoopNotification();
  }


  startLoopNotification: () => void = () => {
    if (this.notificationMessage.length <= 1 )
      return;
    if(this.isLooping==true)
    {
      this.clearLoopNotification();
    }
    this.isLooping = true;
    var self = this;
    this.loopingNotification = setInterval(() => {
      this.notificationBlock.nativeElement.classList.add('animate');
      var innerSelf = this;
      setTimeout(function () {
        if ((innerSelf.notificationWithoutSlider === true) && innerSelf.notificationMessage.length > 1) {
          innerSelf.currentIndex = innerSelf.currentIndex + 1;
          innerSelf.currentIndex = (innerSelf.currentIndex % innerSelf.notificationMessage.length);
        }
      }, 400)
      setTimeout(function () {
        innerSelf.notificationBlock.nativeElement.classList.remove('animate');
      }, 800);
    }, 5000);
  }


  isReadMe: (text: string) => string = (text) => text.length > 75 ? this.readMoreText : undefined;




  isShortNotification: (text: string) => string = (text) => {
    if(text==undefined||text=='')
    return ""
    let returnString: string = "";
    let index: number = 0;
    let charNo: number = 1;
    while (index < text.length) {
      if (text.charAt(index) === '<') {
        returnString += text.charAt(index);
        index = index + 1;
        if (index >= text.length)
          break;
        while (text.charAt(index) !== '>') {
          returnString += text.charAt(index);
          index = index + 1;
          if (index >= text.length)
            break;
        }
        returnString += text.charAt(index);
        index = index + 1;
      }
      else {
        charNo = charNo + 1;
        if (charNo <= 75)
          returnString += text.charAt(index);
        index = index + 1;
      }
    }
    return (charNo > 75 ? returnString + "..." : returnString)
  }

  removeCurrentNotification: () => { text: string, url: string, newTab: string }[] = () => this.notificationMessage.slice(0, this.currentIndex).concat(this.notificationMessage.slice(this.currentIndex + 1));

  showOtherNotification: () => boolean = () => {
    let x = this.notificationMessage.slice(0, this.currentIndex).concat(this.notificationMessage.slice(this.currentIndex + 1));
    if (x.length > 1)
      return true;
    else
      return false
  }


  ngOnDestroy() {
    if (this.notificationSub)
      this.notificationSub.unsubscribe();
  }

}
