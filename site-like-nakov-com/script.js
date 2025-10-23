// Like button functionality
document.addEventListener('DOMContentLoaded', function() {
    const likeBtn = document.querySelector('.like-btn');
    let likeCount = 359;
    let liked = false;

    if (likeBtn) {
        likeBtn.addEventListener('click', function() {
            if (!liked) {
                likeCount++;
                liked = true;
                this.innerHTML = `<i class="fas fa-thumbs-up"></i> Like ${likeCount}`;
                this.style.background = '#365899';
            } else {
                likeCount--;
                liked = false;
                this.innerHTML = `<i class="fas fa-thumbs-up"></i> Like ${likeCount}`;
                this.style.background = '#4267B2';
            }
        });
    }

    // Smooth scroll animation for links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
