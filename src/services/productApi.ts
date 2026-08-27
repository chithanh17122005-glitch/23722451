import { PRICE_MULTIPLIER } from '@constants/student';

export interface Product {
    id: number | string;
    title: string;
    price: number;
    category: 'food' | 'drink' | 'study';
    categoryLabel: string;
    image: string;
    description: string;
}


function mapCategory(apiCategory: string): { category: 'food' | 'drink' | 'study'; categoryLabel: string } {
    const cat = (apiCategory || '').toLowerCase();
    if (cat.includes('clothing')) {
        return { category: 'study', categoryLabel: 'Học tập' };
    } else if (cat.includes('jewel')) {
        return { category: 'drink', categoryLabel: 'Nước' };
    } else {
        return { category: 'food', categoryLabel: 'Đồ ăn' };
    }
}

export const fetchProducts = async (): Promise<Product[]> => {
    const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout: Kết nối quá chậm.')), 15000)
    );

    const fetchPromise = fetch('https://fakestoreapi.com/products?limit=8')
        .then(async (response) => {
            if (!response.ok) {
                throw new Error(`Lỗi tải dữ liệu: ${response.status}`);
            }
            const rawData = await response.json();
            const products: Product[] = rawData.map((item: any) => {
                const { category, categoryLabel } = mapCategory(item.category);
                return {
                    id: item.id,
                    title: item.title,
                    price: Math.round(Number(item.price || 0) * PRICE_MULTIPLIER),
                    category,
                    categoryLabel,
                    image: item.image,
                    description: item.description || 'Mô tả ngắn, tối đa 2 dòng...',
                };
            });
            return products;
        });

    return Promise.race([fetchPromise, timeoutPromise]);
};