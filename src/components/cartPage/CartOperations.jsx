import CartItemCard from "./CartItemsCard";


export default function CartOperations({
  cartItems,
  toggleSelect,
  updateQty,
  removeItem,
  moveToWishlist,
  onGoToWishlist,
}) {
  const selectedCount = cartItems.filter((item) => item.selected).length;

  return (
    <div className="md:col-span-2">
      <h2 className="text-lg font-bold mb-4 text-[#723248]">
        {selectedCount}/{cartItems.length} ITEMS SELECTED
      </h2>

      {cartItems.map((item) => (
        <CartItemCard
          key={item._id}
          item={item}
          toggleSelect={toggleSelect}
          updateQty={updateQty}
          removeItem={removeItem}
          moveToWishlist={moveToWishlist}
        />
      ))}

      <div
        className="text-sm text-[#723248] underline cursor-pointer mt-2"
        onClick={onGoToWishlist}
      >
        Add More From Wishlist
      </div>
    </div>
  );
}
