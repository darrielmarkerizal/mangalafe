import { ProjectDashboard } from "@/components/cms/dashboard/project-dashboard";
import {
  FileTextIcon,
  MapIcon,
  ClipboardCheckIcon,
  ActivityIcon,
  BarChartIcon,
  HomeIcon,
  CarIcon,
  SearchIcon,
} from "lucide-react";

export const metadata = {
  title: "Dashboard Admin | PT Mangala Dipa Lokatara",
  description:
    "Panel administrasi untuk manajemen proyek konsultasi lingkungan",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-[family-name:var(--font-montserrat)]">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 font-[family-name:var(--font-plus-jakarta-sans)]">
          Kelola semua proyek konsultasi lingkungan dari satu tempat.
        </p>
      </div>

      {/* Stats cards - Grid responsif dengan fix untuk kartu terakhir */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Total Proyek</h3>
            <FileTextIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-xl sm:text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground">
            Semua proyek dalam database
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">PKKPR</h3>
            <MapIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold">6</div>
          <p className="text-xs text-muted-foreground">
            Persetujuan Kesesuaian
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">AMDAL</h3>
            <ActivityIcon className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold">4</div>
          <p className="text-xs text-muted-foreground">
            Analisis Dampak Lingkungan
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">UKL-UPL</h3>
            <ClipboardCheckIcon className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold">5</div>
          <p className="text-xs text-muted-foreground">Upaya Pengelolaan</p>
        </div>

        <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Pemantauan</h3>
            <BarChartIcon className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">Laporan Pemantauan</p>
        </div>

        <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">PERTEK</h3>
            <FileTextIcon className="h-5 w-5 text-red-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold">1</div>
          <p className="text-xs text-muted-foreground">Persetujuan Teknis</p>
        </div>

        <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">LARAP</h3>
            <HomeIcon className="h-5 w-5 text-orange-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold">2</div>
          <p className="text-xs text-muted-foreground">Land Acquisition</p>
        </div>

        <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Transportasi</h3>
            <CarIcon className="h-5 w-5 text-teal-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold">2</div>
          <p className="text-xs text-muted-foreground">Studi Transportasi</p>
        </div>

        {/* Kartu Survey dengan class col-span-1 untuk memaksa lebar 1 kolom di mobile */}
        <div className="col-span-1 rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Survey</h3>
            <SearchIcon className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold">1</div>
          <p className="text-xs text-muted-foreground">
            Jasa Survey Lingkungan
          </p>
        </div>

        {/* Tambahkan kartu kosong untuk menyeimbangkan grid */}
        <div className="col-span-1 md:hidden"></div>
      </div>

      {/* Project Dashboard component */}
      <ProjectDashboard />
    </div>
  );
}
