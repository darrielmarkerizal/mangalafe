import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import User from "../../../../../models/user.js";
import { testConnection } from "../../../../../config/database.js";
import { decryptData } from "@/lib/utils.js";

const JWT_SECRET = process.env.JWT_SECRET || "mangaladipa_jwt_secret_key";

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

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email dan password harus diisi",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Email atau password salah",
        },
        { status: 401 }
      );
    }

    const decryptedPassword = decryptData(user.password);
    if (decryptedPassword !== password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email atau password salah",
        },
        { status: 401 }
      );
    }

    const userData = user.toJSON();
    delete userData.password;

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Login berhasil",
        data: {
          user: userData,
          token,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error login:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat login",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
