$(document).ready(function() {
    // Data menu - Menggunakan daftar original (17 item)
    let menuData = [
        { id: 1, name: "Sayap Original", regularPrice: "7K", qrisPrice: "7K", regularQuantity: 0, qrisQuantity: 0, basePiece: "Sayap" },
        { id: 2, name: "Paket Ayam + Nasi Sayap", regularPrice: "9K", qrisPrice: "9K", regularQuantity: 0, qrisQuantity: 0, basePiece: "Sayap" },
        { id: 3, name: "Paket Nasi Ayam + Es Teh Sayap", regularPrice: "10K", qrisPrice: "10K", regularQuantity: 0, qrisQuantity: 0, basePiece: "Sayap" },
        { id: 4, name: "Paha Bawah Original", regularPrice: "9K", qrisPrice: "9K", regularQuantity: 0, qrisQuantity: 0, basePiece: "Paha Bawah" },
        { id: 5, name: "Paket Ayam + Nasi Paha Bawah", regularPrice: "11K", qrisPrice: "11K", regularQuantity: 0, qrisQuantity: 0, basePiece: "Paha Bawah" },
        { id: 6, name: "Paket Nasi Ayam + Es Teh Paha Bawah", regularPrice: "12K", qrisPrice: "12K", regularQuantity: 0, qrisQuantity: 0, basePiece: "Paha Bawah" },
        { id: 7, name: "Dada Lembut Original", regularPrice: "11K", qrisPrice: "11K", regularQuantity: 0, qrisQuantity: 0, basePiece: "Dada Lembut" },
        { id: 8, name: "Paket Ayam + Nasi Dada Lembut", regularPrice: "13K", qrisPrice: "13K", regularQuantity: 0, qrisQuantity: 0, basePiece: "Dada Lembut" },
        { id: 9, name: "Paket Nasi Ayam + Es Teh Dada Lembut", regularPrice: "14K", qrisPrice: "14K", regularQuantity: 0, qrisQuantity: 0, basePiece: "Dada Lembut" },
        { id: 10, name: "Dada Biasa Original", regularPrice: "12K", qrisPrice: "12K", regularQuantity: 0, qrisQuantity: 0, basePiece: "Dada Biasa" },
        { id: 11, name: "Paket Ayam + Nasi Dada Biasa", regularPrice: "14K", qrisPrice: "14K", regularQuantity: 0, qrisQuantity: 0, basePiece: "Dada Biasa" },
        { id: 12, name: "Paket Nasi Ayam + Es Teh Dada Biasa", regularPrice: "16K", qrisPrice: "16K", regularQuantity: 0, qrisQuantity: 0, basePiece: "Dada Biasa" },
        { id: 13, name: "Paha Atas Original", regularPrice: "12K", qrisPrice: "12K", regularQuantity: 0, qrisQuantity: 0, basePiece: "Paha Atas" },
        { id: 14, name: "Paket Ayam + Nasi Paha Atas", regularPrice: "14K", qrisPrice: "14K", regularQuantity: 0, qrisQuantity: 0, basePiece: "Paha Atas" },
        { id: 15, name: "Paket Nasi Ayam + Es Teh Paha Atas", regularPrice: "16K", qrisPrice: "16K", regularQuantity: 0, qrisQuantity: 0, basePiece: "Paha Atas" },
        { id: 16, name: "NASI", regularPrice: "3K", qrisPrice: "3K", regularQuantity: 0, qrisQuantity: 0, basePiece: "NASI" },
    ];

    const localStorageKeyQuantities = 'jepeMenuQuantitiesSeparate'; // Menggunakan kunci storage yang original kembali

    // Fungsi untuk mengubah harga string (misal "7K") menjadi angka (7000)
    function priceToNumber(priceString) {
        if (typeof priceString !== 'string') {
            return 0;
        }
        const cleanPrice = priceString.toUpperCase().replace('RP', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
        if (cleanPrice.endsWith('K')) {
            // Handle cases like "10.5K"
            if (cleanPrice.includes('.')) {
                 return parseFloat(cleanPrice) * 1000;
            }
            return parseInt(cleanPrice) * 1000;
        }
         // Handle prices without 'K', e.g., "1000" or "Rp 5.000"
         const numericValue = parseFloat(cleanPrice.replace(/\./g, '')); // Remove dots for thousand separators
         return isNaN(numericValue) ? 0 : numericValue;
    }

    // Fungsi untuk mengubah angka (misal 7000) menjadi format mata uang Rupiah (misal Rp 7.000)
    function numberToRupiah(number) {
        if (typeof number !== 'number' || isNaN(number)) {
            return "Rp 0";
        }
        return "Rp " + Math.floor(number).toLocaleString('id-ID');
    }

    // Fungsi untuk memuat kuantitas dari Local Storage
     function loadQuantities() {
         const storedData = localStorage.getItem(localStorageKeyQuantities);
         if (storedData) {
             const quantities = JSON.parse(storedData);
             // Gunakan map untuk membuat objek baru dan merge stored quantities
             menuData = menuData.map(menu => {
                 const storedItem = quantities.find(item => item.id === menu.id);
                 if(storedItem) {
                      // Ambil kuantitas tersimpan, default ke 0 jika tidak ada atau undefined
                     menu.regularQuantity = storedItem.regularQuantity || 0;
                     menu.qrisQuantity = storedItem.qrisQuantity || 0;
                 } else {
                     // Jika item tidak ada di storage (misal menu baru di storage tapi tidak di menuData sekarang), pastikan kuantitasnya 0
                     menu.regularQuantity = 0;
                     menu.qrisQuantity = 0;
                 }
                 return menu; // Kembalikan objek menu yang sudah di-update
             });
         } else {
              // Jika tidak ada data di Local Storage, inisialisasi semua kuantitas ke 0
              menuData.forEach(menu => {
                  menu.regularQuantity = 0;
                  menu.qrisQuantity = 0;
              });
         }
     }


    // Fungsi untuk menyimpan kuantitas ke Local Storage
    function saveQuantities() {
        const quantitiesToSave = menuData.map(menu => ({
            id: menu.id,
            regularQuantity: menu.regularQuantity,
            qrisQuantity: menu.qrisQuantity
        }));
        localStorage.setItem(localStorageKeyQuantities, JSON.stringify(quantitiesToSave));
    }

    // Fungsi untuk menghitung dan memperbarui Total Keseluruhan (Cash dan QRIS)
    function updateTotals() {
        let grandTotalRegular = 0;
        let grandTotalQris = 0;

        menuData.forEach(menu => {
            const unitPriceRegular = priceToNumber(menu.regularPrice);
            const unitPriceQris = priceToNumber(menu.qrisPrice);

            grandTotalRegular += unitPriceRegular * menu.regularQuantity;
            grandTotalQris += unitPriceQris * menu.qrisQuantity;
        });

        $('#grandTotalRegular').text(numberToRupiah(grandTotalRegular));
        $('#grandTotalQris').text(numberToRupiah(grandTotalQris));
    }

    // Fungsi untuk menghitung total kuantitas per base piece
    function calculateBasePieceQuantities() {
        const baseQuantities = {
            "Sayap": 0,
            "Paha Atas": 0,
            "Paha Bawah": 0,
            "Dada Lembut": 0,
            "Dada Biasa": 0
        };

        menuData.forEach(menu => {
            // Hanya tambahkan jika basePiece ada dan ada di daftar baseQuantities
            if (menu.basePiece && baseQuantities.hasOwnProperty(menu.basePiece)) {
                baseQuantities[menu.basePiece] += menu.regularQuantity + menu.qrisQuantity;
            }
        });

        return baseQuantities;
    }

    // Fungsi untuk mendapatkan nama hari, tanggal, bulan, tahun dalam bahasa Indonesia
     function getFormattedDateID(date) {
         const optionsDay = { weekday: 'long' };
         const optionsMonth = { month: 'long' };
         const day = date.getDate();
         const year = date.getFullYear();

         const dayName = date.toLocaleString('id-ID', optionsDay);
         const monthName = date.toLocaleString('id-ID', optionsMonth);

         return {
             hari: dayName,
             tanggal: day,
             bulan: monthName,
             tahun: year
         };
     }

    // Fungsi untuk membuat teks laporan
    function generateReport() {
        const currentDate = new Date(); // Tanggal dan waktu saat ini
        const formattedDate = getFormattedDateID(currentDate);

        // Pastikan total sudah terupdate
        updateTotals();

        const omsetCash = $('#grandTotalRegular').text();
        const omsetQris = $('#grandTotalQris').text();
         // Hitung total keseluruhan dari angka (bukan teks)
        const totalOmsetNumeric = priceToNumber(omsetCash) + priceToNumber(omsetQris);
        const totalOmsetText = numberToRupiah(totalOmsetNumeric);


        const baseQuantities = calculateBasePieceQuantities();

         // Buat daftar item yang terjual dengan jumlah Cash dan QRIS
        let itemListReport = '';
        menuData.forEach(menu => {
            if (menu.regularQuantity > 0 || menu.qrisQuantity > 0) {
                 itemListReport += `${menu.name} (Cash: ${menu.regularQuantity}, QRIS: ${menu.qrisQuantity})\n`;
            }
        });
         if(itemListReport === '') {
             itemListReport = 'Belum ada item terjual.\n';
         }


        const reportText = `JEPE FRIED CHICKEN
( kronggahan )

Hari : ${formattedDate.hari}
Tanggal : ${formattedDate.tanggal}
Bulan : ${formattedDate.bulan}
Tahun	: ${formattedDate.tahun}

*OMSET*
Cash ${omsetCash}
Qris ${omsetQris}
____________
Total : ${totalOmsetText}

*BARANG DATANG*
sayap :
Paha atas :
Paha bawah :
Dada lembut :
Dada biasa :
Ayam pok pok :


*BAHAN MASAK*
Paha Bawah: ${baseQuantities["Paha Bawah"] || 0}
Paha Atas: ${baseQuantities["Paha Atas"] || 0}
Sayap: ${baseQuantities["Sayap"] || 0}
Dada Biasa: ${baseQuantities["Dada Biasa"] || 0}
Dada Lembut: ${baseQuantities["Dada Lembut"] || 0}
Ayam pok pok : 0


*PENJUALAN*
Paha Bawah: ${baseQuantities["Paha Bawah"] || 0}
Paha Atas: ${baseQuantities["Paha Atas"] || 0}
Sayap: ${baseQuantities["Sayap"] || 0}
Dada Biasa: ${baseQuantities["Dada Biasa"] || 0}
Dada Lembut: ${baseQuantities["Dada Lembut"] || 0}
Ayam Pok pok : 0


*SISA GORENG*
Sayap :
Paha atas :
Paha bawah :
Dada lembut :
Dada biasa :
Ayam pok pok :


*STOK AKHIR*
Sayap :
Paha Atas :
Paha Bawah :
Dada Lembut :
Dada Biasa :
Ayam Pok pok :
Beras :
Tepung :
Minyak :`; // Mengatur kuantitas Ayam Pok Pok di laporan ke 0 secara default sesuai menu original

        $('#reportArea').text(reportText); // Tampilkan laporan di area laporan
    }

    // Fungsi untuk merender tombol-tombol menu
    function renderMenuButtons() {
        const $menuButtonsArea = $('#menuButtonsArea');
        $menuButtonsArea.empty();

        menuData.forEach(menu => {
            $menuButtonsArea.append(`
                 <button class="btn btn-outline-primary menu-item-button" data-id="${menu.id}">
                     ${menu.name} <br> (${menu.regularPrice}${menu.regularPrice !== menu.qrisPrice ? ' / ' + menu.qrisPrice : ''})
                 </button>
            `);
        });
    }

    // Fungsi untuk merender area nota dalam bentuk tabel
    function renderNota() {
        const $notaArea = $('#notaArea');
        $notaArea.empty();

        let hasItems = false;
        let tableRowsHtml = '';

        menuData.forEach(menu => {
            if (menu.regularQuantity > 0 || menu.qrisQuantity > 0) {
                hasItems = true;
                const subtotalRegular = priceToNumber(menu.regularPrice) * menu.regularQuantity;
                const subtotalQris = priceToNumber(menu.qrisPrice) * menu.qrisQuantity;

                tableRowsHtml += `
                     <tr data-id="${menu.id}">
                         <td>${menu.name}</td>
                         <td>
                             <div class="quantity-control-nota" data-method="regular">
                                 <button class="btn btn-outline-secondary btn-sm decrease-qty-nota">-</button>
                                 <span class="quantity-display-nota">${menu.regularQuantity}</span>
                                 <button class="btn btn-outline-secondary btn-sm increase-qty-nota">+</button>
                             </div>
                         </td>
                         <td>
                              <div class="quantity-control-nota" data-method="qris">
                                  <button class="btn btn-outline-secondary btn-sm decrease-qty-nota">-</button>
                                  <span class="quantity-display-nota">${menu.qrisQuantity}</span>
                                  <button class="btn btn-outline-secondary btn-sm increase-qty-nota">+</button>
                              </div>
                         </td>
                         <td>${numberToRupiah(subtotalRegular)}</td>
                         <td>${numberToRupiah(subtotalQris)}</td>
                     </tr>
                `;
            }
        });

        if (hasItems) {
            $notaArea.append(`
                 <table class="table table-bordered nota-table">
                     <thead>
                         <tr>
                             <th>Item</th>
                             <th>Qty (Cash)</th>
                             <th>Qty (QRIS)</th>
                             <th>Subtotal (Cash)</th>
                             <th>Subtotal (QRIS)</th>
                         </tr>
                     </thead>
                     <tbody>
                         ${tableRowsHtml}
                     </tbody>
                 </table>
            `);
        } else {
            $notaArea.html('<p id="notaPlaceholder">Belum ada pesanan.</p>');
        }
    }


    // Muat kuantitas dari Local Storage saat halaman dimuat
    loadQuantities();

    // Render tombol menu saat halaman dimuat
    renderMenuButtons();

    // Render nota saat halaman dimuat
    renderNota();

    // Hitung dan tampilkan total saat pertama kali render
    updateTotals();

    // Event handler untuk klik tombol menu item (Trigger Modal Tambah Item)
    $('#menuButtonsArea').on('click', '.menu-item-button', function() {
        const itemId = parseInt($(this).data('id'));
        const menu = menuData.find(m => m.id === itemId);

        if (menu) {
            $('#modalItemName').text(menu.name);
            $('#modalAddItemRegularPrice').text(menu.regularPrice);
            $('#modalAddItemQrisPrice').text(menu.qrisPrice);
            $('#modalAddItemId').val(itemId);
            $('#itemQuantity').val(1); // Reset jumlah ke 1
            $('#addMethodRegular').prop('checked', true); // Default ke Reguler
            $('#addItemModal').modal('show');
        }
    });

    // Event handler untuk tombol "Tambah Pesanan" di Modal Tambah Item
    $('#confirmAddItemButton').on('click', function() {
        const itemId = parseInt($('#modalAddItemId').val());
        const quantityToAdd = parseInt($('#itemQuantity').val());
        const selectedPaymentMethod = $('input[name="addPaymentMethod"]:checked').val();

        const menu = menuData.find(m => m.id === itemId);

        if (menu && quantityToAdd > 0 && selectedPaymentMethod) {
            if (selectedPaymentMethod === 'regular') {
                menu.regularQuantity += quantityToAdd;
            } else if (selectedPaymentMethod === 'qris') {
                menu.qrisQuantity += quantityToAdd;
            }

            saveQuantities(); // Simpan kuantitas setelah berubah
            renderNota(); // Render ulang nota
            updateTotals(); // Perbarui total

            $('#addItemModal').modal('hide'); // Tutup modal
        } else {
            alert('Jumlah harus lebih dari 0 dan metode pembayaran harus dipilih.');
        }
    });

    // Event handler untuk tombol Kurangi Jumlah di Nota (menggunakan event delegation pada notaArea)
    $('#notaArea').on('click', '.decrease-qty-nota', function() {
         const $button = $(this);
         const $row = $button.closest('tr');
         const itemId = parseInt($row.data('id'));
         const method = $button.closest('.quantity-control-nota').data('method');

         const menu = menuData.find(m => m.id === itemId);

         if (menu) {
             const quantityKey = method + 'Quantity';
             if (menu[quantityKey] > 0) {
                  menu[quantityKey]--;
                  saveQuantities();
                  renderNota();
                  updateTotals();
             }
         }
    });

    // Event handler untuk tombol Tambah Jumlah di Nota (menggunakan event delegation pada notaArea)
    $('#notaArea').on('click', '.increase-qty-nota', function() {
        const $button = $(this);
        const $row = $button.closest('tr');
        const itemId = parseInt($row.data('id'));
        const method = $button.closest('.quantity-control-nota').data('method');

        const menu = menuData.find(m => m.id === itemId);

        if (menu) {
             const quantityKey = method + 'Quantity';
             menu[quantityKey]++;
             saveQuantities();
             renderNota();
             updateTotals();
        }
    });

    // Event handler untuk tombol "Buat Laporan"
    $('#generateReportButton').on('click', function() {
        generateReport();
    });

}); // Akhir dari $(document).ready()
