/**
 * Módulo de Servicio para la Lógica del Carrito de Compras
 * Encapsula todas las operaciones relacionadas con el carrito en localStorage.
 */
export const CartService = {
    getCart: () => {
        try {
            const cart = localStorage.getItem('LuxeCart');
            return cart ? JSON.parse(cart) : [];
        } catch (e) {
            console.error('Error al leer el carrito de localStorage:', e);
            return [];
        }
    },

    saveCart: (cart) => {
        try {
            localStorage.setItem('LuxeCart', JSON.stringify(cart));
            // Dispara un evento global para que otros módulos (ej. el ícono del carrito en la nav) puedan reaccionar.
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (e) {
            console.error('Error al guardar el carrito en localStorage:', e);
        }
    },

    addItem: (item, quantity = 1) => {
        const cart = CartService.getCart();
        const existingItem = cart.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ ...item, quantity });
        }
        CartService.saveCart(cart);
    },

    updateItemQuantity: (itemId, quantity) => {
        let cart = CartService.getCart();
        const item = cart.find(i => i.id === itemId);
        if (item) {
            if (quantity > 0) {
                item.quantity = quantity;
            } else {
                // Si la cantidad es 0 o menos, eliminamos el item
                cart = cart.filter(i => i.id !== itemId);
            }
            CartService.saveCart(cart);
        }
    },

    removeItem: (itemId) => {
        let cart = CartService.getCart();
        cart = cart.filter(i => i.id !== itemId);
        CartService.saveCart(cart);
    },

    clearCart: () => {
        localStorage.removeItem('LuxeCart');
        window.dispatchEvent(new Event('cartUpdated'));
    },

    getTotals: (cartItems) => {
        const subtotal = cartItems.reduce((acc, item) => {
            const price = parseFloat(String(item.precio).replace(/[^0-9.-]+/g,"")); // Limpia el formato de moneda
            return acc + (price * item.quantity);
        }, 0);
        
        // Lógica de descuentos/impuestos puede expandirse aquí
        const discount = 0;
        const total = subtotal - discount;
        
        return { subtotal, discount, total };
    },

    getTotalItems: () => {
        return CartService.getCart().reduce((acc, item) => acc + item.quantity, 0);
    }
};
