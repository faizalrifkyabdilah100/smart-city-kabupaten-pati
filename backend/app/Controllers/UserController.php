<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\UserModel;

class UserController extends ResourceController
{
    use ResponseTrait;

    // 1. LIHAT SEMUA USER (GET /api/users)
    public function index()
    {
        $model = new UserModel();
        // Ambil semua data, urutkan dari yang terbaru
        $data = $model->orderBy('id', 'DESC')->findAll();
        
        // Hapus password hash dari response biar aman
        foreach ($data as $key => $value) {
            unset($data[$key]['password']);
        }

        return $this->respond($data);
    }

    // 2. TAMBAH USER BARU (POST /api/users)
    public function create()
    {
        $model = new UserModel();
        $json = $this->request->getJSON();

        if (!$json) {
            return $this->fail('Data JSON tidak ditemukan', 400);
        }

        $data = [
            'username' => $json->username,
            'nama'     => $json->nama,
            'opd'      => $json->opd,
            'role'     => $json->role ?? 'admin', // Default role admin
            // Hash Password
            'password' => password_hash($json->password, PASSWORD_BCRYPT),
        ];

        // Validasi Simpel (Cek username kembar otomatis ditangani DB constraint)
        try {
            $model->insert($data);
            $response = [
                'status'   => 201,
                'error'    => null,
                'messages' => [
                    'success' => 'User berhasil ditambahkan'
                ]
            ];
            return $this->respondCreated($response);
        } catch (\Exception $e) {
            // Biasanya error kalau username sudah ada
            return $this->fail('Gagal menambah user. Username mungkin sudah dipakai.', 400);
        }
    }

    // 3. UPDATE USER (PUT /api/users/{id})
    public function update($id = null)
    {
        $model = new UserModel();
        $json = $this->request->getJSON();

        if (!$json) {
            return $this->fail('Data JSON tidak ditemukan', 400);
        }

        // Cek dulu user-nya ada gak?
        $existingUser = $model->find($id);
        if (!$existingUser) {
            return $this->failNotFound('User tidak ditemukan');
        }

        $data = [
            'username' => $json->username,
            'nama'     => $json->nama,
            'opd'      => $json->opd,
            'role'     => $json->role,
        ];

        // LOGIKA PASSWORD:
        // Kalau password dikirim kosong, berarti TIDAK diganti.
        // Kalau diisi, baru kita hash ulang.
        if (!empty($json->password)) {
            $data['password'] = password_hash($json->password, PASSWORD_BCRYPT);
        }

        try {
            $model->update($id, $data);
            return $this->respond([
                'status' => 200, 
                'message' => 'Data user berhasil diupdate'
            ]);
        } catch (\Exception $e) {
            return $this->fail('Gagal update data.', 400);
        }
    }

    // 4. HAPUS USER (DELETE /api/users/{id})
    public function delete($id = null)
    {
        $model = new UserModel();
        $data = $model->find($id);

        if ($data) {
            $model->delete($id);
            return $this->respondDeleted([
                'status' => 200,
                'message' => 'User berhasil dihapus'
            ]);
        } else {
            return $this->failNotFound('User tidak ditemukan');
        }
    }
}