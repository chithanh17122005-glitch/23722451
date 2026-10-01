import { apiClient } from './apiClient';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export const SHOE_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Dép Lê Quai Ngang Cao Cấp Unisex',
    price: 9.5,
    description: 'Dép lê quai ngang chất liệu cao su đúc nguyên khối êm chân, chống trượt tốt, thích hợp đi hàng ngày và đi trong ký túc xá.',
    category: 'Dép',
    image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'Giày Thể Thao Sneaker Nam Nữ Trắng Classic',
    price: 24.5,
    description: 'Giày Sneaker dáng cổ thấp basic, phối đồ cực dễ. Đế cao su lưu hóa chống mài mòn, lót giày thoáng khí không gây hôi chân.',
    category: 'Giày Thể Thao',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'Dép Sandal Nữ Đi Học Quai Hậu Học Sinh',
    price: 12.8,
    description: 'Dép Sandal phong cách Hàn Quốc quai dù bền đẹp, đế cao 3cm tôn dáng, ôm chân thoáng mát.',
    category: 'Dép Sandal',
    image: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    title: 'Giày Chạy Bộ Running Ultra Cushioned',
    price: 36.0,
    description: 'Giày chạy bộ chuyên nghiệp đế bọt biển đàn hồi cao, hỗ trợ giảm chấn tối đa cho sinh viên tập thể thao.',
    category: 'Giày Thể Thao',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    title: 'Dép Sục Nhựa EVA Siêu Nhẹ Kháng Khuẩn',
    price: 8.5,
    description: 'Dép sục nhiều lỗ thoáng khí, chống nước tuyệt đối, kèm sticker nhãn dán dễ thương năng động.',
    category: 'Dép',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 6,
    title: 'Giày Bốt Cổ Cao Da Lộn Unisex Vintage',
    price: 42.0,
    description: 'Giày Boots cổ cao chất liệu da PU cao cấp, kiểu dáng thời trang phong cách cá tính năng động.',
    category: 'Giày',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 7,
    title: 'Dép Kẹp Ngón Xốp Thái Lan Chống Trượt',
    price: 6.5,
    description: 'Dép tông kẹp ngón chất liệu cao su xốp mềm mại, siêu bền, nhẹ nhàng thoải mái đi biển và dạo phố.',
    category: 'Dép',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281352?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 8,
    title: 'Giày Lười Loafer Nam Da Bò Lịch Lãm',
    price: 38.5,
    description: 'Giày lười da bò thật sang trọng, đường chỉ khâu thủ công tỉ mỉ, thích hợp đi làm, dự tiệc, đi học.',
    category: 'Giày',
    image: 'https://images.unsplash.com/photo-1614252369475-531eda835eb1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 9,
    title: 'Dép Quai Dán Xé Outdoor Thể Thao Nam',
    price: 14.5,
    description: 'Dép sandal quai dán tiện lợi điều chỉnh độ rộng, đế cao su gai chống trượt đi mưa cực tốt.',
    category: 'Dép Sandal',
    image: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 10,
    title: 'Giày Thể Thao Cổ Thấp Canvas Retro',
    price: 18.0,
    description: 'Giày vải Canvas kiểu dáng Vintage classic, đế cao su đúc lưu hóa chắc chắn, bền bỉ theo thời gian.',
    category: 'Giày Thể Thao',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 11,
    title: 'Dép Đi Trong Nhà Bông Mềm Êm Chân',
    price: 7.2,
    description: 'Dép đi trong nhà và phòng ký túc xá, lót bông nỉ êm ái, đệm cao su giảm tiếng ồn khi di chuyển.',
    category: 'Dép',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 12,
    title: 'Giày Da Cao Gót Nữ Mũi Nhọn Công Sở',
    price: 29.0,
    description: 'Giày cao gót 5cm kiểu dáng thanh lịch, da PU mềm không gây đau gót, tôn lên vẻ nữ tính sang trọng.',
    category: 'Giày',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
  },
];

export const getProducts = async (): Promise<Product[]> => {
  return SHOE_PRODUCTS;
};