import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Navbar from "../Components/NavBar";
import PharmacyList from '../Components/PharmacyComponents/PharmacyList.jsx';
import PharmacyModal from '../Components/PharmacyComponents/PharmacyModal.jsx';
import PharmacyFilters from '../Components/PharmacyComponents/PharmacyFilters.jsx';

const Pharmacy = () => {
    const [medicines, setMedicines] = useState([]);
    const [photoUrls, setPhotoUrls] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchFilter, setSearchFilter] = useState('');
    const [filterOptions, setFilterOptions] = useState({
        requiereReceta: null,
        esAntibiotico: null,
        stock: null,
    });
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const response = await fetch('http://localhost:5000/home/getMedicines');
                if (!response.ok) throw new Error('Error al obtener los medicamentos');
                const data = await response.json();
                setMedicines(data);

                const urls = {};
                data.forEach(medicine => {
                    if (medicine.foto.data) {
                        const byteArray = new Uint8Array(medicine.foto.data);
                        const blob = new Blob([byteArray], { type: medicine.fotoMimeType || 'image/jpeg' });
                        urls[medicine.id_medicamento] = URL.createObjectURL(blob);
                    }
                });
                setPhotoUrls(urls);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMedicines();
    }, []);

    const filteredMedicines = medicines.filter((medicine) => {
        const matchesSearch =
            medicine.nombre.toLowerCase().includes(searchFilter.toLowerCase()) ||
            medicine.categoria.toLowerCase().includes(searchFilter.toLowerCase());

        const matchesReceta =
            filterOptions.requiereReceta === null ||
            (medicine.requiere_receta === 1 ? true : medicine.requiere_receta === 0 ? false : medicine.requiere_receta) === filterOptions.requiereReceta;
        const matchesAntibiotico =
            filterOptions.esAntibiotico === null ||
            (medicine.es_antibiotioco === 1 ? true : medicine.es_antibiotioco === 0 ? false : medicine.es_antibiotioco) === filterOptions.esAntibiotico;
        const matchesStock =
            filterOptions.stock === null || (filterOptions.stock ? medicine.stock > 0 : medicine.stock === 0);

        return matchesSearch && matchesReceta && matchesAntibiotico && matchesStock;
    });

    const backgroundVariants = {
        animate: {
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            transition: { duration: 15, repeat: Infinity, ease: 'linear' },
        },
    };

    const handleMoreInfoClick = (medicine) => {
        setSelectedMedicine(medicine);
    };

    const closeModal = () => {
        setSelectedMedicine(null);
    };

    const addToCart = (medicine) => {
        if (medicine.stock <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Sin stock',
                text: `${medicine.nombre} no tiene stock disponible.`,
            });
            return;
        }

        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id_medicamento === medicine.id_medicamento);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id_medicamento === medicine.id_medicamento
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...medicine, quantity: 1 }];
        });

        Swal.fire({
            icon: 'success',
            title: '¡Agregado!',
            text: `${medicine.nombre} ha sido agregado al carrito.`,
            timer: 1500,
            showConfirmButton: false,
        });
    };

    const removeFromCart = (id_medicamento) => {
        setCart((prevCart) => prevCart.filter((item) => item.id_medicamento !== id_medicamento));
    };

    const cartTotal = cart.reduce((total, item) => total + item.precio * item.quantity, 0);

    const createOrder = async (data, actions) => {
        try {
            const response = await fetch('http://localhost:5000/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ total: cartTotal }),
            });
            const orderData = await response.json();
            if (orderData.error) throw new Error(orderData.error);
            return orderData.orderID;
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo crear la orden de pago.',
            });
            throw error;
        }
    };

    const onApprove = async (data, actions) => {
        try {
            const captureResponse = await fetch('http://localhost:5000/api/capture-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderID: data.orderID }),
            });
            const captureData = await captureResponse.json();

            if (captureData.status === 'COMPLETED') {
                Swal.fire({
                    icon: 'success',
                    title: '¡Pago Exitoso!',
                    text: 'Tu compra ha sido procesada correctamente. Descargando factura...',
                });

                const purchaseDate = new Date().toISOString();
                const invoiceData = {
                    cart,
                    total: cartTotal,
                    date: purchaseDate,
                };

                const pdfResponse = await fetch('http://localhost:5000/api/generate-invoice', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(invoiceData),
                }).catch(err => {
                    console.error('Fetch error:', err);
                    throw err;
                });

                if (!pdfResponse.ok) {
                    const errorText = await pdfResponse.text();
                    throw new Error(`Error generating invoice: ${errorText}`);
                }

                const pdfBlob = await pdfResponse.blob();
                const pdfUrl = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.download = 'factura.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(pdfUrl);

                setCart([]);
                setIsCartOpen(false);
            } else {
                throw new Error('Payment not completed');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al procesar el pago o generar la factura: ' + error.message,
            });
        }
    };

    const onError = (err) => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error durante el proceso de pago: ' + err.message,
        });
    };

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorScreen error={error} />;

    return (
        <PayPalScriptProvider
            options={{
                'client-id': 'AZHoktB7ICTbiaqk7TXB_moLDgIN5Vo5vjc2StdbwiuyuOLLHxZ234Oh0-2-I14iC6hWr7-NXV_BIpl5',
                currency: 'MXN',
            }}
        >
            <Navbar />
            <motion.div
                variants={backgroundVariants}
                animate="animate"
                className="min-h-screen py-12 px-4 relative overflow-hidden"
                style={{
                    background: 'linear-gradient(45deg, #134e4a, #1e6159, #2c7a74, #1e6159, #134e4a)',
                    backgroundSize: '200% 200%',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="max-w-7xl mx-auto relative z-10"
                >
                    <h2 className="text-5xl font-extrabold text-white mb-10 text-center bg-gradient-to-r from-teal-200 to-teal-400 bg-clip-text text-transparent">
                        Farmacia Digital
                    </h2>

                    <PharmacyFilters
                        filterOptions={filterOptions}
                        setFilterOptions={setFilterOptions}
                        searchFilter={searchFilter}
                        setSearchFilter={setSearchFilter}
                    />

                    <PharmacyList
                        filteredMedicines={filteredMedicines}
                        photoUrls={photoUrls}
                        handleMoreInfoClick={handleMoreInfoClick}
                        addToCart={addToCart}
                    />
                </motion.div>

                <motion.div
                    className="fixed bottom-6 right-6 z-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="bg-teal-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg relative"
                    >
                        <span className="text-2xl">🛒</span>
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                {cart.length}
                            </span>
                        )}
                    </button>
                </motion.div>

                {isCartOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold text-teal-700">Carrito de Compras</h3>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            {cart.length === 0 ? (
                                <p className="text-gray-600">El carrito está vacío.</p>
                            ) : (
                                <>
                                    <ul className="space-y-4">
                                        {cart.map((item) => (
                                            <li key={item.id_medicamento} className="flex justify-between items-center border-b pb-2">
                                                <div>
                                                    <p className="text-teal-700 font-semibold">{item.nombre}</p>
                                                    <p className="text-gray-600 text-sm">
                                                        Precio: ${Number(item.precio).toFixed(2)} MXN | Cantidad: {item.quantity}
                                                    </p>
                                                    <p className="text-gray-600 text-sm">
                                                        Subtotal: ${(item.precio * item.quantity).toFixed(2)} MXN
                                                    </p>
                                                    <p className="text-gray-600 text-sm">
                                                        Categoría: {item.categoria} |
                                                        {item.requiere_receta === 1 ? ' Requiere receta' : ' Sin receta'} |
                                                        {item.es_antibiotioco === 1 ? ' Antibiótico' : ' No es antibiótico'}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id_medicamento)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Eliminar
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4 text-right">
                                        <p className="text-lg font-bold text-teal-700">
                                            Total: ${cartTotal.toFixed(2)} MXN
                                        </p>
                                    </div>
                                    <div className="mt-6">
                                        <PayPalButtons
                                            createOrder={createOrder}
                                            onApprove={onApprove}
                                            onError={onError}
                                            disabled={cartTotal <= 0}
                                        />
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}

                {selectedMedicine && (
                    <PharmacyModal
                        medicine={selectedMedicine}
                        photoUrl={photoUrls[selectedMedicine.id_medicamento]}
                        onClose={closeModal}
                    />
                )}
            </motion.div>
        </PayPalScriptProvider>
    );
};

const LoadingScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-teal-100">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full"
        />
    </div>
);

const ErrorScreen = ({ error }) => (
    <div className="min-h-screen flex items-center justify-center bg-teal-100">
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-red-100 p-6 rounded-xl shadow-lg text-red-700"
        >
            Error: {error}
        </motion.div>
    </div>
);

export default Pharmacy;