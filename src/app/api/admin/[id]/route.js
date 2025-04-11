import { NextResponse } from "next/server";
import User from "../../../../../models/user.js";
import bcrypt from "bcryptjs";

export async function GET(request, { params }) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized - Bearer token diperlukan",
        },
        { status: 401 }
      );
    }

    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID admin harus disertakan" },
        { status: 400 }
      );
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Admin tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Berhasil mengambil data admin",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching admin:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data admin",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized - Bearer token diperlukan",
        },
        { status: 401 }
      );
    }

    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID admin harus disertakan" },
        { status: 400 }
      );
    }

    const user = await User.findByPk(id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Admin tidak ditemukan" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const updateData = {};
    if (body.full_name) updateData.full_name = body.full_name;
    if (body.email) {
      if (body.email !== user.email) {
        const existingUser = await User.findOne({
          where: { email: body.email },
        });

        if (existingUser) {
          return NextResponse.json(
            { success: false, message: "Email sudah digunakan" },
            { status: 400 }
          );
        }
      }
      updateData.email = body.email;
    }

    if (body.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(body.password, saltRounds);
    }

    await user.update(updateData);

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    return NextResponse.json({
      success: true,
      message: "Admin berhasil diperbarui",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui admin",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized - Bearer token diperlukan",
        },
        { status: 401 }
      );
    }

    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID admin harus disertakan" },
        { status: 400 }
      );
    }

    const user = await User.findByPk(id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Admin tidak ditemukan" },
        { status: 404 }
      );
    }

    await user.destroy();

    return NextResponse.json({
      success: true,
      message: "Admin berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus admin",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
