import { useCart } from '../../hooks/useCart';

export function CartBadge() {
  const { state } = useCart();
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0);
  if (!count) return null;
  return (
    <span className="bg-lupe-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {count > 99 ? '99+' : count}
    </span>
  );
}
