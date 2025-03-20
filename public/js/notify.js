function showToast(message) {
    
    // Get the toast container element
    const container = document.getElementById('toast-container');
    // Create a new toast element with Tailwind styling
    const toast = document.createElement('div');
    toast.className = 'bg-black text-white px-4 py-2 rounded shadow opacity-0 animate-fadeIn';
    toast.textContent = message;

    // Append the toast to the container
    container.appendChild(toast);

    // Remove fadeIn class after animation completes (0.5s) then schedule fadeOut after 3 seconds
    setTimeout(() => {
        toast.classList.remove('animate-fadeIn');
        toast.classList.add('animate-fadeOut');
        // Remove the toast element after the fadeOut animation completes (0.5s)
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 5000);
}