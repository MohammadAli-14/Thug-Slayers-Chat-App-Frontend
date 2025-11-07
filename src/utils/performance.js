// frontend/src/utils/performance.js
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
  return result;
};

// Usage in components
useEffect(() => {
  measurePerformance('MessageLoading', () => {
    getMessagesByUserId(selectedUser._id);
  });
}, [selectedUser]);