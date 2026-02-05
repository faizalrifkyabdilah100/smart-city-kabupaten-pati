<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'username'   => 'superadmin',
                'nama'       => 'Super Administrator',
                // Passwordnya: 123456 (tapi di-hash biar aman)
                'password'   => password_hash('123456', PASSWORD_BCRYPT),
                'opd'        => 'Diskominfo',
                'role'       => 'super_admin',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'username'   => 'admin_lh',
                'nama'       => 'Admin Lingkungan',
                'password'   => password_hash('123456', PASSWORD_BCRYPT),
                'opd'        => 'Dinas Lingkungan Hidup',
                'role'       => 'admin',
                'created_at' => date('Y-m-d H:i:s'),
            ]
        ];

        $this->db->table('users')->insertBatch($data);
    }
}