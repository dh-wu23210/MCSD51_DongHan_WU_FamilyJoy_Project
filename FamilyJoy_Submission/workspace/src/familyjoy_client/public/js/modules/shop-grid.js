/** Module: shop-grid. Handles shop-grid behavior. */

export function initShopGridViewport() {
  const scrollContainer = document.querySelector('[data-shop-grid-scroll]');
  const shouldScroll = scrollContainer && scrollContainer.getAttribute('data-should-scroll') === '1';
  if (!scrollContainer || !shouldScroll) return;

  /**
   * applyViewportHeight: executes this module action.
   */
  const applyViewportHeight = () => {
    const track = scrollContainer.querySelector('[data-shop-grid-track]');
    const firstCell = scrollContainer.querySelector('[data-shop-grid-cell]');
    if (!track || !firstCell) return;

    const trackStyle = window.getComputedStyle(track);
    const rowGap = Number.parseFloat(trackStyle.rowGap || trackStyle.gap || '0') || 0;
    const cellHeight = firstCell.getBoundingClientRect().height;
    if (!Number.isFinite(cellHeight) || cellHeight <= 0) return;

    scrollContainer.style.maxHeight = `${Math.ceil((cellHeight * 3) + (rowGap * 2))}px`;
  };

  applyViewportHeight();
  window.addEventListener('resize', applyViewportHeight);
}
