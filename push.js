const webPush = require('web-push');

const vapidKeys = {
  publicKey: "BOU5XPWLz0PsODyVo4RVoDYhdclznzIy3fiP7Hd1qK-DMiAukfL22SNfCoGtteEx1g3y4RCRAFQXoN5605xEb-U",
  privateKey: "SJpWtL2XVqxYF0Adz7EC83B5sQdUR_aW9BruLetWs_o",
};

webPush.setVapidDetails(
  "mailto:dmsprtmiskandar@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
var pushSubscription = {
  endpoint: "https://fcm.googleapis.com/fcm/send/fRFvBh9oqP0:APA91bGM2LE6mH82rkErVzIGE_wLurBraBIiySIjcgKXLtXjP4ybzTOcvwfQqB-tSEHMoaVT15tTs2fdbcc4Vs-nlXmQj2prb5CTPzTwoFPm3_JeypmBJ9VuGMs63lVkQNKfU0ogxhPC",
  keys: {
    p256dh: "BEmR2HwQmKXN6q7I1YRNhDFjqDeThf9ddWa6DZpDRviIwkORgQmtVaRovl/xUonxY7Z4IV2fxFiUBIY9coBRpEQ=",
    auth: "CgUTEXmL8VdmMXdzvTNdQQ==",
  },
};
var payload = "Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!";

var options = {
  gcmAPIKey: "996968480466",
  TTL: 60,
};
webPush.sendNotification(pushSubscription, payload, options);
