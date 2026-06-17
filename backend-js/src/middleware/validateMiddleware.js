const { z } = require('zod');

// ─── Schemas ────────────────────────────────────────────────────────────────

const loginSchema = z.object({
    username: z.string().min(1, 'Username wajib diisi').max(50),
    password: z.string().min(1, 'Password wajib diisi').max(200),
});

const USERNAME_RULE = z
    .string()
    .min(3, 'Username minimal 3 karakter')
    .max(30, 'Username maksimal 30 karakter')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh huruf, angka, dan underscore');

const ROLE_RULE = z.enum(['admin', 'super_admin'], {
    error: () => ({ message: "Role harus 'admin' atau 'super_admin'" }),
});

const createUserSchema = z.object({
    username: USERNAME_RULE,
    nama:     z.string().min(1, 'Nama wajib diisi').max(100),
    opd:      z.string().max(100).optional().nullable(),
    role:     ROLE_RULE,
    password: z.string().min(6, 'Password minimal 6 karakter').max(200),
});

const updateUserSchema = z.object({
    username: USERNAME_RULE,
    nama:     z.string().min(1, 'Nama wajib diisi').max(100),
    opd:      z.string().max(100).optional().nullable(),
    role:     ROLE_RULE,
    // Password opsional saat update — kosong berarti tidak diganti
    password: z.string().min(6, 'Password minimal 6 karakter').max(200).or(z.literal('')).optional(),
});

// ─── Middleware Factory ──────────────────────────────────────────────────────

function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            // Zod v4 memakai .issues (bukan .errors)
            const issues = result.error.issues ?? [];
            const firstMsg = issues[0]?.message ?? 'Input tidak valid';
            return res.status(400).json({
                status: 400,
                messages: { error: firstMsg },
            });
        }
        req.body = result.data;
        next();
    };
}

module.exports = { validate, loginSchema, createUserSchema, updateUserSchema };
