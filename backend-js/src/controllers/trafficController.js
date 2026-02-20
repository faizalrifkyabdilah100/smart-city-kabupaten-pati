/**
 * Traffic Controller
 * ===================
 * Backend jadi perantara (proxy) untuk fetch data trafik internet
 * dari API eksternal. Supaya IP & API Key tidak terexpose di frontend.
 */

const trafficController = {
    /**
     * GET DATA TRAFIK
     * GET /api/traffic
     * 
     * Backend fetch ke API eksternal, lalu kirim hasilnya ke frontend.
     * Frontend tidak perlu tahu IP server aslinya.
     */
    getTraffic: async (req, res) => {
        try {
            const apiUrl = process.env.TRAFFIC_API_URL;
            const apiKey = process.env.TRAFFIC_API_KEY;

            if (!apiUrl) {
                return res.status(500).json({
                    status: 500,
                    messages: { error: 'TRAFFIC_API_URL belum dikonfigurasi di .env' },
                });
            }

            // Siapkan headers
            const headers = {
                'Content-Type': 'application/json',
            };

            if (apiKey) {
                headers['Authorization'] = `Bearer ${apiKey}`;
            }

            // Fetch ke API eksternal
            const response = await fetch(apiUrl, { headers });

            if (!response.ok) {
                throw new Error(`API eksternal error: ${response.status}`);
            }

            const data = await response.json();

            // Kirim data ke frontend
            return res.status(200).json(data);

        } catch (error) {
            console.error('Traffic API error:', error.message);
            return res.status(502).json({
                status: 502,
                messages: { error: 'Gagal mengambil data trafik dari API eksternal' },
            });
        }
    },
};

module.exports = trafficController;
