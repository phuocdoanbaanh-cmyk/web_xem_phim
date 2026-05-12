import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'nav.home': 'Home',
      'nav.mylist': 'My List',
      'nav.settings': 'Settings',
      'hero.watchlist': 'Watchlist',
      'hero.discover': 'Discover Movie',
      'movie.progress': 'Progress',
      'movie.status': 'Status',
      'movie.rating': 'Rating',
      'movie.year': 'Year',
      'settings.title': 'Personalization',
      'settings.theme': 'Interface Style',
      'settings.theme.classic': 'Classic Slider',
      'settings.theme.modern': 'Modern Grid',
      'settings.theme.minimal': 'Minimalist',
      'settings.color': 'Accent Color',
      'settings.font': 'Typography',
      'settings.language': 'Language',
      'settings.data': 'Data Management',
      'settings.export': 'Export JSON',
      'settings.import': 'Import JSON',
      'settings.reset': 'Reset Default',
      'status.watching': 'Watching',
      'status.completed': 'Completed',
      'status.on_hold': 'On Hold',
      'status.dropped': 'Dropped',
      'status.plan_to_watch': 'Plan to Watch',
    }
  },
  vi: {
    translation: {
      'nav.home': 'Trang chủ',
      'nav.mylist': 'Phim của tôi',
      'nav.settings': 'Cài đặt',
      'hero.watchlist': 'Danh sách xem',
      'hero.discover': 'Khám phá phim',
      'movie.progress': 'Tiến độ',
      'movie.status': 'Trạng thái',
      'movie.rating': 'Đánh giá',
      'movie.year': 'Năm',
      'settings.title': 'Cá nhân hóa',
      'settings.theme': 'Kiểu giao diện',
      'settings.theme.classic': 'Slider cổ điển',
      'settings.theme.modern': 'Lưới hiện đại',
      'settings.theme.minimal': 'Tối giản',
      'settings.color': 'Màu chủ đạo',
      'settings.font': 'Phông chữ',
      'settings.language': 'Ngôn ngữ',
      'settings.data': 'Quản lý dữ liệu',
      'settings.export': 'Xuất JSON',
      'settings.import': 'Nhập JSON',
      'settings.reset': 'Đặt lại mặc định',
      'status.watching': 'Đang xem',
      'status.completed': 'Đã hoàn thành',
      'status.on_hold': 'Tạm dừng',
      'status.dropped': 'Đã bỏ',
      'status.plan_to_watch': 'Dự định xem',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'vi', // Default to Vietnamese as requested
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
