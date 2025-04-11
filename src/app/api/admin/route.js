import { NextResponse } from "next/server";
import User from "../../../../models/user.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

export async function GET(request) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "DESC";
    const page = parseInt(searchParams.get("page")) || 1;
    const perPage = parseInt(searchParams.get("perPage")) || 10;

    // Validate sort parameters
    const allowedSortFields = ["full_name", "email", "createdAt", "updatedAt"];
    const allowedSortOrders = ["ASC", "DESC"];

    if (!allowedSortFields.includes(sortBy)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Parameter sortBy tidak valid. Gunakan 'full_name', 'email', 'createdAt', atau 'updatedAt'",
        },
        { status: 400 }
      );
    }

    if (!allowedSortOrders.includes(sortOrder.toUpperCase())) {
      return NextResponse.json(
        {
          success: false,
          message: "Parameter sortOrder tidak valid. Gunakan 'ASC' atau 'DESC'",
        },
        { status: 400 }
      );
    }

    if (id) {
      // Get specific user by ID
      const user = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: user });
    } else {
      // Build where condition for search
      let whereCondition = {};

      if (search) {
        whereCondition = {
          [Op.or]: [
            { full_name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        };
      }

      // Get total count for pagination
      const { count: totalItems } = await User.findAndCountAll({
        where: whereCondition,
        distinct: true,
      });

      // Get paginated users
      const users = await User.findAll({
        where: whereCondition,
        attributes: { exclude: ["password"] },
        order: [[sortBy, sortOrder]],
        limit: perPage,
        offset: (page - 1) * perPage,
      });

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalItems / perPage);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      if (!users || users.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Data admin tidak ditemukan",
            data: [],
            metadata: {
              currentPage: page,
              perPage,
              totalItems: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPrevPage: false,
            },
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Berhasil mengambil data admin",
        data: users,
        metadata: {
          currentPage: page,
          perPage,
          totalItems,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      });
    }
  } catch (error) {
    console.error("Error in GET users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve user data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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

    const body = await request.json();

    if (!body.full_name || !body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          message: "Data berikut harus diisi: full_name, email, password",
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ where: { email: body.email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email sudah digunakan" },
        { status: 400 }
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    const newUser = await User.create({
      full_name: body.full_name,
      email: body.email,
      password: hashedPassword,
    });

    const response = { ...newUser.get() };
    delete response.password;

    return NextResponse.json(
      { success: true, message: "Admin berhasil dibuat", data: response },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST user:", error);
    return NextResponse.json(
      { success: false, message: "Gagal membuat admin", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID admin harus disertakan sebagai query parameter",
        },
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
    console.error("Error in PUT user:", error);
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

export async function DELETE(request) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

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
    console.error("Error in DELETE user:", error);
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
