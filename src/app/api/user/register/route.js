import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../../../models/user.js";
import { testConnection } from "../../../../../config/database.js";

export async function POST(request) {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        {
          success: false,
          message: "Koneksi database gagal",
        },
        { status: 500 }
      );
    }

    const { full_name, email, password } = await request.json();

    if (!full_name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Semua field harus diisi",
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email sudah terdaftar",
        },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      full_name,
      email,
      password: hashedPassword,
    });

    const userData = newUser.toJSON();
    delete userData.password;

    return NextResponse.json(
      {
        success: true,
        message: "Registrasi berhasil",
        data: userData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registrasi:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat registrasi",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
