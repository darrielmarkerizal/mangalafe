import { NextResponse } from "next/server";
import Service from "../../../../models/service.js";
import { Op } from "sequelize";
import initializeAssociations from "../../../../models/associations.js";

initializeAssociations();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "ASC";

    const allowedSortFields = ["id", "name", "createdAt"];
    const allowedSortOrders = ["ASC", "DESC"];

    if (!allowedSortFields.includes(sortBy)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Parameter sortBy tidak valid. Gunakan 'id', 'name', atau 'createdAt'",
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

    const queryOptions = {
      order: [[sortBy, sortOrder]],
      attributes: ["id", "name", "createdAt", "updatedAt"],
    };

    if (search) {
      queryOptions.where = {
        name: {
          [Op.like]: `%${search}%`,
        },
      };
    }

    const services = await Service.findAll(queryOptions);

    if (!services || services.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "Tidak ada data layanan",
          data: [],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengambil data layanan",
        data: services,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal mengambil data layanan:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data layanan",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
