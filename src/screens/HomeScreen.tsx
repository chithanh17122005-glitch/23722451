import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useState,
} from 'react';

import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Switch,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
    BANNER_IMAGE_ID,
    FLASH_SECONDS,
    PRICE_MULTIPLIER,
    STUDENT,
    VARIANT,
    examStamp,
} from '../constants/student';

import { COLORS, SIZES } from '../constants/theme';

import { useTheme } from '../contexts/ThemeContext';

import { useCountdown } from '../hooks/useCountdown';

import Typography from '../components/ui/Typography';
import ShopInput from '../components/ui/ShopInput';
import ShopButton from '../components/ui/ShopButton';

import {
    CategoryId,
    Product,
    fetchProducts,
} from '../services/productApi';


/* =========================
   QUANTITY REDUCER
========================= */

type QuantityAction =
    | { type: 'ADD' }
    | { type: 'REMOVE' }
    | { type: 'RESET' };

function quantityReducer(
    state: number,
    action: QuantityAction,
): number {
    switch (action.type) {
        case 'ADD':
            return state + 1;

        case 'REMOVE':
            return state > 1 ? state - 1 : 1;

        case 'RESET':
            return 1;

        default:
            return state;
    }
}


/* =========================
   CATEGORY
========================= */

const CATEGORY_OPTIONS: {
    id: CategoryId;
    label: string;
}[] = [
        {
            id: 'all',
            label: 'Tất cả',
        },
        {
            id: 'food',
            label: 'Đồ ăn',
        },
        {
            id: 'drink',
            label: 'Nước',
        },
        {
            id: 'study',
            label: 'Học tập',
        },
    ];


/* =========================
   PRODUCT CARD
========================= */

interface ProductCardProps {
    item: Product;
    onPress: (product: Product) => void;
}

const ProductCard = memo(
    ({ item, onPress }: ProductCardProps) => {
        const { colors } = useTheme();

        const price = `${item.price.toLocaleString('vi-VN')} đ`;

        return (
            <Pressable
                style={[
                    styles.productCard,
                    {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                    },
                ]}
                onPress={() => onPress(item)}
            >
                <Image
                    source={{ uri: item.image }}
                    style={styles.productImage}
                    resizeMode="contain"
                />

                <View style={styles.productInfo}>
                    <Typography
                        variant="bodyLarge"
                        color={colors.text}
                        numberOfLines={2}
                    >
                        {item.title}
                    </Typography>

                    <Typography
                        variant="body"
                        color={COLORS.primary}
                        style={styles.price}
                    >
                        {price}
                    </Typography>

                    <View style={styles.categoryLabel}>
                        <Typography
                            variant="caption"
                            color={COLORS.textLight}
                        >
                            {item.categoryLabel}
                        </Typography>
                    </View>
                </View>

                <ShopButton
                    title="Đặt"
                    onPress={() => onPress(item)}
                    style={styles.orderButton}
                />
            </Pressable>
        );
    },
);


/* =========================
   HOME SCREEN
========================= */

const HomeScreen = () => {
    const [searchText, setSearchText] = useState('');

    const [selectedCategory, setSelectedCategory] =
        useState<CategoryId>('all');

    const [products, setProducts] = useState<Product[]>([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const [selectedProduct, setSelectedProduct] =
        useState<Product | null>(null);

    const [modalVisible, setModalVisible] =
        useState(false);

    const [quantity, dispatchQuantity] =
        useReducer(quantityReducer, 1);

    const { colors, mode, toggleTheme } = useTheme();

    const {
        formatted,
        isExpired: isFinished,
    } = useCountdown(FLASH_SECONDS);


    /* =========================
       CHIP ORDER
       MSSV cuối = 1
       → đảo thứ tự
    ========================= */

    const categories = VARIANT.chipsReversed
        ? [...CATEGORY_OPTIONS].reverse()
        : CATEGORY_OPTIONS;


    /* =========================
       FETCH PRODUCTS
    ========================= */

    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const data = await fetchProducts();

            setProducts(data);
        } catch (err) {
            setError('Không tải được dữ liệu món.');
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        let alive = true;

        const loadData = async () => {
            setLoading(true);
            setError('');

            try {
                const data = await fetchProducts();

                if (alive) {
                    setProducts(data);
                }
            } catch (err) {
                if (alive) {
                    setError('Không tải được dữ liệu món.');
                }
            } finally {
                if (alive) {
                    setLoading(false);
                }
            }
        };

        loadData();

        return () => {
            alive = false;
        };
    }, []);


    /* =========================
       FILTER PRODUCTS
    ========================= */

    const filteredProducts = useMemo(() => {
        const keyword = searchText.toLowerCase().trim();

        return products.filter(product => {
            const matchName =
                product.title.toLowerCase().includes(keyword);

            const productCategory = product.category;

            const matchCategory =
                selectedCategory === 'all' ||
                productCategory === selectedCategory;

            return matchName && matchCategory;
        });
    }, [
        products,
        searchText,
        selectedCategory,
    ]);


    /* =========================
       OPEN MODAL
    ========================= */

    const handleOpenModal = useCallback(
        (product: Product) => {
            dispatchQuantity({ type: 'RESET' });

            setSelectedProduct(product);
            setModalVisible(true);
        },
        [],
    );


    /* =========================
       CLOSE MODAL
    ========================= */

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedProduct(null);

        dispatchQuantity({ type: 'RESET' });
    };


    /* =========================
       CONFIRM ORDER
    ========================= */

    const handleConfirmOrder = () => {
        if (!selectedProduct || isFinished) {
            return;
        }

        Alert.alert(
            `CampusMart · ${STUDENT.mssv}`,
            `${STUDENT.hoTen} (#${examStamp()}) đã ghi nhận: ${selectedProduct.title} × ${quantity}. Nhận tại quầy KTX.`,
            [
                {
                    text: 'OK',
                    onPress: () => {
                        setModalVisible(false);
                        setSelectedProduct(null);

                        dispatchQuantity({
                            type: 'RESET',
                        });
                    },
                },
            ],
        );
    };


    /* =========================
       WATERMARK
    ========================= */

    const watermark = (
        <Typography
            variant="caption"
            color={colors.textLight}
            style={styles.watermark}
        >
            TH1 · {STUDENT.mssv} · {STUDENT.hoTen} · #{examStamp()}
        </Typography>
    );


    /* =========================
       LOADING SCREEN
    ========================= */

    if (loading) {
        return (
            <SafeAreaView
                style={[
                    styles.loadingContainer,
                    {
                        backgroundColor: colors.background,
                    },
                ]}
            >
                <ActivityIndicator
                    size="large"
                    color={COLORS.primary}
                />

                <Typography
                    variant="bodyLarge"
                    color={colors.text}
                    style={styles.loadingText}
                >
                    Đang tải món…
                </Typography>
            </SafeAreaView>
        );
    }


    /* =========================
       ERROR SCREEN
    ========================= */

    if (error) {
        return (
            <SafeAreaView
                style={[
                    styles.loadingContainer,
                    {
                        backgroundColor: colors.background,
                    },
                ]}
            >
                <Typography
                    variant="bodyLarge"
                    color={COLORS.error}
                    style={styles.errorText}
                >
                    {STUDENT.mssv} — Không tải được dữ liệu món.
                </Typography>

                <ShopButton
                    title="Thử lại"
                    onPress={loadProducts}
                />
            </SafeAreaView>
        );
    }


    /* =========================
       MAIN UI
    ========================= */

    return (
        <SafeAreaView
            style={[
                styles.safeArea,
                {
                    backgroundColor: colors.background,
                },
            ]}
        >
            {/* Watermark trên nếu MSSV chẵn */}
            {VARIANT.watermarkAtTop && watermark}


            {/* =========================
          HEADER
      ========================= */}

            <View style={styles.header}>
                <View>
                    <Typography
                        variant="heading"
                        color={COLORS.primary}
                    >
                        CAMPUSMART
                    </Typography>

                    <Typography
                        variant="body"
                        color={colors.textLight}
                    >
                        Cửa hàng tiện lợi KTX
                    </Typography>
                </View>


                {VARIANT.themeControl === 'switch' ? (
                    <Switch
                        value={mode === 'dark'}
                        onValueChange={toggleTheme}
                        trackColor={{ false: COLORS.border, true: COLORS.primary }}
                        thumbColor={COLORS.surface}
                    />
                ) : (
                    <Pressable
                        style={[
                            styles.themeButton,
                            {
                                borderColor: COLORS.primary,
                            },
                        ]}
                        onPress={toggleTheme}
                    >
                        <Typography
                            variant="body"
                            color={COLORS.primary}
                        >
                            {mode === 'light'
                                ? 'Tối'
                                : 'Sáng'}
                        </Typography>
                    </Pressable>
                )}
            </View>


            {/* =========================
          FLASH
      ========================= */}

            <View style={styles.flashRow}>
                <Typography
                    variant="bodyLarge"
                    color={COLORS.secondary}
                >
                    Flash
                </Typography>

                <Typography
                    variant="bodyLarge"
                    color={colors.text}
                >
                    {formatted}
                </Typography>
            </View>


            {/* =========================
          SEARCH INPUT
      ========================= */}

            <ShopInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder={`Tìm món - ${STUDENT.mssv}`}
            />


            {/* =========================
          BANNER
      ========================= */}

            <Image
                source={{
                    uri: `https://picsum.photos/id/${BANNER_IMAGE_ID}/800/320`,
                }}
                style={styles.banner}
                resizeMode="cover"
                onError={() => {
                    console.log('Không tải được banner');
                }}
            />


            {/* =========================
          CHIP
      ========================= */}

            <View style={styles.chipContainer}>
                {categories.map(category => {
                    const active =
                        selectedCategory === category.id;

                    return (
                        <Pressable
                            key={category.id}
                            style={[
                                styles.chip,
                                {
                                    backgroundColor: active
                                        ? COLORS.primary
                                        : colors.surface,

                                    borderColor: COLORS.primary,
                                },
                            ]}
                            onPress={() =>
                                setSelectedCategory(category.id)
                            }
                        >
                            <Typography
                                variant="caption"
                                color={
                                    active
                                        ? '#FFFFFF'
                                        : colors.text
                                }
                            >
                                {category.label}
                            </Typography>
                        </Pressable>
                    );
                })}
            </View>


            {/* =========================
          PRODUCT LIST
      ========================= */}

            <FlatList
                data={filteredProducts}
                keyExtractor={item =>
                    `${STUDENT.mssv}-${item.id}`
                }
                renderItem={({ item }) => (
                    <ProductCard
                        item={item}
                        onPress={handleOpenModal}
                    />
                )}
                contentContainerStyle={
                    styles.listContent
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Typography
                            variant="bodyLarge"
                            color={colors.textLight}
                        >
                            Không có món phù hợp
                        </Typography>
                    </View>
                }
            />


            {/* Watermark dưới vì MSSV của bạn là số lẻ */}
            {!VARIANT.watermarkAtTop && watermark}


            {/* =========================
          MODAL
      ========================= */}

            <Modal
                visible={modalVisible}
                transparent
                animationType={VARIANT.modalAnimation}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalOverlay}>
                    <View
                        style={[
                            styles.modalContent,
                            {
                                backgroundColor: colors.surface,
                            },
                        ]}
                    >
                        <Typography
                            variant="caption"
                            color={colors.textLight}
                            style={styles.modalWatermark}
                        >
                            TH1 · {STUDENT.mssv} · {STUDENT.hoTen} · #{examStamp()}
                        </Typography>


                        {selectedProduct && (
                            <>
                                <Image
                                    source={{
                                        uri: selectedProduct.image,
                                    }}
                                    style={styles.modalImage}
                                    resizeMode="contain"
                                />


                                <Typography
                                    variant="title"
                                    color={colors.text}
                                    numberOfLines={2}
                                    style={styles.modalTitle}
                                >
                                    {selectedProduct.title}
                                </Typography>


                                <Typography
                                    variant="bodyLarge"
                                    color={COLORS.primary}
                                    style={styles.modalPrice}
                                >
                                    {selectedProduct.price.toLocaleString('vi-VN')} đ
                                </Typography>


                                <Typography
                                    variant="body"
                                    color={colors.textLight}
                                >
                                    Loại: {selectedProduct.categoryLabel}
                                </Typography>


                                <Typography
                                    variant="body"
                                    color={colors.textLight}
                                    numberOfLines={2}
                                    style={styles.description}
                                >
                                    {selectedProduct.description}
                                </Typography>


                                {/* QUANTITY */}
                                <View style={styles.quantityRow}>
                                    <Pressable
                                        style={[
                                            styles.quantityButton,
                                            {
                                                borderColor: COLORS.primary,
                                            },
                                        ]}
                                        onPress={() =>
                                            dispatchQuantity({
                                                type: 'REMOVE',
                                            })
                                        }
                                    >
                                        <Typography
                                            variant="title"
                                            color={COLORS.primary}
                                        >
                                            −
                                        </Typography>
                                    </Pressable>


                                    <Typography
                                        variant="title"
                                        color={colors.text}
                                        style={styles.quantityText}
                                    >
                                        {quantity}
                                    </Typography>


                                    <Pressable
                                        style={[
                                            styles.quantityButton,
                                            {
                                                borderColor: COLORS.primary,
                                            },
                                        ]}
                                        onPress={() =>
                                            dispatchQuantity({
                                                type: 'ADD',
                                            })
                                        }
                                    >
                                        <Typography
                                            variant="title"
                                            color={COLORS.primary}
                                        >
                                            +
                                        </Typography>
                                    </Pressable>
                                </View>


                                {isFinished && (
                                    <Typography
                                        variant="body"
                                        color={COLORS.error}
                                        style={styles.flashEnded}
                                    >
                                        Hết giờ flash-sale
                                    </Typography>
                                )}


                                {/* BUTTONS */}
                                <View style={styles.modalButtons}>
                                    <ShopButton
                                        title="Đóng"
                                        variant="outline"
                                        onPress={handleCloseModal}
                                        style={styles.modalButton}
                                    />

                                    <ShopButton
                                        title="Xác nhận"
                                        onPress={handleConfirmOrder}
                                        disabled={isFinished}
                                        style={styles.modalButton}
                                    />
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};


/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingHorizontal: SIZES.md,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.lg,
    },

    loadingText: {
        marginTop: SIZES.md,
    },

    errorText: {
        textAlign: 'center',
        marginBottom: SIZES.lg,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SIZES.sm,
        marginBottom: SIZES.md,
    },

    themeButton: {
        borderWidth: 1,
        paddingHorizontal: SIZES.md,
        paddingVertical: SIZES.sm,
        borderRadius: SIZES.radius,
    },

    flashRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.sm,
        marginBottom: SIZES.md,
    },

    banner: {
        width: '100%',
        height: 140,
        borderRadius: SIZES.radius,
        marginBottom: SIZES.md,
    },

    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SIZES.sm,
        marginBottom: SIZES.sm,
    },

    chip: {
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: SIZES.md,
        paddingVertical: SIZES.sm,
    },

    listContent: {
        paddingBottom: SIZES.md,
    },

    productCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: SIZES.radius,
        padding: SIZES.sm,
        marginBottom: SIZES.sm,
    },

    productImage: {
        width: 70,
        height: 70,
        marginRight: SIZES.sm,
    },

    productInfo: {
        flex: 1,
        marginRight: SIZES.sm,
    },

    price: {
        marginTop: 4,
        fontWeight: '700',
    },

    categoryLabel: {
        marginTop: 4,
    },

    orderButton: {
        minWidth: 60,
    },

    emptyContainer: {
        padding: SIZES.xl,
        alignItems: 'center',
    },

    watermark: {
        textAlign: 'center',
        paddingVertical: SIZES.xs,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.lg,
    },

    modalContent: {
        width: '100%',
        maxWidth: 400,
        borderRadius: SIZES.radius,
        padding: SIZES.lg,
    },

    modalWatermark: {
        textAlign: 'center',
        marginBottom: SIZES.sm,
    },

    modalImage: {
        width: '100%',
        height: 150,
    },

    modalTitle: {
        marginTop: SIZES.sm,
        textAlign: 'center',
    },

    modalPrice: {
        textAlign: 'center',
        marginVertical: SIZES.sm,
        fontWeight: '700',
    },

    description: {
        marginTop: SIZES.sm,
    },

    quantityRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: SIZES.lg,
    },

    quantityButton: {
        width: 42,
        height: 42,
        borderWidth: 1,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
    },

    quantityText: {
        minWidth: 50,
        textAlign: 'center',
    },

    flashEnded: {
        textAlign: 'center',
        marginBottom: SIZES.sm,
    },

    modalButtons: {
        flexDirection: 'row',
        gap: SIZES.sm,
    },

    modalButton: {
        flex: 1,
    },
});


export default HomeScreen;