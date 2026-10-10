import { OrderData, OrderStatus } from '../types/furniture';

const LOCAL_STORAGE_KEY = 'balimoon_furniture_orders_v2';

/**
 * Saves order into browser localStorage for offline fallback cache
 */
export function saveLocalOrder(order: OrderData): void {
  if (typeof window === 'undefined' || !order.orderId) return;
  try {
    const existing = getLocalOrders();
    const updated = [order, ...existing.filter(o => o.orderId.toUpperCase() !== order.orderId.toUpperCase())];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save order to localStorage', e);
  }
}

/**
 * Retrieves local orders from browser localStorage
 */
export function getLocalOrders(): OrderData[] {
  if (typeof window === 'undefined') return [];
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_KEY);
    return item ? JSON.parse(item) : [];
  } catch (e) {
    console.error('Failed to read orders from localStorage', e);
    return [];
  }
}

/**
 * Updates status of a local order by Order ID
 */
export function updateLocalOrderStatus(orderId: string, newStatus: OrderStatus): void {
  if (typeof window === 'undefined' || !orderId) return;
  const orders = getLocalOrders();
  const index = orders.findIndex(o => o.orderId.toUpperCase() === orderId.trim().toUpperCase());
  if (index !== -1) {
    orders[index].status = newStatus;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
  }
}

/**
 * Deletes an order by Order ID from browser localStorage
 */
export function deleteLocalOrder(orderId: string): OrderData[] {
  if (typeof window === 'undefined' || !orderId) return getLocalOrders();
  try {
    const existing = getLocalOrders();
    const updated = existing.filter(o => o.orderId.toUpperCase() !== orderId.trim().toUpperCase());
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete order from localStorage', e);
    return getLocalOrders();
  }
}
