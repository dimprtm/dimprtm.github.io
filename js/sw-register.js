// REGISTER SERVICE WORKER
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("../service-worker.js")
            .then(function () {
                //console.log("Pendaftaran ServiceWorker berhasil");
            })
            .catch(function () {
                console.log("Pendaftaran ServiceWorker gagal");
            });

        requestPermission();
    });
} else {
    console.log("ServiceWorker belum didukung browser ini.");
}

function requestPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then((result) => {
            if (result === "denied") {
                console.log("Fitur notifikasi tidak diijinkan.");
                return;
            } else if (result === "default") {
                console.error("Pengguna menutup kotak dialog permintaan ijin.");
                return;
            }
            //console.log("Notification granted");

            if ("PushManager" in window) {
                navigator.serviceWorker.getRegistration().then((reg) => {
                    reg.pushManager
                        .subscribe({
                            userVisibleOnly: true,
                            applicationServerKey:
                                urlBase64ToUint8Array('BOU5XPWLz0PsODyVo4RVoDYhdclznzIy3fiP7Hd1qK-DMiAukfL22SNfCoGtteEx1g3y4RCRAFQXoN5605xEb-U'),
                        })
                        .then((sub) => {
                            console.log(
                                "Berhasil melakukan subscribe dengan endpoint:" +
                                sub.endpoint
                            );
                            console.log(
                                "p256dh key: " +
                                btoa(
                                    String.fromCharCode.apply(
                                        null,
                                        new Uint8Array(sub.getKey("p256dh"))
                                    )
                                )
                            );
                            console.log(
                                "auth key: " +
                                btoa(
                                    String.fromCharCode.apply(
                                        null,
                                        new Uint8Array(sub.getKey("auth"))
                                    )
                                )
                            );
                        })
                        .catch((e) => {
                            console.log("Error: ", e);
                        });
                });
            }
        });
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// REQUEST API UNTUK PERTAMA KALI
document.addEventListener("DOMContentLoaded", function () {
    var page = window.location.hash.substr(1);
});