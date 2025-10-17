'use strict';

(function() {

// ======================== TOAST-FEEDBACK ========================
function showToast(message, isError = false, duration = 10000) {
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    if (isError) toast.classList.add('error');
    toast.innerHTML = message;

    document.body.appendChild(toast);

    const timer = setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 500);
    }, duration);

    toast.addEventListener('click', () => {
        clearTimeout(timer);
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 500);
    });
}

// ======================== SEND FORM WITH TOAST ========================
function sendForm(form) {
    const formData = new FormData(form);
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzyACCpMpqhNkwzsExWSbw1dpAAAB46NyocqohxFp95tBHJqQnSGJTstpL8J5-h5ajvJA/exec';

    showToast('⏳ Sending message…', false, 8000);

    function resetSliders() {
        const slider = document.getElementById('slider');
        const submitButton = document.getElementById('sendButton');
        if (slider && submitButton) {
            slider.value = 0;
            submitButton.disabled = true;
            submitButton.classList.remove('active');
        }
    }

    const payload = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        message: formData.get('message')
    };

    fetch(scriptURL, { method: 'POST', body: new URLSearchParams(payload) })
        .then(() => {
            showToast('✅ Your message has been sent successfully.');
            form.reset();
            resetSliders();
        })
        .catch(err => {
            console.warn(err);
            showToast('❌ Connection issues. Please try again later!', true);
        });
}

// ======================== ATTACH TO FORMS ========================
const sendButton = document.getElementById("sendButton");
if (sendButton) sendButton.addEventListener("click", e => { 
    e.preventDefault(); 
    const form = e.target.closest('form');

    const name = form.querySelector('[name="name"]');
    const phone = form.querySelector('[name="phone"]');

    if (!name.value.trim() || !phone.value.trim()) {
        showToast('❌ Please fill in all required fields.', true);
        return; 
    }

    if (typeof closePopup === 'function') closePopup(form);
    sendForm(form);
});

const slider = document.getElementById('slider');
const submitButton = document.getElementById('sendButton');
if (slider && submitButton) {
    submitButton.disabled = true;
    slider.addEventListener('input', function() {
        if (slider.value == slider.max) {
            submitButton.disabled = false;
            submitButton.classList.add('active');
        } else {
            submitButton.disabled = true;
            submitButton.classList.remove('active');
        }
    });
}

// ========================= Капитализация первой буквы =================

function capitalizeFirstLetter(input) {
    input.value = input.value.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

['sendName'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => capitalizeFirstLetter(el));
});

})();
