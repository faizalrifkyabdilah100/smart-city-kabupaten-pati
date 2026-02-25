/**
 * Menara Controller
 * ===================
 * Backend jadi perantara (proxy) untuk fetch data menara telekomunikasi
 * dari API eksternal.
 */

const menaraController = {
    /**
     * GET DATA MENARA
     * GET /api/menara
     */
    getMenara: async (req, res) => {
        try {
            const apiUrl = process.env.MENARA_API_URL;

            // Jika masih xxx, kirim data dummy berdasarkan format yang diberikan user
            if (!apiUrl || apiUrl.includes('xxx.xxx.xx.xxx')) {
                return res.status(200).json({
                    status: 200,
                    data: [
                        {
                            "id": "1",
                            "id_menara": "E3300327",
                            "nama_menara": "KETITANG WETAN / JUWANA (DUMMY)",
                            "alamat": "RT 05 RW 02",
                            "desa": "KETITANG WETAN",
                            "kecamatan": "BATANGAN",
                            "lat": -6.7188323,
                            "longitude": 111.1940969,
                            "tipe_site": "GREEN FIELD",
                            "tinggi_menara": 72,
                            "struktur": "4 KAKI",
                            "tahun_pembuatan": "2009"
                        },
                        {
                            "id": "2",
                            "id_menara": "21",
                            "nama_menara": "JEMBANGAN / BUMIMULYO (DUMMY)",
                            "alamat": "RT06 RW 01 ",
                            "desa": "JEMBANGAN",
                            "kecamatan": "BATANGAN",
                            "lat": -6.7111536,
                            "longitude": 111.2131744,
                            "tipe_site": "GREEN FIELD",
                            "tinggi_menara": 62,
                            "struktur": "4 KAKI",
                            "tahun_pembuatan": "2016"
                        }
                    ],
                    message: 'Menggunakan data dummy karena API URL belum dikonfigurasi di .env'
                });
            }

            // Fetch ke API eksternal
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`API eksternal error: ${response.status}`);
            }

            const data = await response.json();

            // Kirim data ke frontend
            return res.status(200).json(data);

        } catch (error) {
            console.error('Menara API error:', error.message);
            return res.status(502).json({
                status: 502,
                messages: { error: 'Gagal mengambil data menara dari API eksternal' },
            });
        }
    },
};

module.exports = menaraController;
