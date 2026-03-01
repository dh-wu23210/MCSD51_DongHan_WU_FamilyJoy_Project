/** Module: iconUtils. Handles iconUtils responsibilities. */

const ICON_CLASS_MAP = {
  gift: 'bi-gift',
  book: 'bi-book',
  game: 'bi-controller',
  sports: 'bi-trophy',
  snack: 'bi-cup-straw',
  outdoor: 'bi-tree',
  music: 'bi-music-note-beamed',
  art: 'bi-palette',
  home: 'bi-cake',
  // Legacy compatibility for existing stored icon keys
  pet: 'bi-paw',
  star: 'bi-star'
};

/**
 * getIconClass: executes this module action.
 */
function getIconClass(iconKey) {
  return ICON_CLASS_MAP[iconKey] || 'bi-gift';
}

/**
 * applyIconClass: executes this module action.
 */
function applyIconClass(items) {
  return (items || []).map((item) => ({
    ...item,
    iconClass: getIconClass(item.icon_key || item.iconKey)
  }));
}

module.exports = {
  ICON_CLASS_MAP,
  getIconClass,
  applyIconClass
};
