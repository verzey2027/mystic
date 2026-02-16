import type { Metadata } from "next";
import Link from "next/link";
import { 
  Sparkles, 
  Calendar, 
  Ghost, 
  Hash, 
  Star, 
  Heart, 
  CircleDot, 
  Compass, 
  FileText,
  Search
} from "lucide-react";

export const metadata: Metadata = {
  title: "สำรวจ — MysticFlow",
  description: "ค้นพบศาสตร์การดูดวงทั้งหมด ทาโรต์ เลขศาสตร์ ไพ่จิตวิญญาณ และอื่นๆ",
};

const categories = [
  {
    title: "ทาโรต์",
    description: "เปิดไพ่ทาโรต์ 1, 3, หรือ 10 ใบ",
    href: "/tarot",
    icon: Sparkles,
    gradient: "from-violet-100 to-white",
  },
  {
    title: "ไพ่รายวัน",
    description: "ไพ่ประจำวันของคุณ",
    href: "/daily-card",
    icon: Calendar,
    gradient: "from-rose-50 to-white",
  },
  {
    title: "เส้นทางจิตวิญญาณ",
    description: "ไพ่ประจำราศี + ไพ่จิตวิญญาณ",
    href: "/spirit-path",
    icon: Ghost,
    gradient: "from-teal-50 to-white",
  },
  {
    title: "เลขศาสตร์",
    description: "วิเคราะห์เบอร์โทรศัพท์",
    href: "/numerology",
    icon: Hash,
    gradient: "from-indigo-50 to-white",
  },
  {
    title: "ดวงชะตา",
    description: "ดูดวงรายวัน รายสัปดาห์ รายเดือน",
    href: "/horoscope",
    icon: Star,
    gradient: "from-purple-50 to-white",
  },
  {
    title: "ความเข้ากัน",
    description: "ดูดวงความรักและความสัมพันธ์",
    href: "/compatibility",
    icon: Heart,
    gradient: "from-pink-50 to-white",
  },
  {
    title: "ปีจีน",
    description: "ดวงตามปีเกิดจีน",
    href: "/chinese-zodiac",
    icon: CircleDot,
    gradient: "from-red-50 to-white",
  },
  {
    title: "เฉพาะทาง",
    description: "การงาน การเงิน หรือความรัก",
    href: "/specialized",
    icon: Compass,
    gradient: "from-amber-50 to-white",
  },
  {
    title: "เลขศาสตร์ชื่อ",
    description: "วิเคราะห์ชื่อภาษาไทย",
    href: "/name-numerology",
    icon: FileText,
    gradient: "from-cyan-50 to-white",
  },
];

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-white pb-24">
      <!-- Header -->
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            <span className="font-serif text-lg font-semibold text-violet-600">MysticFlow</span>
          </Link>
        </div>
        
        <{/* Search Bar */}>
        <div className="px-5 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาศาสตร์การดูดวง..."
              className="w-full h-12 pl-12 pr-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </div>
        </div>
      </header>

      <{/* Categories Grid */}>
      <section className="px-5 py-6">
        <h1 className="font-serif text-2xl font-semibold text-gray-900 mb-2">สำรวจศาสตร์</h1>
        <p className="text-gray-500 text-sm mb-6">เลือกศาสตร์ที่คุณสนใจเพื่อเริ่มดูดวง</p>
        
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className="group p-4 bg-white border border-gray-200 rounded-2xl transition-all hover:border-violet-300 hover:shadow-[0_8px_32px_rgba(124,58,237,0.12)] hover:-translate-y-0.5"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-violet-600 mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{cat.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{cat.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <{/* Popular Section */}>
      <section className="px-5 pb-6">
        <h2 className="font-serif text-xl font-semibold text-gray-900 mb-4">ยอดนิยม</h2>
        
        <div className="space-y-3">
          <Link href="/tarot" className="flex items-center gap-4 p-4 bg-violet-50 rounded-2xl border border-violet-100">
            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">ไพ่ทาโรต์ 3 ใบ</h3>
              <p className="text-sm text-gray-500">อดีต ปัจจุบัน อนาคต</p>
            </div>
            <span className="text-violet-600">→</span>
          </Link>

          <Link href="/daily-card" className="flex items-center gap-4 p-4 bg-rose-50 rounded-2xl border border-rose-100">
            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">ไพ่ประจำวัน</h3>
              <p className="text-sm text-gray-500">พลังงานวันนี้ของคุณ</p>
            </div>
            <span className="text-rose-600">→</span>
          </Link>

          <Link href="/numerology" className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Hash className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">วิเคราะห์เบอร์มงคล</h3>
              <p className="text-sm text-gray-500">เลขศาสตร์เบอร์โทร</p>
            </div>
            <span className="text-indigo-600">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
