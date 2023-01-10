const rdb = firebase.database();

const form = document.getElementById('form');


form.addEventListener('submit', (event) => {
    // Mencegah pengiriman data default ke Firebase
    event.preventDefault();
    // Tangkap data yang dimasukkan ke form
    var nama = document.getElementById("nama").value;
    var ucapan = document.getElementById("ucapan").value;
    var kehadiran = document.querySelector("select").value;
    var tanggalWaktu = new Date();

    // Kirim data ke Firebase   
    firebase.database().ref("ucapan").push({
        nama: nama,
        ucapan: ucapan,
        kehadiran: kehadiran,
        tanggalWaktu: tanggalWaktu.toString(),

    }).then(function () {
        // Tampilkan pesan sukses
        var successMessage = document.createElement("p");
        successMessage.innerHTML = "Terima Kasih, Ucapan Anda Sudah Terkirim!";
        successMessage.classList.add("success");
        form.appendChild(successMessage);

        // Hapus pesan sukses setelah 3 detik
        setTimeout(function () {
            successMessage.remove();
        }, 3000);
    }).catch(function (error) {
        // Tampilkan pesan error
        var errorMessage = document.createElement("p");
        errorMessage.innerHTML = "Maaf, terjadi kesalahan saat mengirim ucapan Anda. Silakan coba lagi nanti.";
        errorMessage.classList.add("error");
        form.appendChild(errorMessage);

        // Hapus pesan error setelah 3 detik
        setTimeout(function () {
            errorMessage.remove();
        }, 3000);
    });
    // Kosongkan form setelah data terkirim
    form.reset();
});

// Dapatkan referensi ke database Firebase
var sayingRef = firebase.database().ref("ucapan");

// Dapatkan ucapan terbaru saat halaman dimuat
sayingRef.on("value", function (snapshot) {
    // Hapus konten yang ada sebelumnya
    var sayingContainer = document.getElementById("ucapan-container");
    sayingContainer.innerHTML = "";

    // Dapatkan elemen HTML untuk menampilkan jumlah komentar ucapan
    var commentCountEl = document.getElementById("comment-count");

    // Dapatkan ucapan terbaru saat halaman dimuat
    sayingRef.on("value", function (snapshot) {
        // Tampilkan jumlah komentar ucapan yang ada di database
        commentCountEl.innerHTML = snapshot.numChildren() + " Ucapan" + " <i class='fa fa-comments' aria-hidden= 'true'></i>";
    });

    // Tambahkan event listener untuk mendeteksi adanya data komentar baru
    sayingRef.on("child_added", function (childSnapshot) {
        // Tampilkan jumlah komentar ucapan yang ada di database setiap ada data komentar baru
        commentCountEl.innerHTML = snapshot.numChildren() + " Ucapan" + " <i class='fa fa-comments' aria-hidden= 'true'></i>";
    });

    // Tampilkan setiap ucapan
    snapshot.forEach(function (childSnapshot) {
        var say = childSnapshot.val();
        displaySay(
            say.nama,
            say.ucapan,
            say.kehadiran,
            say.tanggalWaktu
        );
    });
});

// Fungsi untuk menampilkan ucapan
function displaySay(nama, ucapan, kehadiran, tanggalWaktu) {
    // Buat elemen div untuk menampilkan ucapan
    var sayEl = document.createElement("div");

    // Hitung waktu yang lalu
    const input = tanggalWaktu;
    const date = Date.parse(input);
    const now = Date.now();
    const diff = now - date;

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let timeAgo;
    if (years > 0) {
        timeAgo = years + ' tahun';
        if (months > 0) {
            timeAgo += ' ' + months + ' bulan';
        }
        timeAgo += ' yang lalu';
    } else if (months > 0) {
        timeAgo = months + ' bulan';
        if (weeks > 0) {
            timeAgo += ' ' + weeks + ' minggu';
        }
        timeAgo += ' yang lalu';
    } else if (weeks > 0) {
        timeAgo = weeks + ' minggu';
        if (days > 0) {
            timeAgo += ' ' + days + ' hari';
        }
        timeAgo += ' yang lalu';
    } else if (days > 0) {
        timeAgo = days + ' hari';
        if (hours > 0) {
            timeAgo += ' ' + hours + ' jam';
        }
        timeAgo += ' yang lalu';
    } else if (hours > 0) {
        timeAgo = hours + ' jam';
        if (minutes > 0) {
            timeAgo += ' ' + minutes + ' menit';
        }
        timeAgo += ' yang lalu';
    } else if (minutes > 0) {
        timeAgo = minutes + ' menit yang lalu';
    } else {
        timeAgo = 'baru saja';
    }

    // Tambahkan waktu yang lalu ke elemen div
    sayEl.innerHTML =
        "<h3>" +
        nama +
        "<img src='foto/icon.png' alt='Verified icon'></h3><span>" +
        kehadiran +
        "</span><p>" +
        ucapan +
        "</p><small>🕓 " +
        timeAgo +
        "</small>";

    // Tambahkan elemen div ke container ucapan sebagai elemen pertama
    var sayingContainer = document.getElementById("ucapan-container");
    sayingContainer.insertBefore(sayEl, sayingContainer.firstChild);
}
