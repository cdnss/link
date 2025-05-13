
    $(document).ready(function() {
        // Data menu - tambahkan regularQuantity, qrisQuantity, dan basePiece
        let menuData = [
            // ... daftar item menu dengan id, name, regularPrice, qrisPrice, regularQuantity, qrisQuantity, basePiece ...
             { id: 1, name: "Sayap Original", regularPrice: "7K", qrisPrice: "7K", regularQuantity: 0, qrisQuantity: 0, basePiece: "Sayap" },
             // ... item lainnya ...
             { id: 17, name: "Promo Panas Dada", regularPrice: "13K", qrisPrice: "13K", regularQuantity: 0, qrisQuantity: 0, basePiece: "Dada Biasa" }
        ];

        const localStorageKeyQuantities = 'jepeMenuQuantitiesSeparate'; // Kunci Local Storage

        // Fungsi bantu: mengubah harga string ("7K") menjadi angka (7000)
        function priceToNumber(priceString) {
            // ... logika konversi ...
            if (typeof priceString !== 'string') { return 0; }
            const cleanPrice = priceString.toUpperCase().replace('RP', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
            if (cleanPrice.endsWith('K')) { return parseFloat(cleanPrice) * 1000; }
            return parseFloat(cleanPrice) || 0;
        }

        // Fungsi bantu: mengubah angka (7000) menjadi format Rupiah ("Rp 7.000")
        function numberToRupiah(number) {
             return "Rp " + number.toLocaleString('id-ID');
        }

        // Fungsi untuk memuat kuantitas dari Local Storage saat halaman dimuat
        function loadQuantities() {
            const storedData = localStorage.getItem(localStorageKeyQuantities);
            if (storedData) {
                const quantities = JSON.parse(storedData);
                menuData.forEach(menu => {
                    const storedItem = quantities.find(item => item.id === menu.id);
                    if(storedItem) {
                        menu.regularQuantity = storedItem.regularQuantity || 0;
                        menu.qrisQuantity = storedItem.qrisQuantity || 0;
                    }
                });
            }
        }

        // Fungsi untuk menyimpan kuantitas saat ada perubahan (ke Local Storage)
        function saveQuantities() {
             const quantitiesToSave = menuData.map(menu => ({
                 id: menu.id,
                 regularQuantity: menu.regularQuantity,
                 qrisQuantity: menu.qrisQuantity
             }));
             localStorage.setItem(localStorageKeyQuantities, JSON.stringify(quantitiesToSave));
        }

        // Fungsi untuk menghitung dan memperbarui tampilan Total Keseluruhan
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

        // Fungsi untuk menghitung total kuantitas per base piece (untuk laporan)
        function calculateBasePieceQuantities() {
            // ... logika perhitungan ...
            const baseQuantities = { /* ... inisialisasi objek ... */ };
            menuData.forEach(menu => {
                if (menu.basePiece && baseQuantities.hasOwnProperty(menu.basePiece)) {
                     baseQuantities[menu.basePiece] += menu.regularQuantity + menu.qrisQuantity;
                }
            });
            return baseQuantities;
        }

         // Fungsi untuk mendapatkan tanggal terformat dalam Bahasa Indonesia
         function getFormattedDateID(date) {
            // ... logika format tanggal ...
            const optionsDay = { weekday: 'long' };
             const optionsMonth = { month: 'long' };
             const day = date.getDate();
             const year = date.getFullYear();
             const dayName = date.toLocaleString('id-ID', optionsDay);
             const monthName = date.toLocaleString('id-ID', optionsMonth);

             return { hari: dayName, tanggal: day, bulan: monthName, tahun: year };
         }


        // Fungsi untuk membuat teks laporan berdasarkan data saat ini
        function generateReport() {
            const currentDate = new Date();
            const formattedDate = getFormattedDateID(currentDate);

            updateTotals(); // Pastikan total terbaru digunakan
            const omsetCash = $('#grandTotalRegular').text();
            const omsetQris = $('#grandTotalQris').text();
            const totalOmsetNumeric = priceToNumber(omsetCash) + priceToNumber(omsetQris); // Hitung dari angka
            const totalOmsetText = numberToRupiah(totalOmsetNumeric); // Format ke Rupiah


            const baseQuantities = calculateBasePieceQuantities(); // Hitung kuantitas per potong

            // ... buat teks laporan menggunakan template string ...
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
Paha Bawah: ${baseQuantities["Paha Bawah"]}
Paha Atas: ${baseQuantities["Paha Atas"]}
Sayap: ${baseQuantities["Sayap"]}
Dada Biasa: ${baseQuantities["Dada Biasa"]}
Dada Lembut: ${baseQuantities["Dada Lembut"]}
Ayam pok pok : ${baseQuantities["Ayam Pok pok"]}


*PENJUALAN*
Paha Bawah: ${baseQuantities["Paha Bawah"]}
Paha Atas: ${baseQuantities["Paha Atas"]}
Sayap: ${baseQuantities["Sayap"]}
Dada Biasa: ${baseQuantities["Dada Biasa"]}
Dada Lembut: ${baseQuantities["Dada Lembut"]}
Ayam Pok pok : ${baseQuantities["Ayam Pok pok"]}


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
Minyak :`;

            $('#reportArea').text(reportText); // Tampilkan laporan di area laporan
        }


        // Fungsi untuk merender (menampilkan) tombol-tombol menu di halaman
        function renderMenuButtons() {
            const $menuButtonsArea = $('#menuButtonsArea');
            $menuButtonsArea.empty(); // Kosongkan area sebelum mengisi ulang

            menuData.forEach(menu => {
                $menuButtonsArea.append(`
                    <button class="btn btn-outline-primary menu-item-button" data-id="${menu.id}">
                        ${menu.name} <br> (${menu.regularPrice})
                    </button>
                `);
            });
        }

        // Fungsi untuk merender (menampilkan) isi nota dalam bentuk tabel
        function renderNota() {
            const $notaArea = $('#notaArea');
            $notaArea.empty(); // Kosongkan area sebelum mengisi ulang

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
                $notaArea.html('<p id="notaPlaceholder">Belum ada pesanan.</p>'); // Tampilkan placeholder jika kosong
            }
        }


        // --- Initial Load ---
        // Kode di dalam $(document).ready() akan dijalankan setelah DOM (struktur HTML) selesai dimuat
        loadQuantities(); // Muat data pesanan yang tersimpan (jika ada)
        renderMenuButtons(); // Tampilkan tombol-tombol menu
        renderNota(); // Tampilkan nota berdasarkan data yang dimuat
        updateTotals(); // Perbarui tampilan total

        // --- Event Handlers ---
        // Menangani klik pada tombol menu (menggunakan event delegation)
        $('#menuButtonsArea').on('click', '.menu-item-button', function() {
            const itemId = parseInt($(this).data('id')); // Ambil ID item dari tombol
            const menu = menuData.find(m => m.id === itemId); // Cari data menu berdasarkan ID

            if (menu) {
                // Isi data ke dalam modal Bootstrap
                $('#modalItemName').text(menu.name);
                $('#modalAddItemRegularPrice').text(menu.regularPrice);
                $('#modalAddItemQrisPrice').text(menu.qrisPrice);
                $('#modalAddItemId').val(itemId);
                $('#itemQuantity').val(1); // Reset jumlah di modal
                $('#addMethodRegular').prop('checked', true); // Default ke Cash
                $('#addItemModal').modal('show'); // Tampilkan modal
            }
        });

        // Menangani klik tombol "Tambah Pesanan" di dalam modal
        $('#confirmAddItemButton').on('click', function() {
            const itemId = parseInt($('#modalAddItemId').val());
            const quantityToAdd = parseInt($('#itemQuantity').val());
            const selectedPaymentMethod = $('input[name="addPaymentMethod"]:checked').val(); // Ambil metode pembayaran yang dipilih

            const menu = menuData.find(m => m.id === itemId);

            if (menu && quantityToAdd > 0 && selectedPaymentMethod) {
                // Tambahkan kuantitas sesuai metode pembayaran
                if (selectedPaymentMethod === 'regular') {
                    menu.regularQuantity += quantityToAdd;
                } else if (selectedPaymentMethod === 'qris') {
                    menu.qrisQuantity += quantityToAdd;
                }

                saveQuantities(); // Simpan data pesanan
                renderNota(); // Perbarui tampilan nota
                updateTotals(); // Perbarui tampilan total
                $('#addItemModal').modal('hide'); // Tutup modal
            } else {
                alert('Jumlah harus lebih dari 0 dan metode pembayaran harus dipilih.');
            }
        });

        // Menangani klik tombol Kurangi Jumlah di Nota (menggunakan event delegation)
        $('#notaArea').on('click', '.decrease-qty-nota', function() {
             const $button = $(this);
             // Dapatkan ID item dari baris TR terdekat
             const $row = $button.closest('tr');
             const itemId = parseInt($row.data('id'));
             // Dapatkan metode dari data-method pada div quantity-control-nota terdekat
             const method = $button.closest('.quantity-control-nota').data('method'); // >>> Menggunakan .data() di sini <<<


             const menu = menuData.find(m => m.id === itemId);

             if (menu) {
                 const quantityKey = method + 'Quantity'; // 'regularQuantity' atau 'qrisQuantity'
                 if (menu[quantityKey] > 0) {
                      menu[quantityKey]--; // Kurangi kuantitas
                      saveQuantities();
                      renderNota();
                      updateTotals();
                 }
             }
        });

        // Menangani klik tombol Tambah Jumlah di Nota (menggunakan event delegation)
        $('#notaArea').on('click', '.increase-qty-nota', function() {
            const $button = $(this);
             // Dapatkan ID item dari baris TR terdekat
             const $row = $button.closest('tr');
             const itemId = parseInt($row.data('id'));
             // Dapatkan metode dari data-method pada div quantity-control-nota terdekat
             const method = $button.closest('.quantity-control-nota').data('method'); // >>> Menggunakan .data() di sini <<<


            const menu = menuData.find(m => m.id === itemId);

            if (menu) {
                 const quantityKey = method + 'Quantity'; // 'regularQuantity' atau 'qrisQuantity'
                 menu[quantityKey]++; // Tambah kuantitas
                 saveQuantities();
                 renderNota();
                 updateTotals();
            }
        });

        // Menangani klik tombol "Buat Laporan"
        $('#generateReportButton').on('click', function() {
            generateReport(); // Panggil fungsi pembuatan laporan
        });

    }); // Akhir dari $(document).ready()

