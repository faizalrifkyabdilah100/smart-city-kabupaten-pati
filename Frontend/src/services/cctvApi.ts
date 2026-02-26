// =========================================
// CCTV API SERVICE
// =========================================
// Fungsi untuk mengambil daftar CCTV dari backend.
// URL CCTV stream tersimpan di backend (.env), bukan di frontend.



export interface CctvItem {
    id: number;
    name: string;
    location: string;
    streamUrl: string;
}

export interface CctvMain {
    location: string;
    status: string;
    streamUrl: string;
}

export interface CctvResponse {
    main: CctvMain;
    list: CctvItem[];
}

/**
 * Ambil daftar CCTV dari backend
 * URL CCTV stream sudah dipindah ke frontend secara langsung.
 */
export async function fetchCctvData(): Promise<CctvResponse | null> {
    try {
        const cctvUrls: Record<number, string> = {
            1: 'http://103.110.43.72:8080/5286aec5-e07e-49aa-89fe-fdad49c8e1ca.html?autoplay=true&mute=true', // Link CCTV 1 (Jl. Diponegoro)
            2: 'http://103.110.43.72:8080/4fd477ce-4f96-4766-be8d-9b2321165633.html?autoplay=true&mute=true', // Link CCTV 2 (Bundaran Timor)
            3: 'http://103.110.43.72:8080/6bd6a6f1-8609-44eb-a30b-54c4e1f29357.html?autoplay=true&mute=true', // Link CCTV 3 (Alun-Alun)
            4: 'http://103.110.43.72:8080/7fd9bcf9-26ed-44bf-803f-878d1025f1c3.html?autoplay=true&mute=true', // Link CCTV 4 (Jl. Sudirman)
            5: 'http://103.110.43.72:8080/470da99b-d80a-489e-adc0-1c0f1d86837a.html?autoplay=true&mute=true', // Link CCTV 5 (Terminal Bus)
            6: 'http://103.110.43.72:8080/c85909da-cdcb-44ff-9987-1463da88f9b2.html?autoplay=true&mute=true', // Link CCTV 6 (Pasar Pati)
            7: 'http://103.110.43.72:8080/dd2e2b25-ca72-4cb3-953c-6e3dd8ce2d1d.html?autoplay=true&mute=true', // Link CCTV 7 (Jl. Ahmad Yani)
            8: 'http://103.110.43.72:8080/47b3777c-5581-4557-b82c-b13e71ec4d0a.html?autoplay=true&mute=true', // Link CCTV 8 (RS Umum Pati)
            9: 'http://103.110.43.72:8080/32bc3695-3a64-41c7-a13b-59c5045f1d09.html?autoplay=true&mute=true', // Link CCTV 9 (Kantor Bupati)
        };

        const cctvList: CctvItem[] = [
            { id: 1, name: 'CCTV 1 — Front Office', location: 'Pelayanan Lantai 1', streamUrl: cctvUrls[1] },
            { id: 2, name: 'CCTV 2 — Lobby Tangga', location: 'Area Lobby & Tangga Utama', streamUrl: cctvUrls[2] },
            { id: 3, name: 'CCTV 3 — Lorong Lantai 2', location: 'Akses Ruang Kerja Lt 2', streamUrl: cctvUrls[3] },
            { id: 4, name: 'CCTV 4 — Ruang Server/Studio', location: 'Area Teknis & Studio', streamUrl: cctvUrls[4] },
            { id: 5, name: 'CCTV 5 — Area Parkir', location: 'Halaman Parkir Belakang', streamUrl: cctvUrls[5] },
            { id: 6, name: 'CCTV 6 — Pintu Belakang', location: 'Akses Keluar Belakang', streamUrl: cctvUrls[6] },
            { id: 7, name: 'CCTV 7 — Lobi Depan', location: 'Lobi Depan', streamUrl: cctvUrls[7] },
            { id: 8, name: 'CCTV 8 — Ruang Meeting', location: 'Ruang Meeting', streamUrl: cctvUrls[8] },
            { id: 9, name: 'CCTV 9 — Pintu Masuk Lantai 2', location: 'Pintu Masuk Lantai 2', streamUrl: cctvUrls[9] },
        ];

        const mainCctv: CctvMain = {
            location: 'Jalan Diponegoro, Pati',
            status: 'Live',
            streamUrl: cctvUrls[1],
        };

        return {
            main: mainCctv,
            list: cctvList,
        };
    } catch (error) {
        console.error('Gagal mengambil data CCTV:', error);
        return null;
    }
}
