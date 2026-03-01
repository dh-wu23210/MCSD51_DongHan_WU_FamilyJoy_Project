/** Module: shop_assign. Handles shop assign behavior. */

document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('assignRewardModal');
  if (!modal) return;

  const title = document.getElementById('assignRewardTitle');
  const rewardName = document.getElementById('assignRewardName');
  const rewardDescription = document.getElementById('assignRewardDescription');
  const rewardPrice = document.getElementById('assignRewardPrice');
  const rewardIcon = document.getElementById('assignRewardIcon');
  const rewardStatusBadge = document.getElementById('assignRewardStatusBadge');
  const assignHidden = document.getElementById('assignRewardHiddenId');
  const unassignHidden = document.getElementById('unassignRewardId');
  const assignForm = document.getElementById('assignRewardForm');
  const unassignForm = document.getElementById('unassignRewardForm');

  /**
   * syncActionState: executes this module action.
   */
  function syncActionState(trigger) {
    if (!trigger) return;

    const rewardId = trigger.getAttribute('data-reward-id') || '';
    const rewardTitle = trigger.getAttribute('data-reward-name') || 'Reward';
    const description = (trigger.getAttribute('data-reward-description') || '').trim();
    const price = trigger.getAttribute('data-reward-price') || '0';
    const iconClass = trigger.getAttribute('data-reward-icon-class') || 'bi-gift';
    const isAssigned = trigger.getAttribute('data-reward-assigned') === '1';

    if (assignHidden) assignHidden.value = rewardId;
    if (unassignHidden) unassignHidden.value = rewardId;
    if (title) title.textContent = rewardTitle;
    if (rewardName) rewardName.textContent = rewardTitle;
    if (rewardDescription) rewardDescription.textContent = description || 'No description.';
    if (rewardPrice) rewardPrice.textContent = price;
    if (rewardIcon) rewardIcon.className = `bi ${iconClass} fs-1`;
    if (rewardStatusBadge) {
      rewardStatusBadge.textContent = isAssigned ? 'Active' : 'Deactive';
      rewardStatusBadge.classList.toggle('text-bg-success', isAssigned);
      rewardStatusBadge.classList.toggle('text-bg-secondary', !isAssigned);
    }

    if (assignForm) {
      assignForm.classList.toggle('d-none', isAssigned);
    }
    if (unassignForm) {
      unassignForm.classList.toggle('d-none', !isAssigned);
    }
  }

  modal.addEventListener('show.bs.modal', function (event) {
    const trigger = event.relatedTarget;
    syncActionState(trigger);
  });
});

