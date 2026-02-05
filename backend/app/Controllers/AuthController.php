<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\UserModel;

class AuthController extends BaseController
{
    use ResponseTrait;

    public function login()
    {
        // CORS is handled globally via the Cors filter (app/Config/Cors.php)

        // 1. Ambil data JSON dari React
        $json = $this->request->getJSON();
        
        if (!$json) {
            return $this->fail('Tidak ada data yang dikirim.', 400);
        }

        $username = $json->username ?? '';
        $password = $json->password ?? '';

        // 2. Cari user di database
        $userModel = new UserModel();
        $user = $userModel->where('username', $username)->first();

        // 3. Cek User Ada?
        if (!$user) {
            return $this->failNotFound('Username tidak ditemukan.');
        }

        // 4. Cek Password
        if (!password_verify($password, $user['password'])) {
            return $this->fail('Password salah.', 401);
        }

        // 5. Sukses! Kembalikan data (Tanpa Password)
        $dataResponse = [
            'id'       => $user['id'],
            'username' => $user['username'],
            'nama'     => $user['nama'],
            'role'     => $user['role'],
            'opd'      => $user['opd'],
        ];

        return $this->respond([
            'status'  => 200,
            'message' => 'Login Berhasil',
            'data'    => $dataResponse
        ]);
    }

    // (test helper removed) Use database seed / migrations for test users instead
}
