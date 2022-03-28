export function initSlots(instance, slots) {
  // 我们这里最粗暴的做法就是直接将 slots 挂载到 instance 上
  slots = Array.isArray(slots) ? slots : [slots]
  instance.slots = slots
}
