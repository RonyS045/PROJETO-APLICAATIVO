// Profile form handling
document.getElementById('profile-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const socialMedia = document.getElementById('social-media').value;

    localStorage.setItem('userProfile', JSON.stringify({ name, phone, email, socialMedia }));
    alert("Perfil salvo com sucesso!");
});

// Logo and photo upload preview
document.getElementById('logo-upload').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('logo-preview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('photo-upload').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('photo-preview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Gerar relatório
document.getElementById('generate-report').addEventListener('click', function() {
    const osNumber = document.getElementById('os-number').value;
    const client = document.getElementById('client').value;
    const reportData = `Número da OS: ${osNumber}\nCliente: ${client}`;
    
    const blob = new Blob([reportData], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'relatorio.txt';
    link.click();
});
