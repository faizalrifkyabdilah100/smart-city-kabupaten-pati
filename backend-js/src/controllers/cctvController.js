/**
 * CCTV Controller
 * =================
 * Menyediakan daftar URL CCTV dari backend.
 * URL CCTV disimpan di .env, bukan di frontend.
 * 
 * Backend HANYA mengirim URL-nya saja,
 * browser yang langsung konek ke stream CCTV (iframe).
 */

const cctvController = {
    /**
     * GET DAFTAR CCTV
     * GET /api/cctv
     * 
     * Mengembalikan daftar CCTV beserta stream URL-nya.
     * URL di-generate dari CCTV_BASE_URL + CCTV_STREAM_ID di .env
     */
    getList: async (req, res) => {
        try {
            const baseUrl = process.env.CCTV_BASE_URL;
            const streamId = process.env.CCTV_STREAM_ID;

            if (!baseUrl || !streamId) {
                return res.status(500).json({
                    status: 500,
                    messages: { error: 'CCTV_BASE_URL atau CCTV_STREAM_ID belum dikonfigurasi di .env' },
                });
            }

            const streamUrl = `${baseUrl}/${streamId}.html`;

            // Daftar CCTV — nanti bisa dipindah ke database kalau sudah banyak
            const cctvList = [
                {
                    id: 1,
                    name: 'CCTV 1 — Jl. Diponegoro',
                    location: 'Perempatan Diponegoro, Pati',
                    streamUrl,
                },
                {
                    id: 2,
                    name: 'CCTV 2 — Bundaran Timor',
                    location: 'Bundaran Timor, Pati',
                    streamUrl,
                },
                {
                    id: 3,
                    name: 'CCTV 3 — Alun-Alun Pati',
                    location: 'Alun-Alun Pati',
                    streamUrl,
                },
                {
                    id: 4,
                    name: 'CCTV 4 — Jl. Sudirman',
                    location: 'Jl. Jenderal Sudirman, Pati',
                    streamUrl,
                },
                {
                    id: 5,
                    name: 'CCTV 5 — Terminal Bus',
                    location: 'Terminal Bus Pati',
                    streamUrl,
                },
                {
                    id: 6,
                    name: 'CCTV 6 — Pasar Pati',
                    location: 'Pasar Tradisional Pati',
                    streamUrl,
                },
                {
                    id: 7,
                    name: 'CCTV 7 — Jl. Ahmad Yani',
                    location: 'Jl. Ahmad Yani, Pati',
                    streamUrl,
                },
                {
                    id: 8,
                    name: 'CCTV 8 — RS Umum Pati',
                    location: 'Jl. Dr. Sutomo, Pati',
                    streamUrl,
                },
                {
                    id: 9,
                    name: 'CCTV 9 — Kantor Bupati',
                    location: 'Jl. Diponegoro No.1, Pati',
                    streamUrl,
                },
            ];

            // Juga kirim data CCTV utama (untuk halaman Kominfo)
            const mainCctv = {
                location: 'Jalan Diponegoro, Pati',
                status: 'Live',
                streamUrl,
            };

            return res.status(200).json({
                main: mainCctv,
                list: cctvList,
            });

        } catch (error) {
            console.error('CCTV error:', error);
            return res.status(500).json({
                status: 500,
                messages: { error: 'Gagal mengambil data CCTV' },
            });
        }
    },
};

module.exports = cctvController;
