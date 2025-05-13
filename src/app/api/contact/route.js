import { NextResponse } from "next/server";
import Service from "../../../../models/service.js";
import User from "../../../../models/user.js";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactSchema = z.object({
  firstName: z.string().min(1, "Nama depan wajib diisi"),
  lastName: z.string().min(1, "Nama belakang wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  whatsapp: z
    .string()
    .min(10, "Nomor WhatsApp minimal 10 digit")
    .regex(/^[0-9+]+$/, "Nomor WhatsApp hanya boleh berisi angka dan +"),
  serviceId: z.number().positive("ID layanan tidak valid"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
});

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export async function POST(request) {
  try {
    const body = await request.json();

    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak valid",
          errors: result.error.format(),
        },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, whatsapp, serviceId, message } =
      result.data;

    const service = await Service.findByPk(serviceId);
    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Layanan tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Get all admin users
    const adminUsers = await User.findAll({
      attributes: ["email", "full_name"],
    });

    if (!adminUsers || adminUsers.length === 0) {
      console.warn(
        "No admin users found in the database. Using fallback email."
      );
      adminUsers.push({
        email: process.env.EMAIL_TO || "info@mangaladipalokatara.com",
        full_name: "Administrator",
      });
    }

    const transporter = createTransporter();

    // Send personalized email to each admin
    const emailPromises = adminUsers.map((admin) => {
      // Personalize greeting with admin's name
      const personalizedEmailBody = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Kontak Baru - PT Mangala Dipa Lokatara</title>
          <style>
            body {
              font-family: 'Geist Sans', Arial, sans-serif;
              line-height: 1.6;
              color: #02382c;
              margin: 0;
              padding: 0;
              background-color: #f8f5e6;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #02382c;
              color: #fffbec;
              padding: 25px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background-color: #fffbec;
              padding: 30px;
              border-left: 1px solid #e6e2d6;
              border-right: 1px solid #e6e2d6;
            }
            .message-box {
              background-color: #f9f7ec;
              border: 1px solid #e6e2d6;
              border-left: 4px solid #56f09f;
              border-radius: 5px;
              padding: 20px;
              margin-top: 25px;
            }
            .footer {
              background-color: #f0edd9;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #02382c;
              border-radius: 0 0 10px 10px;
              border: 1px solid #e6e2d6;
              border-top: none;
            }
            h2 {
              color: #02382c;
              margin-top: 0;
            }
            .info-row {
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 1px solid #f0edd9;
            }
            .info-label {
              font-weight: bold;
              width: 100px;
              display: inline-block;
              color: #02382c;
            }
            .logo {
              max-height: 70px;
              margin-bottom: 15px;
            }
            .divider {
              border-top: 1px solid #e6e2d6;
              margin: 25px 0;
            }
            .action-buttons {
              margin-top: 30px;
              text-align: center;
            }
            .btn {
              display: inline-block;
              padding: 12px 24px;
              margin: 0 10px 10px 0;
              background-color: #02382c;
              color: #fffbec !important;
              text-decoration: none;
              border-radius: 10px;
              font-weight: bold;
            }
            .btn-whatsapp {
              background-color: #56f09f;
              color: #02382c !important;
            }
            h1, h2, h3 {
              font-weight: 600;
            }
            .contact-info {
              margin-top: 25px;
              padding: 15px;
              background-color: #f9f7ec;
              border-radius: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>PT Mangala Dipa Lokatara</h1>
              <p>Formulir Kontak Baru</p>
            </div>
            
            <div class="content">
              <h2>Halo ${admin.full_name || "Administrator"},</h2>
              <p>Berikut adalah detail pesan kontak baru dari website:</p>
              
              <div class="info-row"><span class="info-label">Nama:</span> ${firstName} ${lastName}</div>
              <div class="info-row"><span class="info-label">Email:</span> <a href="mailto:${email}" style="color:#02382c;">${email}</a></div>
              <div class="info-row"><span class="info-label">WhatsApp:</span> <a href="https://wa.me/${whatsapp.startsWith("+") ? whatsapp.substring(1) : whatsapp}" style="color:#02382c;">${whatsapp}</a></div>
              <div class="info-row"><span class="info-label">Layanan:</span> ${service.name}</div>
              
              <div class="message-box">
                <h3>Pesan:</h3>
                <p>${message.replace(/\n/g, "<br>")}</p>
              </div>
              
              <div class="action-buttons">
                <a href="mailto:${email}?subject=Re: Kontak Baru - ${service.name} - ${firstName} ${lastName}" class="btn">Balas via Email</a>
                <a href="https://wa.me/${whatsapp.startsWith("+") ? whatsapp.substring(1) : whatsapp}" class="btn btn-whatsapp">Hubungi via WhatsApp</a>
              </div>
              
              <div class="divider"></div>
              
              <div class="contact-info">
                <p><strong>Informasi Pengirim:</strong></p>
                <p>Pelanggan ini mengirimkan pesan terkait layanan <strong>${service.name}</strong>. Mohon untuk ditindaklanjuti sesegera mungkin sesuai dengan SLA perusahaan.</p>
              </div>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} PT Mangala Dipa Lokatara. Semua hak dilindungi.</p>
              <p>Pesan ini dikirim dari formulir kontak website resmi PT Mangala Dipa Lokatara.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const personalizedTextBody = `
        PT MANGALA DIPA LOKATARA - FORMULIR KONTAK BARU
        
        Halo ${admin.full_name || "Administrator"},
        Berikut adalah detail pesan kontak baru dari website:
        
        Nama: ${firstName} ${lastName}
        Email: ${email}
        WhatsApp: ${whatsapp}
        Layanan: ${service.name}
        
        PESAN:
        ${message}
        
        Untuk membalas email: mailto:${email}
        Untuk menghubungi via WhatsApp: https://wa.me/${whatsapp.startsWith("+") ? whatsapp.substring(1) : whatsapp}
        
        © ${new Date().getFullYear()} PT Mangala Dipa Lokatara. Semua hak dilindungi.
        Pesan ini dikirim dari formulir kontak website resmi PT Mangala Dipa Lokatara.
      `;

      const mailOptions = {
        from: '"PT Mangala Dipa Lokatara" <noreply@mangaladipalokatara.com>',
        to: admin.email,
        replyTo: email,
        subject: `Kontak Baru: ${service.name} - ${firstName} ${lastName}`,
        text: personalizedTextBody,
        html: personalizedEmailBody,
      };

      return transporter.sendMail(mailOptions);
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    return NextResponse.json(
      {
        success: true,
        message: "Pesan berhasil dikirim",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending contact form:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengirim pesan",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
