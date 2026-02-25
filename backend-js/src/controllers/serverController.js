/**
 * Server Monitoring Controller
 * ==============================
 * Backend jadi perantara (proxy) untuk fetch data monitoring server
 * (CPU, Memory, Storage) dari API eksternal.
 * 
 * Response format dari API eksternal:
 * [
 *   {
 *     "label": "Server A",
 *     "resources": {
 *       "cpu":     { "capacityMHz": ..., "usedMHz": ... },
 *       "memory":  { "capacityGB": ..., "usedGB": ... },
 *       "storage": { "capacityGB": ..., "freeGB": ..., "usedGB": ... }
 *     }
 *   },
 *   {
 *     "label": "Server G",
 *     "error": "Timed out while waiting for handshake"
 *   }
 * ]
 */

const serverController = {
    /**
     * GET DATA SERVER MONITORING
     * GET /api/servers
     */
    getServers: async (req, res) => {
        try {
            const apiUrl = process.env.SERVER_API_URL;
            const apiKey = process.env.SERVER_API_KEY;

            if (!apiUrl) {
                return res.status(500).json({
                    status: 500,
                    messages: { error: 'SERVER_API_URL belum dikonfigurasi di .env' },
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

            // Kirim data ke frontend apa adanya
            return res.status(200).json(data);

        } catch (error) {
            console.error('Server Monitoring API error:', error.message);
            return res.status(502).json({
                status: 502,
                messages: { error: 'Gagal mengambil data monitoring server' },
            });
        }
    },

    /**
     * GET DATA SERVER MONITORING 2 (Sumber kedua)
     * GET /api/servers2
     */
    getServers2: async (req, res) => {
        try {
            const apiUrl = process.env.SERVER_API_URL_2;
            const apiKey = process.env.SERVER_API_KEY_2;

            if (!apiUrl) {
                return res.status(500).json({
                    status: 500,
                    messages: { error: 'SERVER_API_URL_2 belum dikonfigurasi di .env' },
                });
            }

            const headers = {
                'Content-Type': 'application/json',
            };

            if (apiKey) {
                headers['Authorization'] = `Bearer ${apiKey}`;
            }

            const response = await fetch(apiUrl, { headers });

            if (!response.ok) {
                throw new Error(`API eksternal 2 error: ${response.status}`);
            }

            const data = await response.json();
            return res.status(200).json(data);

        } catch (error) {
            console.error('Server Monitoring API 2 error:', error.message);
            return res.status(502).json({
                status: 502,
                messages: { error: 'Gagal mengambil data monitoring server 2' },
            });
        }
    },
    /**
     * GET DATA VM SERVER MONITORING
     * GET /api/servers/vm
     */
    getVmServers: async (req, res) => {
        try {
            const apiUrl = process.env.VM_API_URL;

            if (!apiUrl) {
                return res.status(500).json({
                    status: 500,
                    messages: { error: 'VM_API_URL belum dikonfigurasi di .env' },
                });
            }

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`API VM error: ${response.status}`);
            }

            const data = await response.json();
            return res.status(200).json(data);

        } catch (error) {
            console.error('VM Monitoring API error:', error.message);
            return res.status(502).json({
                status: 502,
                messages: { error: 'Gagal mengambil data monitoring VM' },
            });
        }
    },
};

module.exports = serverController;
